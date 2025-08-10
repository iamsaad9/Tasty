import mongoose, { Schema, Document } from "mongoose";

export interface IItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

export interface IDeliveryArea {
  name: string;
  postalCode: string;
  fee: number;
}

export interface IDelivery {
  isDeliverable: boolean;
  estimatedTime: string;
  baseFee: number;
  freeAbove: number;
  minOrder: number;
  areas: IDeliveryArea[];
}

export interface IMenuItem extends Document {
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  itemVariation: IItemVariation[];
  delivery: IDelivery;
}

const DeliveryAreaSchema = new Schema<IDeliveryArea>({
  name: { type: String, required: true },
  postalCode: { type: String, required: true },
  fee: { type: Number, required: true }
});

const DeliverySchema = new Schema<IDelivery>({
  isDeliverable: { type: Boolean, required: true },
  estimatedTime: { type: String, required: true },
  baseFee: { type: Number, required: true },
  freeAbove: { type: Number, required: true },
  minOrder: { type: Number, required: true },
  areas: { type: [DeliveryAreaSchema], default: [] }
});

const ItemVariationSchema = new Schema<IItemVariation>({
  type: { type: String, required: true },
  name: { type: String, required: true },
  price_multiplier: { type: Number, required: true }
});

const MenuItemSchema = new Schema<IMenuItem>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  diet: { type: [String], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  popularity: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  special: { type: Boolean, default: false },
  itemVariation: { type: [ItemVariationSchema], default: [] },
  delivery: { type: DeliverySchema, required: true }
});

export default mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
