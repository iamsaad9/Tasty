import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Locations from "@/../models/locations";

export async function GET() {
  try {
    await connectDB();

    const storedLocations = await Locations.find({}).lean();

    return NextResponse.json(storedLocations);
  } catch (error) {
    console.error("Failed to fetch areas:", error);
    return NextResponse.json(
      { error: "Failed to fetch areas" },
      { status: 500 }
    );
  }
}
