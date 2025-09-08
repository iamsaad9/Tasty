// app/api/menuCategories/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import CategoryType from "@/../models/categoryType";

export async function GET() {
  try {
    // Connect to DB
    await connectDB();

    // Fetch all categories
    const categories = await CategoryType.find({}).lean();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu categories" },
      { status: 500 }
    );
  }
}
