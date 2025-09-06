import { type NextAuthOptions } from "next-auth";
import { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User, { IUser } from "@/../models/user";
import { determineUserRole } from "@/lib/roles";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 15000, // 15s
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        token.role = dbUser?.role || (user as any).role || "user";
        token.picture = user.image || dbUser?.image || token.picture || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        if (!session.user) {
          session.user = { id: "", role: "" };
        }
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.image = token.picture || null;
      }
      return session;
    },

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
  debug: process.env.NODE_ENV === "development",
};
