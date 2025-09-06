// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/../models/user";
import bcrypt from "bcryptjs";
import { determineUserRole } from "@/lib/roles";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password"); // Don't return passwords
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role based on email
    const userRole = determineUserRole(email);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole, // This will be "admin" for emails in ADMIN_EMAILS, "user" otherwise
      provider: "credentials",
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
