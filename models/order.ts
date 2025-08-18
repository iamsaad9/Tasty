// models/order.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations?: { [key: string]: string };
  itemInstructions?: string;
}
export interface ICustomer {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address?: string;
  orderNotes?: string;
}

export interface IPricing {
  subTotal: number;
  tax: number;
  delivery: number;
  tip: number;
  total: number;
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  customer: ICustomer;
  items: IOrderItem[];
  pricing: IPricing;
  deliveryMode: "delivery" | "pickup";
  paymentMethod: "Card" | "Cash";
  selectedLocation: string;
  paymentStatus: "pending" | "completed" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
  orderDate: Date;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  itemId: { type: Number }, // ✅ Changed to Number
  itemName: { type: String }, // ✅ Removed required: true
  itemImage: { type: String }, // ✅ Removed required: true
  itemBasePrice: { type: Number, required: true },
  itemQuantity: { type: Number, required: true },
  itemVariations: { type: Schema.Types.Mixed },
  itemInstructions: { type: String },
});

const CustomerSchema = new Schema<ICustomer>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String },
  orderNotes: { type: String },
});

const PricingSchema = new Schema<IPricing>({
  subTotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  delivery: { type: Number, required: true },
  tip: { type: Number, required: true },
  total: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: CustomerSchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    pricing: { type: PricingSchema, required: true },
    deliveryMode: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Cash"],
      required: true,
    },
    selectedLocation: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    orderDate: { type: Date, required: true },
    estimatedDeliveryTime: { type: Date },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt automatically
  }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
