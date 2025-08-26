"use client";
import React, { useState, JSX } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Home,
  Sun,
  Wine,
  Lock,
  MessageSquare,
} from "lucide-react";
import { Select, SelectItem } from "@heroui/react";
import PageBanner from "@/components/PageBanner";
import { useRouter } from "next/navigation";
import { useReservations } from "@/app/hooks/useReservations";
import { useTables } from "@/app/hooks/useTables";
import { useQueryClient } from "@tanstack/react-query";
import { Reservation } from "@/types";
// import { Tables } from "@/types";
import LoadingScreen from "@/components/Loading";
import { addToast, Tooltip as Tip } from "@heroui/react";
import { useOrders } from "@/app/hooks/useOrders";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

interface StatData {
  value: string | number;
  change: number;
  period: string;
}

interface Stats {
  revenue: StatData;
  orders: StatData;
  reservations: StatData;
  customers: StatData;
}

interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface Tables {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string;
  isAvailable: boolean;
}

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("today");
  const router = useRouter();
  const { data: reservations, isLoading, error } = useReservations();
  const queryClient = useQueryClient();
  const [selectedTables, setSelectedTables] = useState<{
    [key: string]: string;
  }>({});
  const { data: mockTables } = useTables();
  const { data: orders } = useOrders();

  // Mock data with proper TypeScript typing
  const stats: Stats = {
    revenue: { value: 12450, change: 12.5, period: "vs yesterday" },
    orders: { value: 148, change: 8.2, period: "vs yesterday" },
    reservations: { value: 32, change: -2.1, period: "vs yesterday" },
    customers: { value: 1240, change: 15.3, period: "vs last week" },
  };

  const sortedReservations = [...(reservations || [])]
    .filter((i) => i.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const revenueData: RevenueData[] = [
    { name: "Mon", revenue: 2400, orders: 24 },
    { name: "Tue", revenue: 1398, orders: 18 },
    { name: "Wed", revenue: 3200, orders: 32 },
    { name: "Thu", revenue: 2780, orders: 28 },
    { name: "Fri", revenue: 3908, orders: 45 },
    { name: "Sat", revenue: 4800, orders: 52 },
    { name: "Sun", revenue: 3490, orders: 38 },
  ];

  const orderStatusData: OrderStatusData[] = [
    { name: "Completed", value: 65, color: "#10b981" },
    { name: "In Progress", value: 20, color: "#ffb400" },
    { name: "Pending", value: 10, color: "#6366f1" },
    { name: "Cancelled", value: 5, color: "#ef4444" },
  ];

  // const recentOrders: RecentOrder[] = [
  //   {
  //     id: "#001",
  //     customer: "John Doe",
  //     items: 3,
  //     total: 45.5,
  //     status: "preparing",
  //     time: "5 min ago",
  //   },
  //   {
  //     id: "#002",
  //     customer: "Sarah Smith",
  //     items: 2,
  //     total: 32.0,
  //     status: "ready",
  //     time: "12 min ago",
  //   },
  //   {
  //     id: "#003",
  //     customer: "Mike Johnson",
  //     items: 4,
  //     total: 68.75,
  //     status: "delivered",
  //     time: "18 min ago",
  //   },
  //   {
  //     id: "#004",
  //     customer: "Emily Brown",
  //     items: 1,
  //     total: 15.25,
  //     status: "pending",
  //     time: "25 min ago",
  //   },
  // ];

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    period,
    icon: Icon,
    color,
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp
              className={`h-4 w-4 mr-1 ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-sm text-gray-500 ml-2">{period}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 capitalize";
      case "confirmed":
        return "bg-green-100 text-green-800 capitalize";
      case "ready":
        return (
          "text-white" +
          " " +
          "px-2 py-1 rounded-full text-xs font-medium capitalize" +
          " " +
          "bg-[--theme]"
        );
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-200 text-gray-800 capitalize";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderTime = (orderDate: string) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(orderDate).getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };

  const handleStatusUpdate = async (
    reservation: Reservation,
    newStatus: string
  ) => {
    if (!reservation.id) {
      console.error("Reservation _id is missing");
      return;
    }

    console.log("Updating reservation with _id:", reservation.id);
    try {
      const res = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: reservation.id,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update reservation status");
        throw new Error("Failed to update reservation");
      }

      console.log("Reservation status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["Reservations"] });
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleConfirmWithTable = async (reservation: Reservation) => {
    if (!reservation.id) {
      console.error("Reservation _id is missing");
      return;
    }

    const selectedTableId = selectedTables[reservation.id];
    if (!selectedTableId) {
      console.error("No table selected");
      return;
    }

    // Get available tables for this reservation
    const availableTables = getAvailableTablesForReservation(
      reservation,
      reservations || [], // Your complete reservations list
      mockTables || []
    );

    const selectedTable = availableTables.find(
      (table) => table.id === selectedTableId
    );

    if (!selectedTable || !selectedTable.isAvailable) {
      addToast({
        title: "Error",
        description: "Selected table is no longer available for this time slot",
        color: "danger",
      });
      return;
    }

    console.log("Confirming reservation with table:", reservation._id);
    try {
      const res = await fetch("/api/reservations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reservation._id,
          status: "confirmed",
          tableId: selectedTable.id,
        }),
      });

      if (!res.ok) {
        addToast({
          title: "Failed",
          description: `Failed to confirm reservation`,
          color: "danger",
        });
        throw new Error("Failed to confirm reservation");
      }

      addToast({
        title: "Success",
        description: `Successfully confirmed reservation with table ${selectedTable.name}`,
        color: "success",
      });

      // Clear the selected table for this reservation
      setSelectedTables((prev) => {
        const updated = { ...prev };
        delete updated[reservation.id || ""];
        return updated;
      });

      queryClient.invalidateQueries({ queryKey: ["Reservations"] });
    } catch (error) {
      addToast({
        title: "Failed",
        description: `Error confirming reservation`,
        color: "danger",
      });
      console.error("Error confirming reservation:", error);
    }
  };

  const handleTableSelect = (reservationId: string, tableId: string) => {
    setSelectedTables((prev) => ({
      ...prev,
      [reservationId]: tableId,
    }));
  };

  const upcomingReservations =
    sortedReservations
      ?.filter((reservation) => {
        const reservationDate = new Date(reservation.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservationDate >= today && reservation.status !== "cancelled";
      })
      .slice(0, 5) || [];

  // Enhanced reservation component with table availability checking

  interface Reservation {
    id: number;
    _id?: string; // MongoDB ID
    name: string;
    date: string;
    phone?: string;
    time: string;
    duration: number; // in hours
    guests: number;
    email: string;
    status: string;
    occasion: number;
    requests?: string;
    tableId?: string | null;
  }

  interface Tables {
    id: string;
    name: string;
    capacity: number;
    location: string;
    description: string;
    isAvailable: boolean;
  }

  // Utility function to check if two time ranges overlap
  const checkTimeOverlap = (
    startTime1: string,
    duration1: number,
    startTime2: string,
    duration2: number
  ): boolean => {
    const parseTime = (timeStr: string): number => {
      // Handle both "HH:MM" and "HH:MM AM/PM" formats
      let cleanTime = timeStr.toLowerCase().replace(/\s*(am|pm)\s*$/, "");
      const [hours, minutes] = cleanTime.split(":").map(Number);

      // Convert to 24-hour format if needed
      let hour24 = hours;
      if (timeStr.toLowerCase().includes("pm") && hours !== 12) {
        hour24 = hours + 12;
      } else if (timeStr.toLowerCase().includes("am") && hours === 12) {
        hour24 = 0;
      }

      return hour24 * 60 + (minutes || 0); // Convert to minutes
    };

    try {
      const start1 = parseTime(startTime1);
      const end1 = start1 + duration1 * 60; // duration in minutes
      const start2 = parseTime(startTime2);
      const end2 = start2 + duration2 * 60;

      // Debug logging
      console.log("Time overlap check:", {
        time1: `${startTime1} (${duration1}h)`,
        time2: `${startTime2} (${duration2}h)`,
        start1Minutes: start1,
        end1Minutes: end1,
        start2Minutes: start2,
        end2Minutes: end2,
        overlap: start1 < end2 && start2 < end1,
      });

      // Check if ranges overlap
      return start1 < end2 && start2 < end1;
    } catch (error) {
      console.error("Error parsing time:", error, { startTime1, startTime2 });
      return false;
    }
  };

  const getAvailableTablesForReservation = (
    currentReservation: Reservation,
    allReservations: Reservation[],
    allTables: Tables[]
  ): (Tables & { unavailableReason?: "database" | "time_conflict" })[] => {
    return allTables.map((table) => {
      // Check if this table has any conflicting reservations
      const hasTimeConflict = allReservations.some((reservation) => {
        // Skip the current reservation being processed
        if (
          reservation.id === currentReservation.id ||
          reservation._id === currentReservation._id
        ) {
          return false;
        }

        // Only check confirmed reservations that are assigned to this specific table
        if (
          reservation.status !== "confirmed" ||
          !reservation.tableId ||
          reservation.tableId !== table.id
        ) {
          return false;
        }

        // Check if dates match (ensure both are in the same format)
        if (reservation.date !== currentReservation.date) {
          return false;
        }

        // Debug logging
        console.log(`Checking conflict for table ${table.name}:`, {
          existingReservation: {
            name: reservation.name,
            time: reservation.time,
            duration: reservation.duration,
            tableId: reservation.tableId,
          },
          newReservation: {
            name: currentReservation.name,
            time: currentReservation.time,
            duration: currentReservation.duration,
          },
        });

        // Check time overlap
        const overlap = checkTimeOverlap(
          reservation.time,
          reservation.duration,
          currentReservation.time,
          currentReservation.duration
        );

        if (overlap) {
          console.log(`Time conflict detected for table ${table.name}`);
        }

        return overlap;
      });

      // Determine availability and reason
      let isAvailable = true;
      let unavailableReason: "database" | "time_conflict" | undefined;

      if (!table.isAvailable) {
        isAvailable = false;
        unavailableReason = "database";
      } else if (hasTimeConflict) {
        isAvailable = false;
        unavailableReason = "time_conflict";
      }

      return {
        ...table,
        isAvailable,
        unavailableReason,
      };
    });
  };

  if (isLoading || !mockTables || error) {
    return <LoadingScreen showLoading={true} />;
  }

  return (
    <>
      <PageBanner
        title="Admin Dashboard"
        image="/images/PageBanners/adminPage.jpg"
      />
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-accent">
                Restaurant Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening at your restaurant today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dropdown className="text-accent">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    endContent={<ChevronDown size={16} />}
                  >
                    {timeRange === "today" && "Today"}
                    {timeRange === "week" && "This Week"}
                    {timeRange === "month" && "This Month"}
                    {timeRange === "year" && "This Year"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Time range selection"
                  selectedKeys={[timeRange]}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    setTimeRange(selectedKey as string);
                  }}
                >
                  <DropdownItem key="today">Today</DropdownItem>
                  <DropdownItem key="week">This Week</DropdownItem>
                  <DropdownItem key="month">This Month</DropdownItem>
                  <DropdownItem key="year">This Year</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`$${stats.revenue.value.toLocaleString()}`}
              change={stats.revenue.change}
              period={stats.revenue.period}
              icon={DollarSign}
              color="bg-green-500"
            />
            <StatCard
              title="Orders"
              value={stats.orders.value}
              change={stats.orders.change}
              period={stats.orders.period}
              icon={ShoppingBag}
              color="bg-blue-500"
            />
            <StatCard
              title="Reservations"
              value={stats.reservations.value}
              change={stats.reservations.change}
              period={stats.reservations.period}
              icon={Calendar}
              color="bg-purple-500"
            />
            <StatCard
              title="Customers"
              value={stats.customers.value}
              change={stats.customers.change}
              period={stats.customers.period}
              icon={Users}
              color="bg-[--theme]"
            />
          </div>

          {/* Quick Actions */}
          <div className="my-8 bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-accent mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/admin/manageMenu")}
                className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer rounded-md hover:bg-opacity-20 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Manage Menu Items
              </button>
              <button
                onClick={() => router.push("/admin/processOrders")}
                className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-md hover:bg-green-100 cursor-pointer transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                Process Order
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 cursor-pointer transition-colors">
                <Users className="h-5 w-5" />
                Manage Staff
              </button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-(--secondary-theme) mb-4">
                Revenue Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `$${value}`,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="var(--theme)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-(--secondary-theme) mb-4">
                Order Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                    }
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-accent">
                  Recent Orders
                </h3>
                <button className="text-theme hover:opacity-80 font-medium flex items-center gap-1 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {orders?.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-sm text-(--secondary-theme)">
                          {order.orderNumber}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.customer.firstName} • {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">
                        ${order.pricing.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getOrderTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Reservations */}
            <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-accent">
                  Upcoming Reservations
                </h3>
                <button className="text-theme hover:opacity-80 font-medium flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {upcomingReservations.map((reservation) => {
                  // Guard against undefined mockTables
                  const availableTablesForReservation = mockTables
                    ? getAvailableTablesForReservation(
                        reservation,
                        reservations || [], // All reservations
                        mockTables
                      )
                    : [];

                  // Debug logging
                  console.log(
                    "Reservation:",
                    reservation.name,
                    "Date:",
                    reservation.date,
                    "Time:",
                    reservation.time
                  );
                  console.log(
                    "Available tables for this reservation:",
                    availableTablesForReservation.map((t) => ({
                      name: t.name,
                      isAvailable: t.isAvailable,
                      unavailableReason: t.unavailableReason,
                    }))
                  );
                  console.log(
                    "All reservations being checked:",
                    sortedReservations?.map((r) => ({
                      name: r.name,
                      status: r.status,
                      tableId: r.tableId,
                      date: r.date,
                      time: r.time,
                    }))
                  );

                  return (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      {/* Left side - Customer info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-accent text-sm">
                              {reservation.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {reservation.guests} guests • {reservation.date} •{" "}
                              {reservation.time} • {reservation.duration}h
                            </p>
                            {reservation.requests && (
                              <Tip
                                placement="bottom"
                                content={
                                  <div className="max-w-xs whitespace-normal break-words p-2">
                                    {reservation.requests}
                                  </div>
                                }
                                showArrow={true}
                                className="text-accent max-w-xs "
                                classNames={{
                                  base: "max-w-xs",
                                  content:
                                    "text-xs max-w-xs whitespace-normal break-words",
                                }}
                              >
                                <MessageSquare className="h-5 w-5 mt-2 text-theme" />
                              </Tip>
                            )}
                          </div>
                          <div className="text-xs text-accent bg-orange-300 px-2 py-1 rounded capitalize">
                            {reservation.status}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {reservation.status === "pending" && (
                          <>
                            <Select
                              placeholder="Table"
                              aria-label="Select a table"
                              size="sm"
                              className="min-w-32 text-accent"
                              classNames={{
                                popoverContent: "min-w-60",
                                listboxWrapper: "text-accent min-w-60",
                              }}
                              selectedKeys={
                                selectedTables[reservation.id]
                                  ? [selectedTables[reservation.id].toString()]
                                  : []
                              }
                              onSelectionChange={(keys) => {
                                const selectedKey = Array.from(
                                  keys
                                )[0] as string;
                                if (selectedKey && reservation.id) {
                                  // Check if selected table is available
                                  const selectedTable =
                                    availableTablesForReservation.find(
                                      (t) => t.id === selectedKey
                                    );
                                  if (
                                    selectedTable &&
                                    !selectedTable.isAvailable
                                  ) {
                                    // Show immediate feedback
                                    const reason =
                                      selectedTable.unavailableReason ===
                                      "database"
                                        ? "This table is currently unavailable"
                                        : "This table has a time conflict with another reservation";

                                    addToast({
                                      title: "Table Unavailable",
                                      description: reason,
                                      color: "danger",
                                    });
                                    return; // Don't select unavailable table
                                  }

                                  handleTableSelect(
                                    reservation.id.toString(),
                                    selectedKey
                                  );
                                }
                              }}
                            >
                              {availableTablesForReservation.map((table) => {
                                const iconMap: Record<string, JSX.Element> = {
                                  indoor: (
                                    <Home className="w-4 h-4 text-blue-500" />
                                  ),
                                  outdoor: (
                                    <Sun className="w-4 h-4 text-green-500" />
                                  ),
                                  bar: (
                                    <Wine className="w-4 h-4 text-purple-500" />
                                  ),
                                  private: (
                                    <Lock className="w-4 h-4 text-amber-500" />
                                  ),
                                };

                                // Determine the unavailability message
                                const getUnavailableMessage = () => {
                                  if (table.unavailableReason === "database") {
                                    return "(Unavailable)";
                                  } else if (
                                    table.unavailableReason === "time_conflict"
                                  ) {
                                    return "(Unavailable)";
                                  }
                                  return "";
                                };

                                return (
                                  <SelectItem
                                    key={table.id.toString()}
                                    textValue={`${table.name} (${
                                      table.capacity
                                    } P) ${
                                      !table.isAvailable ? "- UNAVAILABLE" : ""
                                    }`}
                                    className={
                                      !table.isAvailable
                                        ? "opacity-50 bg-red-50"
                                        : ""
                                    }
                                    isDisabled={!table.isAvailable}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="pt-0.5">
                                        {iconMap[table.location]}
                                      </div>
                                      <div className="flex flex-col">
                                        <span
                                          className={`font-medium ${
                                            !table.isAvailable
                                              ? "text-red-600"
                                              : ""
                                          }`}
                                        >
                                          {table.name} • {table.capacity} P
                                          {!table.isAvailable && (
                                            <span className="ml-2 text-red-500 text-xs font-bold">
                                              {getUnavailableMessage()}
                                            </span>
                                          )}
                                        </span>
                                        <span
                                          className={`text-xs ${
                                            !table.isAvailable
                                              ? "text-red-400"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {table.description}
                                          {table.unavailableReason ===
                                            "time_conflict" && (
                                            <span className="block text-red-500 text-xs mt-1 font-medium">
                                              ⏰ Time conflict
                                            </span>
                                          )}
                                          {table.unavailableReason ===
                                            "database" && (
                                            <span className="block text-red-500 text-xs mt-1 font-medium">
                                              🚫 Table is currently unavailable
                                            </span>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </Select>

                            <button
                              onClick={() =>
                                handleConfirmWithTable(reservation)
                              }
                              disabled={!selectedTables[reservation.id]}
                              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(reservation, "cancelled")
                              }
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 whitespace-nowrap cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {reservation.status === "confirmed" && (
                          <>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                              Confirmed{" "}
                              {reservation.tableId &&
                                `- Table ${reservation.tableId}`}
                            </span>
                            <button
                              onClick={() =>
                                handleStatusUpdate(reservation, "cancelled")
                              }
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 whitespace-nowrap cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {reservation.status === "cancelled" && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {upcomingReservations.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No upcoming reservations
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
