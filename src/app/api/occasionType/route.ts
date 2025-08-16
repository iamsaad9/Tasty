// app/api/occasionType/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import OccasionType from "@/../models/occasionType";

export async function GET() {
  try {
    await connectDB();

    let occasionTypes = await OccasionType.find({}).lean();

    if (occasionTypes.length === 0) {
      await OccasionType.insertMany([
        { id: "1", key: "birthday", label: "Birthday" },
        { id: "2", key: "anniversary", label: "Anniversary" },
        { id: "3", key: "wedding", label: "Wedding" },
        { id: "4", key: "business", label: "Business" },
        { id: "5", key: "date", label: "Date" },
        { id: "6", key: "family", label: "Family" },
        { id: "7", key: "other", label: "Other" },
      ]);

      // fetch again after insert
      occasionTypes = await OccasionType.find({}).lean();
    }

    return NextResponse.json(occasionTypes, { status: 200 });
  } catch (error) {
    console.error("Error fetching Occasion types:", error);
    return NextResponse.json(
      { error: "Failed to fetch Occasion types" },
      { status: 500 }
    );
  }
}
