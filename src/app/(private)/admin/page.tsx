"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { useRouter } from "next/navigation";

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

interface RecentOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "preparing" | "ready" | "delivered" | "pending";
  time: string;
}

interface UpcomingReservation {
  id: number;
  customer: string;
  guests: number;
  time: string;
  table: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon: React.ComponentType<any>;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("today");
  const router = useRouter();
  // Mock data with proper TypeScript typing
  const stats: Stats = {
    revenue: { value: 12450, change: 12.5, period: "vs yesterday" },
    orders: { value: 148, change: 8.2, period: "vs yesterday" },
    reservations: { value: 32, change: -2.1, period: "vs yesterday" },
    customers: { value: 1240, change: 15.3, period: "vs last week" },
  };

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

  const recentOrders: RecentOrder[] = [
    {
      id: "#001",
      customer: "John Doe",
      items: 3,
      total: 45.5,
      status: "preparing",
      time: "5 min ago",
    },
    {
      id: "#002",
      customer: "Sarah Smith",
      items: 2,
      total: 32.0,
      status: "ready",
      time: "12 min ago",
    },
    {
      id: "#003",
      customer: "Mike Johnson",
      items: 4,
      total: 68.75,
      status: "delivered",
      time: "18 min ago",
    },
    {
      id: "#004",
      customer: "Emily Brown",
      items: 1,
      total: 15.25,
      status: "pending",
      time: "25 min ago",
    },
  ];

  const upcomingReservations: UpcomingReservation[] = [
    {
      id: 1,
      customer: "Alice Wilson",
      guests: 4,
      time: "7:00 PM",
      table: "T-12",
    },
    { id: 2, customer: "Bob Davis", guests: 2, time: "7:30 PM", table: "T-05" },
    {
      id: 3,
      customer: "Carol White",
      guests: 6,
      time: "8:00 PM",
      table: "T-08",
    },
    {
      id: 4,
      customer: "David Miller",
      guests: 3,
      time: "8:30 PM",
      table: "T-15",
    },
  ];

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

  const getStatusColor = (status: RecentOrder["status"]): string => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "ready":
        return (
          "text-white" +
          " " +
          "px-2 py-1 rounded-full text-xs font-medium" +
          " " +
          "bg-[--theme]"
        );
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-theme focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
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
                <button className="text-theme hover:opacity-80 font-medium flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-(--secondary-theme)">
                          {order.id}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.customer} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">
                        ${order.total}
                      </p>
                      <p className="text-sm text-gray-500">{order.time}</p>
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
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-accent">
                        {reservation.customer}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {reservation.guests} guests • Table {reservation.table}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">
                        {reservation.time}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200">
                          Confirm
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-md p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-accent mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push("/admin/manageMenu")}
                className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer rounded-md hover:bg-opacity-20 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Manage Menu Items
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                <Calendar className="h-5 w-5" />
                New Reservation
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-md hover:bg-green-100 cursor-pointer transition-colors">
                <ShoppingBag className="h-5 w-5" />
                Process Order
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 cursor-pointer transition-colors">
                <Users className="h-5 w-5" />
                Manage Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
