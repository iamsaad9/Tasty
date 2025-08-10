// app/api/menuCategories/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongoose";
import DietaryPreferce from '@/../models/dietaryPreference';

export async function GET() {
  try {
    // Connect to DB
    await connectDB();

    // Fetch all preferences
    const preferences = await DietaryPreferce.find({}).lean();

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error('Error fetching dietary preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dietary preferences' },
      { status: 500 }
    );
  }
}
