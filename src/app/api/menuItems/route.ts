import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongoose';
import MenuItem from '@/../models/menuItems';

// GET - Fetch all menu items
export async function GET() {
  try {
    await connectDB();
    const menuItems = await MenuItem.find();
    return NextResponse.json(menuItems, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add a new menu item
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newItem = await MenuItem.create(body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
