import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "../../../../models/user";

// GET all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
