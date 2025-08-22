import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  duration: number;
  guests: number;
  email: string;
  status: string;
  occasion: number;
  requests?: string;
  tableId?: string | null;
}

const ReservationSchema = new Schema<IReservation>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  phone: { type: String },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  guests: { type: Number, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true },
  occasion: { type: Number, required: true },
  requests: { type: String },
  tableId: { type: String },
});

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
