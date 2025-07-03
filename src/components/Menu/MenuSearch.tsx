import React, { useState } from "react";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Slider,
} from "@heroui/react";
import { X, ChevronDown, ArrowUp, ArrowDown, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuSearchProps {
  onApplySearch?: (searchText: { searchText: string }) => void;
  onApplyFilters?: (filters: {
    selectedCategory: string;
    priceRange: number[];
    selectedSort: string;
  }) => void;
  onResetFilters?: () => void;
}
const MenuSearch: React.FC<MenuSearchProps> = ({
  onApplySearch,
  onApplyFilters,
  onResetFilters,
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);

  const category = [
    { id: 1, label: "All Categories", value: "all" },
    { id: 2, label: "New Arrivals", value: "new" },
    { id: 3, label: "Best Sellers", value: "best" },
    { id: 4, label: "On Sale", value: "sale" },
    { id: 5, label: "Main Course", value: "main-course" },
    { id: 6, label: "Appetizer", value: "appetizer" },
    { id: 7, label: "Fast Food", value: "fast-food" },
    { id: 8, label: "Desserts", value: "desserts" },
    { id: 9, label: "Drinks", value: "drinks" },
    { id: 10, label: "Vegan", value: "vegan" },
    { id: 11, label: "Pizza", value: "pizza" },
  ];

  const sortingOptions = [
    {
      id: 1,
      label: "Price: Low to High",
      value: "price-asc",
      icon: <ArrowUp size={20} />,
    },
    {
      id: 2,
      label: "Price: High to Low",
      value: "price-desc",
      icon: <ArrowDown size={20} />,
    },
    {
      id: 3,
      label: "Popularity",
      value: "popularity",
      icon: <Heart size={20} />,
    },
    { id: 4, label: "Rating", value: "rating", icon: <Star size={20} /> },
  ];

  return (
    <div className="w-full">
      <div className="w-full p-5 py-10 bg-foreground flex flex-col gap-2">
        <div className="w-full h-auto flex flex-row gap-2 items-center">
          <Input
            isClearable
            label="Search any Item"
            value={searchText}
            onValueChange={(val) => {
              setSearchText(val); // still update state
              onApplySearch?.({ searchText: val }); // use latest value directly
            }}
            classNames={{
              inputWrapper: "border-2 border-secondary",
              clearButton: "text-secondary",
            }}
          />

          {/* <Button className="bg-theme" onPress={() =>
                    onApplySearch?.({
                      searchText: searchText,
                    })
                  }>Search</Button> */}

          <Button
            color="default"
            onPress={() => setIsFilterMenuOpen((prev) => !prev)}
          >
            Filters {isFilterMenuOpen ? <X /> : <ChevronDown />}
          </Button>
        </div>

        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 170,opacity: 1 }}
              exit={{ height: 0,opacity: 0}}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-foreground overflow-hidden"
            >
              <div className="grid grid-cols-3 py-5 gap-5">
                {/* Category Filter */}
                <div>
                  <Autocomplete
                    label="Category"
                    placeholder="Select Category"
                    onSelectionChange={(val) => {
                      setSelectedCategory(val as string);
                    }}
                  >
                    {category.map((item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                {/* Price Range */}
                <div className="flex justify-center">
                  <Slider
                    className="max-w-md"
                    classNames={{
                      filler: "bg-theme",
                      thumb: "bg-theme",
                      label: "text-secondary",
                      value: "text-secondary",
                    }}
                    defaultValue={priceRange}
                    minValue={0}
                    maxValue={200}
                    step={10}
                    label="Price Range"
                    formatOptions={{ style: "currency", currency: "USD" }}
                    onChange={(val) => {
                      setPriceRange(val as number[]);
                    }}
                  />
                </div>

                {/* Sort By */}
                <div>
                  <Autocomplete
                    label="Sort By"
                    placeholder="Select"
                    onSelectionChange={(val) => {
                      setSelectedSort(val as string);
                    }}
                  >
                    {sortingOptions.map((item) => (
                      <AutocompleteItem key={item.value}>
                        <div className="flex flex-row gap-2">
                          {item.icon} {item.label}
                        </div>
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>

              {/* Buttons */}
              <div className="w-full flex flex-row gap-5 justify-center items-center py-5">
                <Button
                  color="success"
                  onPress={() =>
                    onApplyFilters?.({
                      selectedCategory,
                      priceRange,
                      selectedSort,
                    })
                  }
                >
                  Apply Filters
                </Button>

                <Button
                  color="default"
                  onPress={() => {
                    setSearchText("");
                    setSelectedCategory("");
                    setSelectedSort("");
                    setPriceRange([0, 200]);
                    onResetFilters?.();
                  }}
                >
                  Reset
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuSearch;
