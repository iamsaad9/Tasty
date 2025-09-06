"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  addToast,
} from "@heroui/react";
import {
  FiSearch,
  FiChevronDown,
  FiMoreVertical,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import { Check, Clock, Truck, X } from "lucide-react";
import { useOrders, useUpdateOrderStatus } from "@/app/hooks/useOrders";
import { OrderData } from "@/types";
import FadeInSection from "@/components/ui/scrollAnimated";
import PageBanner from "@/components/PageBanner";
import Heading from "@/components/Heading";
import { BsCashCoin } from "react-icons/bs";

// Sample order data

const columns = [
  { name: "ORDER #", uid: "orderNumber", sortable: true },
  { name: "CUSTOMER", uid: "customer", sortable: true },
  { name: "ITEMS", uid: "items" },
  { name: "DELIVERY", uid: "deliveryMode", sortable: true },
  { name: "STATUS", uid: "orderStatus", sortable: true },
  { name: "PAYMENT", uid: "paymentStatus", sortable: true },
  { name: "TOTAL", uid: "total", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Pending", uid: "pending" },
  { name: "Confirmed", uid: "confirmed" },
  { name: "Preparing", uid: "preparing" },
  { name: "Ready", uid: "ready" },
  { name: "Delivered", uid: "delivered" },
  { name: "Cancelled", uid: "cancelled" },
];

const paymentStatusOptions = [
  { name: "Pending", uid: "pending" },
  { name: "Completed", uid: "completed" },
  { name: "Failed", uid: "failed" },
];

const deliveryModeOptions = [
  { name: "Delivery", uid: "delivery" },
  { name: "Pickup", uid: "pickup" },
];

const statusColorMap: Record<
  string,
  "warning" | "primary" | "secondary" | "success" | "danger" | "default"
> = {
  pending: "warning",
  confirmed: "primary",
  preparing: "secondary",
  ready: "success",
  delivered: "success",
  cancelled: "danger",
};

const paymentColorMap: Record<
  string,
  "warning" | "success" | "danger" | "default"
> = {
  pending: "warning",
  completed: "success",
  failed: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "orderNumber",
  "customer",
  "items",
  "deliveryMode",
  "orderStatus",
  "paymentStatus",
  "total",
  "actions",
];

function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

export default function OrderProcessingAdmin() {
  const { data: orders } = useOrders();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([])
  );
  const [isClient, setIsClient] = React.useState(false);

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [paymentFilter, setPaymentFilter] = React.useState("all");
  const [deliveryFilter, setDeliveryFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "orderNumber",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderData>();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pages = Math.ceil((orders?.length || 0) / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...(orders || [])];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(filterValue.toLowerCase()) ||
          `${order.customer.firstName} ${order.customer.lastName}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(statusFilter).includes(order.orderStatus)
      );
    }

    if (
      paymentFilter !== "all" &&
      Array.from(paymentFilter).length !== paymentStatusOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(paymentFilter).includes(order.paymentStatus)
      );
    }

    if (
      deliveryFilter !== "all" &&
      Array.from(deliveryFilter).length !== deliveryModeOptions.length
    ) {
      filteredOrders = filteredOrders.filter((order) =>
        Array.from(deliveryFilter).includes(order.deliveryMode)
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter, paymentFilter, deliveryFilter]);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let first: string | number | Date;
      let second: string | number | Date;

      if (sortDescriptor.column === "customer") {
        first = `${a.customer?.firstName || ""} ${a.customer?.lastName || ""}`;
        second = `${b.customer?.firstName || ""} ${b.customer?.lastName || ""}`;
      } else if (sortDescriptor.column === "total") {
        first = a.pricing?.total || 0;
        second = b.pricing?.total || 0;
      } else if (sortDescriptor.column === "estimatedDeliveryTime") {
        first = a.estimatedDeliveryTime
          ? new Date(a.estimatedDeliveryTime)
          : new Date(0);
        second = b.estimatedDeliveryTime
          ? new Date(b.estimatedDeliveryTime)
          : new Date(0);
      } else if (sortDescriptor.column === "orderNumber") {
        first = a.orderNumber || "";
        second = b.orderNumber || "";
      } else if (sortDescriptor.column === "orderStatus") {
        first = a.orderStatus || "";
        second = b.orderStatus || "";
      } else if (sortDescriptor.column === "deliveryMode") {
        first = a.deliveryMode || "";
        second = b.deliveryMode || "";
      } else if (sortDescriptor.column === "paymentStatus") {
        first = a.paymentStatus || "";
        second = b.paymentStatus || "";
      } else {
        first = "";
        second = "";
      }

      // Handle different data types for comparison
      let cmp = 0;
      if (first instanceof Date && second instanceof Date) {
        cmp = first.getTime() - second.getTime();
      } else if (typeof first === "number" && typeof second === "number") {
        cmp = first - second;
      } else {
        // String comparison
        const firstStr = String(first).toLowerCase();
        const secondStr = String(second).toLowerCase();
        cmp = firstStr < secondStr ? -1 : firstStr > secondStr ? 1 : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const updateOrderStatus = (
    orderId: string,
    newStatus: string,
    paymentStatus?: string
  ) => {
    if (orders?.find((o) => o.id === orderId)?.orderStatus === "delivered") {
      addToast({
        title: "Action Not Allowed",
        description: `Order has already been delivered.`,
        color: "danger",
      });
      return null;
    } else if (
      orders?.find((o) => o.id === orderId)?.orderStatus === "cancelled"
    ) {
      addToast({
        title: "Failed",
        description: `Order has already been cancelled.`,
        color: "danger",
      });
      return null;
    }
    updateOrderStatusMutation.mutate(
      {
        orderId,
        orderStatus: newStatus,
        paymentStatus,
      },
      {
        onSuccess: (data) => {
          console.log("Order status updated successfully:", data);
          // Optionally show a success toast/notification
        },
        onError: (error) => {
          console.error("Failed to update order status:", error);
          // Optionally show an error toast/notification
        },
      }
    );
  };

  const viewOrderDetails = (order: OrderData) => {
    setSelectedOrder(order);
    onOpen();
  };

  const renderCell = React.useCallback(
    (order: OrderData, columnKey: string) => {
      const cellValue = order[columnKey as keyof OrderData];

      switch (columnKey) {
        case "orderNumber":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">{order.orderNumber}</p>
              <p className="text-bold text-xs text-default-400">{order.id}</p>
            </div>
          );

        case "customer":
          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-default-100">
                <FiUser className="text-default-600" size={14} />
              </div>
              <div className="flex flex-col">
                <p className="text-bold text-sm">{`${order.customer.firstName} ${order.customer.lastName}`}</p>
                <p className="text-xs text-default-400">
                  {order.customer.email}
                </p>
              </div>
            </div>
          );

        case "items":
          const totalItems = order.items.reduce(
            (sum: number, item) => sum + (item.itemQuantity || 0),
            0
          );
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-default-400">
                {order.items[0]?.itemName}
                {order.items.length > 1
                  ? ` +${order.items.length - 1} more`
                  : ""}
              </p>
            </div>
          );

        case "deliveryMode":
          return (
            <div className="flex items-center gap-1">
              {order.deliveryMode === "delivery" ? (
                <FiTruck className="text-primary" size={14} />
              ) : (
                <FiMapPin className="text-secondary" size={14} />
              )}
              <span className="text-sm capitalize">{order.deliveryMode}</span>
            </div>
          );

        case "orderStatus":
          return (
            <Chip
              className="capitalize"
              classNames={{
                base:
                  order.orderStatus === "pending"
                    ? "bg-gray-200"
                    : order.orderStatus === "confirmed"
                    ? "bg-blue-100"
                    : order.orderStatus === "preparing"
                    ? "bg-theme"
                    : order.orderStatus === "ready"
                    ? "bg-green-100"
                    : order.orderStatus === "delivered"
                    ? "bg-green-100"
                    : "bg-red-200",
              }}
              size="sm"
              variant="flat"
            >
              {order.orderStatus}
            </Chip>
          );

        case "paymentStatus":
          return (
            <div className="flex items-center gap-1">
              {order.paymentMethod === "Cash" ? (
                <BsCashCoin className="text-default-400" size={12} />
              ) : (
                <FiCreditCard className="text-default-400" size={12} />
              )}
              <Chip
                className="capitalize text-accent"
                color={
                  paymentColorMap[
                    order.paymentStatus as keyof typeof paymentColorMap
                  ]
                }
                size="sm"
                variant="dot"
              >
                {order.paymentStatus}
              </Chip>
            </div>
          );

        case "total":
          return (
            <div className="flex items-center gap-1">
              <FiDollarSign className="text-success" size={12} />
              <span className="text-bold text-sm">
                {order.pricing.total.toFixed(2)}
              </span>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => viewOrderDetails(order)}
              >
                <FiEye className="text-default-400" />
              </Button>
              {order.orderStatus !== "delivered" &&
                order.orderStatus !== "cancelled" && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly size="sm" variant="light">
                        <FiMoreVertical className="text-default-400" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="confirm"
                        startContent={<FiCheck />}
                        onPress={() => updateOrderStatus(order.id, "confirmed")}
                        className={`${
                          order.orderStatus === "pending" ? "" : "hidden"
                        } text-accent`}
                      >
                        Confirm Order
                      </DropdownItem>

                      <DropdownItem
                        key="preparing"
                        startContent={<FiClock />}
                        onPress={() => updateOrderStatus(order.id, "preparing")}
                        className={
                          order.orderStatus === "confirmed"
                            ? "text-accent"
                            : "hidden"
                        }
                      >
                        Start Preparing
                      </DropdownItem>
                      <DropdownItem
                        key="ready"
                        startContent={<FiCheck />}
                        onPress={() => updateOrderStatus(order.id, "ready")}
                        className={
                          order.orderStatus === "preparing"
                            ? "text-accent"
                            : "hidden"
                        }
                      >
                        Mark Ready
                      </DropdownItem>
                      <DropdownItem
                        key="delivered"
                        startContent={<FiTruck />}
                        onPress={() =>
                          updateOrderStatus(order.id, "delivered", "completed")
                        }
                        className={
                          order.orderStatus === "ready"
                            ? "text-accent"
                            : "hidden"
                        }
                      >
                        Mark Delivered
                      </DropdownItem>
                      <DropdownItem
                        key="cancel"
                        startContent={<FiX />}
                        onPress={() => updateOrderStatus(order.id, "cancelled")}
                        className="text-danger"
                        color="danger"
                      >
                        Cancel Order
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
            </div>
          );

        default:
          // Handle different types of cellValue
          if (cellValue === null || cellValue === undefined) {
            return <span>-</span>;
          }

          if (typeof cellValue === "object") {
            return <span>{JSON.stringify(cellValue)}</span>;
          }

          if (Array.isArray(cellValue)) {
            return <span>{cellValue.length} items</span>;
          }

          // For primitive types (string, number, boolean)
          return <span>{String(cellValue)}</span>;
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search orders..."
            startContent={<FiSearch />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<FiChevronDown />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                className="text-accent"
                onSelectionChange={(key) => setStatusFilter(key as string)}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<FiChevronDown />} variant="flat">
                  Payment
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Payment Filter"
                closeOnSelect={false}
                selectedKeys={paymentFilter}
                selectionMode="multiple"
                className="text-accent"
                onSelectionChange={(key) => setPaymentFilter(key as string)}
              >
                {paymentStatusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<FiChevronDown />} variant="flat">
                  Delivery
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Delivery Filter"
                closeOnSelect={false}
                selectedKeys={deliveryFilter}
                selectionMode="multiple"
                className="text-accent"
                onSelectionChange={(key) => setDeliveryFilter(key as string)}
              >
                {deliveryModeOptions.map((mode) => (
                  <DropdownItem key={mode.uid} className="capitalize">
                    {capitalize(mode.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders?.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small ml-2"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    paymentFilter,
    deliveryFilter,
    orders?.length,
    rowsPerPage,
    onSearchChange,
    onRowsPerPageChange,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="text-small text-default-400">
          {selectedKeys.has("all")
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  return (
    <>
      <PageBanner
        title="Order Management"
        image="/images/PageBanners/reservationPage.jpg"
      />
      <Heading title="ORDERS" subheading="Process Orders" />
      <FadeInSection>
        <div className="p-6 min-h-screen">
          {isClient ? (
            <div className="bg-white rounded-lg shadow-sm border border-default-200">
              <Table
                aria-label="Orders table"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={(key) => setSelectedKeys(key as Set<string>)}
                onSortChange={(key) =>
                  setSortDescriptor({
                    column: String(key.column),
                    direction: key.direction,
                  })
                }
                className="text-accent p-5"
                classNames={{
                  wrapper: "p-0 shadow-none",
                }}
              >
                <TableHeader columns={headerColumns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                      allowsSorting={column.sortable}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody emptyContent="No orders found" items={sortedItems}>
                  {(item) => (
                    <TableRow key={item.id || item.id || item.orderNumber}>
                      {(columnKey) => (
                        <TableCell>
                          {renderCell(item, columnKey.toString())}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-default-200 h-16 w-16"></div>
            </div>
          )}

          {/* Order Details Modal */}
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            className="text-accent"
            scrollBehavior="inside"
          >
            <ModalContent>
              {selectedOrder && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <h2>Order Details - {selectedOrder.orderNumber}</h2>
                    <p className="text-sm text-default-500">
                      Order ID: {selectedOrder.id}
                    </p>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Name:</p>
                            <p className="text-default-600">{`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}</p>
                          </div>
                          <div>
                            <p className="font-medium">Email:</p>
                            <p className="text-default-600">
                              {selectedOrder.customer.email}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Phone:</p>
                            <p className="text-default-600">
                              {selectedOrder.customer.phone}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Delivery Mode:</p>
                            <p className="text-default-600 capitalize">
                              {selectedOrder.deliveryMode}
                            </p>
                          </div>
                          {selectedOrder.customer.address && (
                            <div className="col-span-2">
                              <p className="font-medium">Address:</p>
                              <p className="text-default-600">
                                {selectedOrder.customer.address}
                              </p>
                            </div>
                          )}
                          {selectedOrder.customer.orderNotes && (
                            <div className="col-span-2">
                              <p className="font-medium">Order Notes:</p>
                              <p className="text-default-600">
                                {selectedOrder.customer.orderNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Order Items
                        </h3>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {item.itemName}
                                  </h4>
                                  <p className="text-sm text-default-500">
                                    Quantity: {item.itemQuantity}
                                  </p>
                                  {item.itemVariations &&
                                    Object.keys(item.itemVariations).length >
                                      0 && (
                                      <div className="text-xs text-default-400 mt-1 ">
                                        {Object.entries(
                                          item.itemVariations
                                        ).map(([type, value], vIndex) => (
                                          <span
                                            key={vIndex}
                                            className="mr-2 capitalize"
                                          >
                                            {type}: {value}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  {item.itemInstructions && (
                                    <p className="text-xs text-default-400 mt-1">
                                      Instructions: {item.itemInstructions}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    $
                                    {(
                                      (item.itemBasePrice || 0) *
                                      (item.itemQuantity || 0)
                                    ).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-default-400">
                                    ${(item.itemBasePrice || 0).toFixed(2)} each
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Order Summary
                        </h3>
                        <div className="border rounded-lg p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>
                                ${selectedOrder.pricing.subTotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>
                                ${selectedOrder.pricing.tax.toFixed(2)}
                              </span>
                            </div>
                            {selectedOrder.pricing.delivery > 0 && (
                              <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>
                                  ${selectedOrder.pricing.delivery.toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Tip:</span>
                              <span>
                                ${selectedOrder.pricing.tip.toFixed(2)}
                              </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-base">
                              <span>Total:</span>
                              <span style={{ color: "#ffb400" }}>
                                ${selectedOrder.pricing.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Payment Method:</p>
                              <p className="text-default-600">
                                {selectedOrder.paymentMethod}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Payment Status:</p>
                              <Chip
                                size="sm"
                                color={
                                  paymentColorMap[
                                    selectedOrder.paymentStatus
                                      ? (selectedOrder.paymentStatus as keyof typeof paymentColorMap)
                                      : "default"
                                  ]
                                }
                                variant="flat"
                                className="capitalize"
                              >
                                {selectedOrder.paymentStatus}
                              </Chip>
                            </div>
                            <div>
                              <p className="font-medium">Location:</p>
                              <p className="text-default-600">
                                {selectedOrder.selectedLocation}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Delivery Time:</p>
                              <p className="text-default-600">
                                {selectedOrder.estimatedDeliveryTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Update Actions */}
                      {selectedOrder.orderStatus !== "delivered" &&
                        selectedOrder.orderStatus !== "cancelled" && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">
                              Update Order Status
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedOrder.orderStatus === "pending" && (
                                <Button
                                  color="default"
                                  className="text-green-500"
                                  variant="flat"
                                  startContent={<Check size={16} />}
                                  onPress={() => {
                                    updateOrderStatus(
                                      selectedOrder.id,
                                      "confirmed"
                                    );
                                    onClose();
                                  }}
                                >
                                  Confirm Order
                                </Button>
                              )}
                              {selectedOrder.orderStatus === "confirmed" && (
                                <Button
                                  color="secondary"
                                  variant="flat"
                                  startContent={<Clock size={16} />}
                                  onPress={() => {
                                    updateOrderStatus(
                                      selectedOrder.id,
                                      "preparing"
                                    );
                                    onClose();
                                  }}
                                >
                                  Start Preparing
                                </Button>
                              )}
                              {selectedOrder.orderStatus === "preparing" && (
                                <Button
                                  color="success"
                                  variant="flat"
                                  startContent={<Check size={16} />}
                                  onPress={() => {
                                    updateOrderStatus(
                                      selectedOrder.id,
                                      "ready"
                                    );
                                    onClose();
                                  }}
                                >
                                  Mark Ready
                                </Button>
                              )}
                              {selectedOrder.orderStatus === "ready" &&
                                selectedOrder.deliveryMode === "delivery" && (
                                  <Button
                                    color="success"
                                    variant="flat"
                                    startContent={<Truck size={16} />}
                                    onPress={() => {
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        "delivered",
                                        "completed"
                                      );
                                      onClose();
                                    }}
                                  >
                                    Mark Delivered
                                  </Button>
                                )}
                              {selectedOrder.orderStatus === "ready" &&
                                selectedOrder.deliveryMode === "pickup" && (
                                  <Button
                                    color="success"
                                    variant="flat"
                                    startContent={<Check size={16} />}
                                    onPress={() => {
                                      updateOrderStatus(
                                        selectedOrder.id,
                                        "delivered",
                                        "completed"
                                      );
                                      onClose();
                                    }}
                                  >
                                    Mark Picked Up
                                  </Button>
                                )}
                              {!["delivered", "cancelled"].includes(
                                selectedOrder.orderStatus
                              ) && (
                                <Button
                                  color="danger"
                                  variant="flat"
                                  startContent={<X size={16} />}
                                  onPress={() => {
                                    updateOrderStatus(
                                      selectedOrder.id,
                                      "cancelled"
                                    );
                                    onClose();
                                  }}
                                >
                                  Cancel Order
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </FadeInSection>
    </>
  );
}
