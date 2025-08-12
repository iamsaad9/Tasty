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
import { set } from "mongoose";
import LoadingScreen from "@/components/Loading";

interface CategoryType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DietaryOption {
  id: number;
  label: string;
}

interface VariationType {
  id: string;
  label: string;
}

interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface LocationsType {
  area: string;
  postalCode: string;
}

interface DeliveryArea {
  area: string;
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dietary, setDietary] = useState<DietaryOption[]>([]);
  const [variations, setVariations] = useState<VariationType[]>([]);
  const [locations, setLocations] = useState<LocationsType[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, catRes, dietRes, varRes, locRes] = await Promise.all([
          fetch("/api/menuItems"),
          fetch("/api/categories"),
          fetch("/api/dietaryPreference"),
          fetch("/api/variationType"),
          fetch("/api/locations"),
        ]);

        if (
          !menuRes.ok ||
          !catRes.ok ||
          !dietRes.ok ||
          !varRes.ok ||
          !locRes.ok
        ) {
          setLoading(false);
          throw new Error("One or more requests failed");
        }

        const [menuData, catData, dietData, varData, locData] =
          await Promise.all([
            menuRes.json(),
            catRes.json(),
            dietRes.json(),
            varRes.json(),
            locRes.json(),
          ]);

        setMenuItems(menuData);
        setCategories(catData);
        setDietary(dietData);
        setVariations(varData);
        setLocations(locData);
        setLoading(true);
      } catch (error) {
        setLoading(false);

        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
            <Chip size="sm" variant="flat" className="text-accent">
              {categories.find((i) => i.id == item.category)?.name ??
                item.category}
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
              {item.diet.slice(1).map((dietType) => (
                <Chip
                  key={dietType}
                  size="sm"
                  variant="dot"
                  className="text-accent"
                  color={getDietColor(dietType)}
                >
                  {dietary.find((i) => i.id === parseInt(dietType))?.label ??
                    "All"}
                </Chip>
              ))}
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
              color={item.special ? "warning" : "secondary"}
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
    <>
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
            <TableBody
              loadingContent={<LoadingScreen showLoading={true} />}
              emptyContent={"No menu items found"}
              items={sortedItems}
            >
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
    </>
  );
}
