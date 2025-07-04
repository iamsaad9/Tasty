import React, { useState } from "react";
import {
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Slider,
  Select,
  SelectItem,
} from "@heroui/react";
import { X, ChevronDown, ArrowUp, ArrowDown, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuSearchProps {
  onApplySearch?: (searchText: { searchText: string }) => void;
  onApplyFilters?: (filters: {
    selectedDiet: string[];
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
  const [selectedDiet, setSelectedDiet] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);

  const filterCount =
    (selectedDiet && selectedDiet.length === 0 ? 0 : 1) +
    (selectedSort ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 200 ? 1 : 0);

  const dietaryPreferences = [
    { id: 2, label: "Vegetarian", value: "veg" },
    { id: 3, label: "Non-Vegetarian", value: "nonveg" },
    { id: 4, label: "Halal", value: "halal" },
    { id: 5, label: "Dairy-Free", value: "dairyFree" },
    { id: 6, label: "Gluten-Free", value: "glutenFree" },
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

  const handleResetFilters = () => {
    const resetDiet: string[] = [];
    const resetSort = "";
    const resetPriceRange = [0, 200];

    setSelectedDiet(resetDiet);
    setSelectedSort(resetSort);
    setPriceRange(resetPriceRange);

    // Send the reset filters immediately
    onApplyFilters?.({
      selectedDiet: resetDiet,
      priceRange: resetPriceRange,
      selectedSort: resetSort,
    });

    setIsFilterMenuOpen(false);
    onResetFilters?.();
  };

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

          <Button
            className="bg-(--secondary-theme) text-foreground"
            onPress={() => setIsFilterMenuOpen((prev) => !prev)}
          >
            Filters{" "}
            {filterCount > 0 ? (
              <span className="font-semibold text-theme">{`(${filterCount})`}</span>
            ) : (
              ""
            )}{" "}
            {isFilterMenuOpen ? <X /> : <ChevronDown />}
          </Button>
        </div>

        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 170, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-foreground overflow-hidden"
            >
              <div className="grid grid-cols-3 py-5 gap-5">
                {/* Category Filter */}
                <div>
                  {/* <Autocomplete
                    classNames={{
                      listboxWrapper: "text-accent",
                    }}
                    label="Dietary Preferences"
                    placeholder="Select Diet"
                    onSelectionChange={(val) => {
                      setSelectedDiet(val as string);
                    }}
                  >
                    {dietaryPreferences.map((item) => (
                      <AutocompleteItem key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete> */}

                  <Select
                    classNames={{ listboxWrapper: "text-accent" }}
                    label="Dietary Preferences"
                    placeholder="Select Diet"
                    selectionMode="multiple"
                    selectedKeys={selectedDiet}
                    onSelectionChange={(val) => {
                      const selected = Array.from(val)
                        .map((key) => String(key))
                        .filter((item) => item !== "all"); // Remove "all"

                      setSelectedDiet(selected);
                      console.log("Selected Diet:", selected);
                    }}
                  >
                    {dietaryPreferences.map((item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    ))}
                  </Select>
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
                    step={2}
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
                    selectedKey={selectedSort} // <-- This tells Autocomplete which option is selected
                    onSelectionChange={(val) => {
                      setSelectedSort(val as string);
                    }}
                    classNames={{
                      listboxWrapper: "text-accent",
                    }}
                  >
                    {sortingOptions.map((item) => (
                      <AutocompleteItem key={item.value} textValue={item.label}>
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
                      selectedDiet,
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
                    handleResetFilters();
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
