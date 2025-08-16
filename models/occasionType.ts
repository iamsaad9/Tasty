// models/occasionType.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICOccasionType extends Document {
  id: number;
  key: string;
  label: string;
}

const OccasionTypeSchema = new Schema<ICOccasionType>({
  id: { type: Number, required: true, unique: true },
  key: { type: String, required: true },
  label: { type: String, required: true },
});

export default mongoose.models.OccasionType ||
  mongoose.model<ICOccasionType>("OccasionType", OccasionTypeSchema);
