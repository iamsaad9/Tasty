import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Tables from "@/../models/tables";

export async function GET() {
  try {
    await connectDB();

    let tables = await Tables.find({}).lean();

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
