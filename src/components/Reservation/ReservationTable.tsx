import React, { useState } from "react";
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
  addToast
} from "@heroui/react";
import { Plus, Trash, PenIcon,CircleX,Ban } from "lucide-react";
import CustomModal from "../Modal";
import FadeInSection from "@/components/ui/scrollAnimated";
import clsx from "clsx";

interface Reservation {
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  guests: number;
  email: string;
  status: string;
  occasion: string;
  requests?: string;
}

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface ViewReservationsTableProps {
  onAddNew: () => void;
  onEditReservation: (reservation: Reservation) => void;
}

const reservations: Reservation[] = [
  {
    id: 1,
    name: "John Doe",
    date: "2025-07-05",
    time: "19:30",
    phone: "+1 555-123-4567",
    guests: 2,
    email: "john@example.com",
    status: "confirmed",
    occasion: "Anniversary",
    requests: "Window seat",
  },
  {
    id: 2,
    name: "Jane Smith",
    date: "2025-07-06",
    time: "18:00",
    phone: "+1 555-234-5678",
    guests: 4,
    email: "jane@example.com",
    status: "pending",
    occasion: "Birthday",
    requests: "Gluten-free meal",
  },
  {
    id: 3,
    name: "Alex Johnson",
    date: "2025-07-07",
    time: "20:00",
    phone: "+1 555-345-6789",
    guests: 3,
    email: "alex@example.com",
    status: "cancelled",
    occasion: "Business",
  },
  {
    id: 4,
    name: "Sara Lee",
    date: "2025-07-08",
    time: "21:00",
    phone: "+1 555-456-7890",
    guests: 5,
    email: "sara@example.com",
    status: "confirmed",
    occasion: "Casual Dinner",
    requests: "High chair for child",
  },
  {
    id: 5,
    name: "Michael Chan",
    date: "2025-07-09",
    time: "17:30",
    phone: "+1 555-567-8901",
    guests: 1,
    email: "michael@example.com",
    status: "confirmed",
    occasion: "Solo Meal",
  },
];

const columns: Column[] = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "DATE", uid: "date", sortable: true },
  { name: "TIME", uid: "time" },
  { name: "GUESTS", uid: "guests", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "OCCASION", uid: "occasion" },
  { name: "REQUESTS", uid: "requests" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ViewReservations({
  onAddNew,
  onEditReservation,
}: ViewReservationsTableProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: keyof Reservation;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState({
    open:false,
    title:'',
    description:'',
    button:''
  });

  const handleEditReservation = (reservations: Reservation) => {
    console.log("Reservation Data", reservations);
    onEditReservation(reservations);
    onAddNew();
  };

  const sortedItems = React.useMemo(() => {
    return [...reservations].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];

      let cmp = 0;
      if (first === undefined && second === undefined) {
        cmp = 0;
      } else if (first === undefined) {
        cmp = -1;
      } else if (second === undefined) {
        cmp = 1;
      } else {
        cmp = first < second ? -1 : first > second ? 1 : 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor]);

  const renderCell = React.useCallback(
    (item: Reservation, columnKey: React.Key) => {
      const column = columns.find((col) => col.uid === columnKey);

      if (!column) return null;

      switch (column.uid) {
        case "id":
          return item.id;
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.name}</p>
            </div>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.email}</p>
            </div>
          );
        case "date":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.date}</p>
            </div>
          );
        case "time":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.time}</p>
            </div>
          );
        case "guests":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.guests}</p>
            </div>
          );
        case "phone":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.phone}</p>
            </div>
          );
        case "occasion":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">{item.occasion}</p>
            </div>
          );
        case "requests":
          return (
            <div className="flex flex-col">
              <p className="text-bold  capitalize">
                {item.requests ? item.requests : "N/A"}
              </p>
            </div>
          );
        case "status":
          return (
            <div
              className={clsx(
                {
                  "bg-red-100 border-red-500": item.status === "cancelled",
                  "bg-green-100 border-green-800": item.status === "confirmed",
                  "bg-orange-100 border-orange-500": item.status === "pending",
                },
                "flex justify-center items-center rounded-full p-1 border-1"
              )}
            >
              <p className="text-bold  capitalize">{item.status}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip
                color="secondary"
                content="Edit user"
                isDisabled={item.status === "confirmed"}
              >
                <span className={`text-lg text-default-400 ${item.status !== 'confirmed'? 'cursor-pointer' : 'cursor-default'} `}>
                  <PenIcon
                    size={20}
                    onClick={() => {
                      
                      {item.status!=='confirmed'? handleEditReservation(item):
                        addToast({
                          title: "Alert!",
                          description:
                            "Confirmed Reservation cannot be edited",
                          color: "warning",
                        });
                      }
                      
                    }}

                  />
                </span>
              </Tooltip>
              <Tooltip
                color={item.status === "confirmed" ? "warning" : "danger"}
                content={item.status === "confirmed" ? "Cancel" : "Delete"}
              >
                <span className={`${item.status === 'confirmed' ? 'text-warning' : 'text-danger'} text-lg cursor-pointer `}>
                  {item.status !== 'confirmed'? (
                  <Trash
                    size={20}
                    onClick={() => {
                        setShowModal({
                          open:true,
                          title:'Delete Reservation?',
                          description:'Are you sure you want to delete this Reservation?',
                          button:'Delete'
                        });
                      }}
                  />
                  ):(
                    <CircleX
                    size={20}
                    onClick={() => {
                       setShowModal({
                          open:true,
                          title:'Cancel Reservation?',
                          description:'Are you sure you want to cancel this Reservation?',
                          button:'Cancel'
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
    []
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-row justify-between py-5">
         <div className="flex justify-between items-center">
          <span className="text-default-400 ">
            Total {reservations.length} Reservations
          </span>
        </div>
        
       
            <Button
              color={`${reservations.length === 5? 'danger' : 'success'}`}
              size="sm"
              className="text-sm shadow-md"
              onPress={onAddNew}
              isDisabled={reservations.length === 5}
            >
              {reservations.length===5? (<Ban size={20}/>) : (<Plus size={20} /> ) }
               {reservations.length===5? 'Limit Reached' : 'Add New' }
            </Button>
      </div>
    );
  }, [filterValue, , onSearchChange, reservations.length]);

  return (
    <FadeInSection>
      <Card className="max-w-[90rem] mx-auto p-4 my-5  rounded-lg shadow-md">
        <Table
          isCompact
          removeWrapper
          aria-label="Example table with custom cells, pagination and sorting"
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          //   onSelectionChange={setSelectedKeys}
          //   onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"You dont have any Reservations"} items={reservations}>
            {(item) => (
              <TableRow key={item.id}>
                {columns
                  .filter((column) => renderCell(item, column.uid) !== null)
                  .map((column) => {
                    const content = renderCell(item, column.uid);
                    return (
                      <TableCell
                        key={column.uid}
                        className="text-accent py-5 text-md"
                      >
                        {content}
                      </TableCell>
                    );
                  })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {showModal && (
        <CustomModal
        onClose={() => setShowModal({
            open:false,
            title:'',
            description:'',
            button:''
          })} 
          isOpen={showModal.open}
          title={showModal.title}
          description={showModal.description}
        >
          <Button color="danger" variant="flat">
           {showModal.button}
          </Button>
          <Button color="default" onPress={() => setShowModal({
            open:false,
            title:'',
            description:'',
            button:''
          })}>
            Close
          </Button>
        </CustomModal>
      )}
    </FadeInSection>
  );
}
