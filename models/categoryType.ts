// models/categoryType.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryType extends Document {
  id: string;
  name: string;
  icon: string;
}

const CategoryTypeSchema = new Schema<ICategoryType>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
});

export default mongoose.models.CategoryType ||
  mongoose.model<ICategoryType>("CategoryType", CategoryTypeSchema);
