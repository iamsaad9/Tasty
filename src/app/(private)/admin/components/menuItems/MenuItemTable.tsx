import React, { useState, useEffect } from "react";
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
  Chip,
  Image,
} from "@heroui/react";
import {
  Plus,
  Trash,
  PenIcon,
  CircleX,
  Ban,
  Star,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";

interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryArea {
  name: string;
  postalCode: string;
  fee: number;
}

interface Delivery {
  isDeliverable: boolean;
  estimatedTime: string;
  baseFee: number;
  freeAbove: number;
  minOrder: number;
  areas: DeliveryArea[];
}

interface MenuItem {
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  itemVariation: ItemVariation[];
  delivery: Delivery;
}

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

interface MenuManagementProps {
  onAddNew: () => void;
  onEditMenuItem: (menuItem: MenuItem) => void;
}

// Mock data
const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    title: "Grilled Chicken Caesar Salad",
    category: "Main Course",
    diet: ["halal", "all"],
    price: 12.99,
    description:
      "Fresh romaine lettuce with grilled chicken, parmesan cheese, croutons and Caesar dressing.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=687&auto=format&fit=crop",
    popularity: 85,
    rating: 4.5,
    special: true,
    itemVariation: [
      { type: "size", name: "Regular", price_multiplier: 1.0 },
      { type: "size", name: "Large", price_multiplier: 1.4 },
    ],
    delivery: {
      isDeliverable: true,
      estimatedTime: "25-40 mins",
      baseFee: 2.5,
      freeAbove: 20,
      minOrder: 10,
      areas: [
        { name: "Garden East", postalCode: "74400", fee: 2.5 },
        { name: "Liaquatabad", postalCode: "75900", fee: 3.0 },
      ],
    },
  },
  {
    id: 2,
    title: "Margherita Pizza",
    category: "Main Course",
    diet: ["veg", "all"],
    price: 14.99,
    description:
      "Classic pizza with fresh mozzarella, tomato sauce, and basil leaves.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=687&auto=format&fit=crop",
    popularity: 92,
    rating: 4.7,
    special: false,
    itemVariation: [
      { type: "size", name: "Small", price_multiplier: 0.8 },
      { type: "size", name: "Medium", price_multiplier: 1.0 },
      { type: "size", name: "Large", price_multiplier: 1.5 },
    ],
    delivery: {
      isDeliverable: true,
      estimatedTime: "30-45 mins",
      baseFee: 2.0,
      freeAbove: 18,
      minOrder: 8,
      areas: [
        { name: "Garden East", postalCode: "74400", fee: 2.0 },
        { name: "Liaquatabad", postalCode: "75900", fee: 2.5 },
      ],
    },
  },
  {
    id: 3,
    title: "Chocolate Lava Cake",
    category: "Dessert",
    diet: ["veg", "all"],
    price: 8.99,
    description:
      "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=687&auto=format&fit=crop",
    popularity: 78,
    rating: 4.3,
    special: true,
    itemVariation: [
      { type: "quantity", name: "Single", price_multiplier: 1.0 },
      { type: "quantity", name: "Double", price_multiplier: 1.8 },
    ],
    delivery: {
      isDeliverable: true,
      estimatedTime: "15-25 mins",
      baseFee: 2.0,
      freeAbove: 15,
      minOrder: 5,
      areas: [{ name: "Garden East", postalCode: "74400", fee: 2.0 }],
    },
  },
];

const columns: Column[] = [
  { name: "IMAGE", uid: "image" },
  { name: "ITEM", uid: "title", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "DIET", uid: "diet" },
  { name: "RATING", uid: "rating", sortable: true },
  { name: "POPULARITY", uid: "popularity", sortable: true },
  { name: "SPECIAL", uid: "special" },
  { name: "DELIVERY", uid: "delivery" },
  { name: "ACTIONS", uid: "actions" },
];

export default function MenuItemTable({
  onAddNew,
  onEditMenuItem,
}: MenuManagementProps) {
  const [filterValue, setFilterValue] = React.useState("");
  const [sortDescriptor, setSortDescriptor] = React.useState<{
    column: keyof MenuItem;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
    itemId: null as number | null,
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const handleEditMenuItem = (menuItem: MenuItem) => {
    console.log("Menu Item Data", menuItem);
    onEditMenuItem(menuItem);
    onAddNew();
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
      itemId: null,
    });
  };

  const sortedItems = React.useMemo(() => {
    return [...menuItems].sort((a, b) => {
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
  }, [sortDescriptor, menuItems]);

  const getDietColor = (diet: string) => {
    switch (diet) {
      case "veg":
        return "success";
      case "halal":
        return "primary";
      case "all":
        return "default";
      default:
        return "default";
    }
  };

  const renderCell = React.useCallback(
    (item: MenuItem, columnKey: React.Key) => {
      const column = columns.find((col) => col.uid === columnKey);

      if (!column) return null;

      switch (column.uid) {
        case "image":
          return (
            <div className="flex items-center justify-center">
              <Image
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
                fallbackSrc="https://via.placeholder.com/64x64?text=No+Image"
              />
            </div>
          );

        case "title":
          return (
            <div className="flex flex-col min-w-48">
              <p className="text-bold font-semibold">{item.title}</p>
              <p className="text-small text-default-500 line-clamp-2">
                {item.description}
              </p>
            </div>
          );

        case "category":
          return (
            <Chip size="sm" variant="flat" color="secondary">
              {item.category}
            </Chip>
          );

        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold font-semibold text-success">
                ${item.price.toFixed(2)}
              </p>
              {item.itemVariation.length > 0 && (
                <p className="text-xs text-default-400">
                  {item.itemVariation.length} variations
                </p>
              )}
            </div>
          );

        case "diet":
          return (
            <div className="flex flex-wrap gap-1 max-w-24">
              {item.diet.slice(0, 2).map((dietType) => (
                <Chip
                  key={dietType}
                  size="sm"
                  variant="dot"
                  color={getDietColor(dietType)}
                >
                  {dietType.toUpperCase()}
                </Chip>
              ))}
              {item.diet.length > 2 && (
                <Chip size="sm" variant="flat" color="default">
                  +{item.diet.length - 2}
                </Chip>
              )}
            </div>
          );

        case "rating":
          return (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-bold">{item.rating}</span>
            </div>
          );

        case "popularity":
          return (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-bold">{item.popularity}%</span>
            </div>
          );

        case "special":
          return (
            <Chip
              size="sm"
              variant={item.special ? "solid" : "bordered"}
              color={item.special ? "warning" : "default"}
            >
              {item.special ? "Special" : "Regular"}
            </Chip>
          );

        case "delivery":
          return (
            <div className="flex flex-col">
              <Chip
                size="sm"
                variant="flat"
                color={item.delivery.isDeliverable ? "success" : "danger"}
              >
                {item.delivery.isDeliverable ? "Available" : "Not Available"}
              </Chip>
              {item.delivery.isDeliverable && (
                <p className="text-xs text-default-400 mt-1">
                  {item.delivery.estimatedTime}
                </p>
              )}
            </div>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="secondary" content="Edit item">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <PenIcon size={20} onClick={() => handleEditMenuItem(item)} />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete item">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash
                    size={20}
                    onClick={() => {
                      setShowModal({
                        open: true,
                        title: "Delete Menu Item?",
                        description: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
                        button: "Delete",
                        itemId: item.id,
                      });
                    }}
                  />
                </span>
              </Tooltip>
            </div>
          );

        default:
          return null;
      }
    },
    [menuItems]
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
          <span className="text-default-400">
            Total {menuItems.length} Menu Items
          </span>
        </div>

        <Button
          color="success"
          size="sm"
          className="text-sm shadow-md"
          onPress={onAddNew}
        >
          <Plus size={20} />
          Add New Item
        </Button>
      </div>
    );
  }, [menuItems.length, onAddNew]);

  return (
    <div className="w-full">
      <Card className="mx-auto p-4 my-5 rounded-lg shadow-md">
        <Table
          isCompact
          removeWrapper
          aria-label="Menu items management table"
          bottomContentPlacement="outside"
          className="overflow-auto text-accent"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          //   onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting={column.sortable}
                className="bg-default-100"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No menu items found"} items={sortedItems}>
            {(item) => (
              <TableRow key={item.id}>
                {columns.map((column) => {
                  const content = renderCell(item, column.uid);
                  return (
                    <TableCell key={column.uid} className="py-4">
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Modal */}
      {showModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">{showModal.title}</h3>
                <p className="text-sm text-default-500 mt-2">
                  {showModal.description}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  color="default"
                  variant="light"
                  onPress={() =>
                    setShowModal({
                      open: false,
                      title: "",
                      description: "",
                      button: "",
                      itemId: null,
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    if (showModal.itemId) {
                      handleDeleteItem(showModal.itemId);
                    }
                  }}
                >
                  {showModal.button}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
