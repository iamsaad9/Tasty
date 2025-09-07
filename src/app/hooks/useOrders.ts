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

// Additional interfaces for API responses
interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  message?: string;
  estimatedDeliveryTime?: string;
  success?: boolean;
  orderStatus?: string | undefined;
}

interface UpdateOrderResponse {
  id: string;
  orderStatus?: string;
  paymentStatus?: string;
  message?: string;
  success?: boolean;
}

interface ApiErrorResponse {
  error: string;
  message?: string;
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
    mutationFn: async (
      orderData: CreateOrderData
    ): Promise<CreateOrderResponse> => {
      console.log("Creating order:", orderData);

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Read response as text first
      const text = await res.text();
      console.log("Server response text:", text);

      // Try parsing JSON safely
      let data: CreateOrderResponse | ApiErrorResponse;
      try {
        data = text ? JSON.parse(text) : { error: "Empty response" };
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        throw new Error("Invalid JSON response from server");
      }

      // Handle errors
      if (!res.ok) {
        const errorData = data as ApiErrorResponse;
        const errorMsg =
          errorData?.error || `Failed to create order (status ${res.status})`;
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      return data as CreateOrderResponse;
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
    }): Promise<UpdateOrderResponse> => {
      console.log("Updating order status:", orderId, {
        orderStatus,
        paymentStatus,
      });

      const res = await fetch(`/api/order`, {
        method: "PUT",
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
        const errorData: ApiErrorResponse = await res.json();
        throw new Error(errorData.error || "Failed to update order");
      }

      return res.json() as Promise<UpdateOrderResponse>;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });
}
