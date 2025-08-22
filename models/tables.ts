// models/tables.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITables extends Document {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  description: string;
}

const TablesSchema = new Schema<ITables>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Tables ||
  mongoose.model<ITables>("Tables", TablesSchema);
