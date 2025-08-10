import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import VariationType from '@/../models/variationType';


export async function GET() {
  try {
    await connectDB();

    const types = await VariationType.find({}).lean();

  
    return NextResponse.json(types, { status: 200 });
  } catch (error) {
    console.error('Error fetching variation types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variation types' },
      { status: 500 }
    );
  }
}
