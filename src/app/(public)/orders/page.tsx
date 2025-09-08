"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, Divider, Button, Avatar, Tabs, Tab } from "@heroui/react";
import { useOrders } from "@/app/hooks/useOrders";
import PageBanner from "@/components/PageBanner";
import { OrderItem } from "@/types";

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

type OrderCardProps = {
  order: Order;
};

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

// Individual order card component
const OrderCard = ({ order }: OrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-4 rounded-sm hover:shadow-lg cursor-pointer transition-shadow duration-300 text-accent">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side - Status + Info */}
        <div className="flex flex-row items-center  gap-4 flex-1 ">
          {/* Status Icon */}
          <div className="flex items-center justify-center ">
            <motion.div
              className="text-4xl lg:text-6xl"
              animate={(() => {
                switch (order.orderStatus) {
                  case "pending":
                    return { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] };
                  case "confirmed":
                    return { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] };
                  case "preparing":
                    return { y: [0, -5, 0], rotate: [0, 15, -15, 0] };
                  case "ready":
                    return {
                      rotate: [-15, 15, -15, 15, 0],
                      scale: [1, 1.1, 1],
                    };
                  case "delivered":
                    return { x: [-3, 3, -3, 3, 0], y: [0, -2, 0] };
                  case "cancelled":
                    return { scale: [1, 0.9, 1], rotate: [0, -10, 10, 0] };
                  default:
                    return {};
                }
              })()}
              transition={{
                duration: order.orderStatus === "ready" ? 1.2 : 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: order.orderStatus === "ready" ? 0.5 : 0,
              }}
            >
              {(() => {
                switch (order.orderStatus) {
                  case "pending":
                    return "⏳";
                  case "confirmed":
                    return "✅";
                  case "preparing":
                    return "👨‍🍳";
                  case "ready":
                    return "🔔";
                  case "delivered":
                    return "🚚";
                  case "cancelled":
                    return "❌";
                  default:
                    return "📦";
                }
              })()}
            </motion.div>
          </div>

          {/* Order Info */}
          <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-2 mb-1">
              <h1 className="uppercase font-bold text-lg sm:text-xl">
                {order.orderStatus}
              </h1>
              <h2 className="text-sm sm:text-base md:text-lg font-semibold line-clamp-1">
                {order.orderNumber}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-2">
              <span>{order.orderDate}</span>
              <span className="hidden sm:block">•</span>
              <span>
                {order.deliveryMode === "delivery"
                  ? "🚚 Delivery"
                  : "🏪 Pickup"}
              </span>
              <span className="hidden sm:block">•</span>
              <span>{order.items.length} items</span>
            </div>

            {/* Customer Info */}
            <div className="hidden sm:flex items-center gap-2 mt-2 sm:mt-0">
              <Avatar className=" w-8 h-8 sm:w-10 sm:h-10" />
              <div className="flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {order.customer.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Price + Button */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 w-full md:w-auto">
          <h1 className="text-base sm:text-lg md:text-2xl font-semibold">
            ${order.pricing.total.toFixed(2)}
          </h1>
          <Button
            size="sm"
            variant="solid"
            onPress={() => setIsExpanded(!isExpanded)}
            className="w-auto sm:w-full"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </div>

      {/* Expandable Content */}
      <div className="mt-4">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            <Divider />

            {/* Items Details */}
            <div>
              <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
              <div className="space-y-3">
                {order.items.map((item: OrderItem, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.itemImage}
                        alt={item.itemName || "Item image"}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-md object-cover"
                      />
                      <div className="text-xs sm:text-sm">
                        <p className="font-medium">{item.itemName}</p>
                        {item.itemVariations && (
                          <p className="text-gray-600">
                            {Object.entries(item.itemVariations)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                        {item.itemInstructions && (
                          <p className="text-blue-600 text-[11px] sm:text-xs">
                            Note: {item.itemInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs sm:text-sm">
                      <p className="font-medium">
                        ${item.itemBasePrice?.toFixed(2)}
                      </p>
                      <p className="text-gray-600">Qty: {item.itemQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-medium">{order.selectedLocation}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              {order.customer.address && (
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-600">Delivery Address</p>
                  <p className="font-medium">{order.customer.address}</p>
                </div>
              )}
              {order.estimatedDeliveryTime && (
                <div>
                  <p className="text-gray-600">Estimated Time</p>
                  <p className="font-medium">{order.estimatedDeliveryTime}</p>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gray-50 p-3 rounded-lg text-xs sm:text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.pricing.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.pricing.tax.toFixed(2)}</span>
                </div>
                {order.pricing.delivery > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${order.pricing.delivery.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tip</span>
                  <span>${order.pricing.tip.toFixed(2)}</span>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

// Main Orders Page Component
export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("current");
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const { data: orders } = useOrders();

  useEffect(() => {
    if (!email || !orders) return;

    const filtered = orders.filter(
      (order: Order) => order.customer.email === email
    );
    setUserOrders(filtered);
  }, [orders, email]);

  const currentOrders = userOrders.filter((order) =>
    ["pending", "confirmed", "preparing", "ready"].includes(order.orderStatus)
  );

  const previousOrders = userOrders.filter((order) =>
    ["delivered", "cancelled"].includes(order.orderStatus)
  );

  return (
    <div className="min-h-screen">
      <PageBanner
        title="My Orders"
        image="/images/PageBanners/reservationPage.jpg"
      />
      <div className="max-w-6xl mx-auto my-5 p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gray-600">
            Track your current orders and view order history
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(String(key))}
            variant="bordered"
            color="primary"
            className="w-full"
          >
            <Tab
              key="current"
              title={
                <div className="flex items-center space-x-2">
                  <span>Current Orders ({currentOrders.length})</span>
                </div>
              }
            />
            <Tab
              key="previous"
              title={
                <div className="flex items-center space-x-2">
                  <span>Order History ({previousOrders.length})</span>
                </div>
              }
            />
          </Tabs>
        </div>

        {/* Orders Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === "current" ? (
            <div>
              {currentOrders.length > 0 ? (
                <div className="grid gap-4">
                  {currentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold mb-2 text-accent">
                    No Current Orders
                  </h3>
                  <p className="text-gray-600">
                    You don&apos;t have any active orders at the moment.
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <div>
              {previousOrders.length > 0 ? (
                <div className="grid gap-4">
                  {previousOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2 text-accent">
                    No Order History
                  </h3>
                  <p className="text-gray-600">
                    Your completed orders will appear here.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
