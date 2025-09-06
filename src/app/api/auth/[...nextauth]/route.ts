// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User, { IUser } from "@/../models/user";
import { determineUserRole } from "@/lib/roles";

// ---------- TypeScript Augmentation ----------
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image: string | null;
    };
  }

  interface User {
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    picture?: string | null;
  }
}

// ---------- Auth Options ----------
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user: IUser | null = await User.findOne({
          email: credentials.email,
        });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || null,
        } as NextAuthUser;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Runs whenever a JWT is created/updated
    async jwt({ token, user }) {
      if (user) {
        // On first login, load role from DB if not provided
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });

        token.role = dbUser?.role || user.role || "user";
        token.picture = user.image || dbUser?.image || token.picture || null;
      }
      return token;
    },

    // Runs whenever a session is checked
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role;
        session.user.image = token.picture || null;
      }
      return session;
    },

    // Runs whenever a user signs in
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        await connectDB();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            role: determineUserRole(user.email!),
            provider: account.provider,
            image: user.image || null,
          });
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// ---------- Export Handler ----------
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
