// app/api/reservations/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Reservation from "@/../models/reservation";

// GET - Fetch all reservations
export async function GET() {
  try {
    await connectDB();
    const reservations = await Reservation.find();
    return NextResponse.json(reservations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add a new reservation
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newReservation = await Reservation.create(body);
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update an existing reservation
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json(
        { error: "Missing _id for update" },
        { status: 400 }
      );
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      body._id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
