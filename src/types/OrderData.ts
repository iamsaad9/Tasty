import { OrderItem } from "./OrderItem";

export interface OrderData {
  id: string;
  orderNumber: string;
  estimatedDeliveryTime?: string | undefined;
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address?: string;
    orderNotes?: string;
  };
  items: OrderItem[];
  pricing: {
    subTotal: number;
    tax: number;
    delivery: number;
    tip: number;
    total: number;
  };
  deliveryMode: "delivery" | "pickup";
  paymentMethod: "Card" | "Cash";
  selectedLocation: string;
  paymentStatus?: "pending" | "completed" | "failed";
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
}
