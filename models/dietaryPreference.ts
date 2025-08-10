// models/dietaryPreference.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IDietaryPreference extends Document {
  id: number;
  label: string;
  value: string;
}

const MenuCategorySchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
});

export default mongoose.models.DietaryPreference ||
  mongoose.model<IDietaryPreference>("DietaryPreference", MenuCategorySchema);
