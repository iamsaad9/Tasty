// models/VariationType.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IVariationType extends Document {
  id: string;
  label: string;
}

const VariationTypeSchema = new Schema<IVariationType>(
  {
    id: { type: String, required: true, unique: true },
    label: { type: String, required: true },
  }
);

export default mongoose.models.VariationType ||
  mongoose.model<IVariationType>("VariationType", VariationTypeSchema);
