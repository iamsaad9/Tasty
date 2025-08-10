import mongoose, { Schema, Document } from "mongoose";

export interface IMenuLink extends Document {
  id: string;
  name: string;
  href: string;
  icon: string; // store the icon name, e.g., "MdSpaceDashboard"
  order: number;
  roles: string[]; // ["user"] or ["admin", "user"]
}

const MenuLinkSchema = new Schema<IMenuLink>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 },
  roles: { type: [String], default: ["user"] },
});

export default mongoose.models.MenuLink ||
  mongoose.model<IMenuLink>("MenuLink", MenuLinkSchema);
