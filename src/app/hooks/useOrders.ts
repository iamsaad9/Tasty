// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface OrderItem {
  itemId?: number; // ✅ Changed to number
  itemName?: string; // ✅ Made optional with ?
  itemImage?: string; // ✅ Made optional with ?
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations?: { [key: string]: string }; // ✅ Changed to exact type
  itemInstructions?: string;
}

interface Customer {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address?: string;
  orderNotes?: string;
}

interface Pricing {
  subTotal: number;
  tax: number;
  delivery: number;
  tip: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  pricing: Pricing;
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
  orderDate: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customer: Customer;
  items: OrderItem[];
  pricing: Pricing;
  deliveryMode: "delivery" | "pickup";
  paymentMethod: "Card" | "Cash";
  selectedLocation: string;
}

// Hook to fetch all orders
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      console.log("Fetching orders using API");
      const res = await fetch("/api/order");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<Order[]>;
    },
    staleTime: 30 * 1000, // 30 seconds - orders change frequently
  });
}

// Hook to fetch single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      console.log("Fetching order:", orderId);
      const res = await fetch(`/api/order/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json() as Promise<Order>;
    },
    enabled: !!orderId,
    staleTime: 30 * 1000,
  });
}

// Hook to create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      console.log("Creating order:", orderData);
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// Hook to update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      orderStatus,
      paymentStatus,
    }: {
      orderId: string;
      orderStatus?: string;
      paymentStatus?: string;
    }) => {
      console.log("Updating order status:", orderId, {
        orderStatus,
        paymentStatus,
      });

      const res = await fetch(`/api/order`, {
        // Changed to /api/orders
        method: "PUT", // Changed to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          orderStatus,
          paymentStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });
}
