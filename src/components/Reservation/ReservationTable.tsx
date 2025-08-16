import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  Tooltip,
  addToast,
  Input,
  SortDescriptor,
} from "@heroui/react";
import { Plus, Trash, PenIcon, CircleX, Ban, Search } from "lucide-react";
import CustomModal from "../Modals/Modal";
import FadeInSection from "@/components/ui/scrollAnimated";
import clsx from "clsx";
import { Reservation } from "@/types";
import { useReservations } from "@/app/hooks/useReservations";
import LoadingScreen from "../Loading";
import { useOccasionType } from "@/app/hooks/useOccasionType";
import { useSession } from "next-auth/react";

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface ViewReservationsTableProps {
  onAddNew: () => void;
  onEditReservation: (reservation: Reservation) => void;
}

const columns: Column[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "DATE", uid: "date", sortable: true },
  { name: "TIME", uid: "time", sortable: true },
  { name: "GUESTS", uid: "guests", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "OCCASION", uid: "occasion", sortable: true },
  { name: "REQUESTS", uid: "requests", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export default function ViewReservations({
  onAddNew,
  onEditReservation,
}: ViewReservationsTableProps) {
  const { data: allReservations = [] } = useReservations();
  const { data: occasionType = [], isPending } = useOccasionType();
  const { data: session } = useSession();
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
    reservationId: null as number | null,
  });

  const reservations = useMemo(() => {
    if (!allReservations || !session) return [];
    return allReservations.filter((i) => i.email === session.user?.email);
  }, [allReservations, session]);

  // Create occasion lookup map for better performance
  const occasionMap = useMemo(() => {
    const map = new Map();
    occasionType.forEach((occasion) => {
      map.set(occasion.id, occasion.label);
    });
    return map;
  }, [occasionType]);

  const handleEditReservation = (reservation: Reservation) => {
    console.log("Reservation Data", reservation);
    onEditReservation(reservation);
    onAddNew();
  };

  // Fixed sorting logic
  const sortedItems = useMemo(() => {
    if (!reservations || reservations.length === 0) return [];

    return [...reservations].sort((a, b) => {
      let first: string | number | Date | undefined =
        a[sortDescriptor.column as keyof Reservation];
      let second: string | number | Date | undefined =
        b[sortDescriptor.column as keyof Reservation];

      // Handle special cases for different data types
      if (sortDescriptor.column === "date") {
        first = new Date(first as string).getTime();
        second = new Date(second as string).getTime();
      } else if (sortDescriptor.column === "time") {
        // Convert time to comparable format (assuming HH:MM format)
        const timeToMinutes = (time: string) => {
          if (!time) return 0;
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes;
        };
        first = timeToMinutes(first as string);
        second = timeToMinutes(second as string);
      } else if (sortDescriptor.column === "guests") {
        first = Number(first) || 0;
        second = Number(second) || 0;
      } else if (sortDescriptor.column === "occasion") {
        // Sort by occasion label instead of ID
        first = occasionMap.get(first) || "Unknown";
        second = occasionMap.get(second) || "Unknown";
      } else if (typeof first === "string" && typeof second === "string") {
        first = first.toLowerCase();
        second = second.toLowerCase();
      }

      let cmp = 0;
      if (first === undefined && second === undefined) {
        cmp = 0;
      } else if (first === undefined || first === null) {
        cmp = -1;
      } else if (second === undefined || second === null) {
        cmp = 1;
      } else {
        cmp = first < second ? -1 : first > second ? 1 : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [reservations, sortDescriptor, occasionMap]);

  // Filter reservations based on search
  const filteredItems = useMemo(() => {
    if (!filterValue) return sortedItems;

    return sortedItems.filter(
      (reservation) =>
        reservation.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        reservation.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        reservation.phone?.toLowerCase().includes(filterValue.toLowerCase()) ||
        reservation.status.toLowerCase().includes(filterValue.toLowerCase()) ||
        (occasionMap.get(reservation.occasion) || "")
          .toLowerCase()
          .includes(filterValue.toLowerCase())
    );
  }, [sortedItems, filterValue, occasionMap]);

  const handleDeleteReservation = useCallback((reservationId: number) => {
    // Add your delete logic here
    console.log("Deleting reservation:", reservationId);
    addToast({
      title: "Success!",
      description: "Reservation deleted successfully",
      color: "success",
    });
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
      reservationId: null,
    });
  }, []);

  const handleCancelReservation = useCallback((reservationId: number) => {
    // Add your cancel logic here
    console.log("Cancelling reservation:", reservationId);
    addToast({
      title: "Success!",
      description: "Reservation cancelled successfully",
      color: "success",
    });
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
      reservationId: null,
    });
  }, []);

  const renderCell = useCallback(
    (item: Reservation, columnKey: React.Key) => {
      const column = columns.find((col) => col.uid === columnKey);

      if (!column) return null;

      switch (column.uid) {
        case "id":
          return (
            <div className="flex flex-col">
              <p className="text-bold">{item.id}</p>
            </div>
          );

        case "name":
          return (
            <div className="flex flex-col min-w-40">
              <p className="text-bold capitalize">{item.name}</p>
              <p className="text-bold text-xs text-secondary">{item.email}</p>
            </div>
          );

        case "date":
          const formattedDate = new Date(item.date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );
          return (
            <div className="flex flex-col min-w-30">
              <p className="text-bold">{formattedDate}</p>
            </div>
          );

        case "time":
          const formattedTime = item.time
            ? new Date(`2000-01-01T${item.time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A";
          return (
            <div className="flex flex-col">
              <p className="text-bold">{formattedTime}</p>
            </div>
          );

        case "guests":
          return (
            <div className="flex flex-col">
              <p className="text-bold">
                {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>
          );

        case "phone":
          return (
            <div className="flex flex-col min-w-40">
              <p className="text-bold">{item.phone || "N/A"}</p>
            </div>
          );

        case "occasion":
          // Wait for occasionType to load before rendering
          if (isPending) {
            return (
              <div className="flex flex-col min-w-40">
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              </div>
            );
          }

          const occasionName = occasionMap.get(item.occasion) || "Unknown";
          return (
            <div className="flex flex-col min-w-40">
              <p className="text-bold capitalize">{occasionName}</p>
            </div>
          );

        case "requests":
          return (
            <div className="flex flex-col min-w-40">
              <p className="text-bold line-clamp-2" title={item.requests || ""}>
                {item.requests ? item.requests : "N/A"}
              </p>
            </div>
          );

        case "status":
          return (
            <div
              className={clsx(
                {
                  "bg-red-100 border-red-500 text-red-700":
                    item.status === "cancelled",
                  "bg-green-100 border-green-500 text-green-700":
                    item.status === "confirmed",
                  "bg-orange-100 border-orange-500 text-orange-700":
                    item.status === "pending",
                },
                "flex justify-center items-center rounded-full px-2 py-1 border-1 text-xs font-semibold"
              )}
            >
              <p className="capitalize">{item.status}</p>
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip
                color="secondary"
                content="Edit reservation"
                isDisabled={item.status === "confirmed"}
              >
                <span
                  className={`text-lg ${
                    item.status !== "confirmed"
                      ? "text-default-400 cursor-pointer hover:text-primary"
                      : "text-default-200 cursor-not-allowed"
                  }`}
                >
                  <PenIcon
                    size={20}
                    onClick={() => {
                      if (item.status !== "confirmed") {
                        handleEditReservation(item);
                      } else {
                        addToast({
                          title: "Alert!",
                          description:
                            "Confirmed reservations cannot be edited",
                          color: "warning",
                        });
                      }
                    }}
                  />
                </span>
              </Tooltip>

              <Tooltip
                color={item.status === "confirmed" ? "warning" : "danger"}
                content={
                  item.status === "confirmed"
                    ? "Cancel reservation"
                    : "Delete reservation"
                }
              >
                <span
                  className={`${
                    item.status === "confirmed" ? "text-warning" : "text-danger"
                  } text-lg cursor-pointer hover:opacity-80`}
                >
                  {item.status !== "confirmed" ? (
                    <Trash
                      size={20}
                      onClick={() => {
                        setShowModal({
                          open: true,
                          title: "Delete Reservation?",
                          description:
                            "Are you sure you want to delete this reservation? This action cannot be undone.",
                          button: "Delete",
                          reservationId: item.id,
                        });
                      }}
                    />
                  ) : (
                    <CircleX
                      size={20}
                      onClick={() => {
                        setShowModal({
                          open: true,
                          title: "Cancel Reservation?",
                          description:
                            "Are you sure you want to cancel this reservation?",
                          button: "Cancel",
                          reservationId: item.id,
                        });
                      }}
                    />
                  )}
                </span>
              </Tooltip>
            </div>
          );

        default:
          return null;
      }
    },
    [isPending, occasionMap, handleEditReservation]
  );

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-default-400 text-small">
              Total {reservations.length} reservations
            </span>
            {filteredItems.length !== reservations.length && (
              <span className="text-default-400 text-small">
                ({filteredItems.length} filtered)
              </span>
            )}
          </div>
          <Button
            color={reservations.length >= 5 ? "danger" : "success"}
            size="sm"
            className="text-sm shadow-md"
            onPress={onAddNew}
            isDisabled={reservations.length >= 5}
            startContent={
              reservations.length >= 5 ? <Ban size={16} /> : <Plus size={16} />
            }
          >
            {reservations.length >= 5 ? "Limit Reached" : "Add New"}
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-accent"
            placeholder="Search by name, email, phone, or status..."
            startContent={<Search size={16} />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    reservations.length,
    filteredItems.length,
    onAddNew,
    onSearchChange,
    onClear,
  ]);

  const handleModalAction = () => {
    if (showModal.reservationId) {
      if (showModal.button === "Delete") {
        handleDeleteReservation(showModal.reservationId);
      } else if (showModal.button === "Cancel") {
        handleCancelReservation(showModal.reservationId);
      }
    }
  };

  // Show loading only when reservations are being fetched
  if (!reservations && isPending) {
    return <LoadingScreen showLoading={true} />;
  }

  return (
    <FadeInSection>
      <Card className="mx-auto p-4 my-5 rounded-lg shadow-md">
        <Table
          isCompact
          removeWrapper
          aria-label="Reservations table with custom cells, pagination and sorting"
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          className="overflow-auto"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
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
          <TableBody
            emptyContent={"No reservations found"}
            items={filteredItems}
            isLoading={isPending}
            loadingContent={<div>Loading reservations...</div>}
          >
            {(item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell
                    key={column.uid}
                    className="text-accent py-3 text-sm"
                  >
                    {renderCell(item, column.uid)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <CustomModal
        onClose={() =>
          setShowModal({
            open: false,
            title: "",
            description: "",
            button: "",
            reservationId: null,
          })
        }
        isOpen={showModal.open}
        title={showModal.title}
        description={showModal.description}
      >
        <Button color="danger" variant="flat" onPress={handleModalAction}>
          {showModal.button}
        </Button>
        <Button
          color="default"
          onPress={() =>
            setShowModal({
              open: false,
              title: "",
              description: "",
              button: "",
              reservationId: null,
            })
          }
        >
          Close
        </Button>
      </CustomModal>
    </FadeInSection>
  );
}
