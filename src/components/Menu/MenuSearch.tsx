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

function MenuSearch() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const category = [
    { id: 1, label: "All Categories", value: "all" },
    { id: 2, label: "New Arrivals", value: "new" },
    { id: 3, label: "Best Sellers", value: "best" },
    { id: 4, label: "On Sale", value: "sale" },
    { id: 5, label: "Fast Food", value: "fast-food" },
    { id: 6, label: "Desserts", value: "desserts" },
    { id: 7, label: "Drinks", value: "drinks" },
    { id: 8, label: "Main Course", value: "main-course" },
    { id: 9, label: "Vegan", value: "vegan" },
    { id: 10, label: "Pizza", value: "pizza" },
  ];

  const sortingOptions = [
    { id: 1, label: "Price: Low to High", value: "price-asc", icon:<ArrowUp size={20}/> },
    { id: 2, label: "Price: High to Low", value: "price-desc",icon:<ArrowDown size={20}/> },
    { id: 3, label: "Popularity", value: "popularity",icon:<Heart size={20}/> },
    { id: 4, label: "Rating", value: "rating", icon:<Star size={20}/> },
  ]
  return (
    <div className="w-full">
      <div className="w-full p-5 py-10 bg-foreground flex flex-col gap-2">
        <div className="w-full h-auto flex flex-row gap-2 items-center">
          <Input
            isClearable
            classNames={{
              inputWrapper: "border-2 border-secondary",
              clearButton: "text-secondary",
            }}
            label="Search any Item"
          ></Input>
          <Button className="bg-theme ">Search</Button>

          <Button
            color="default"
            onPress={() => setIsFilterMenuOpen((prev) => !prev)}
          >
            Filters
            {isFilterMenuOpen ? <X /> : <ChevronDown />}
          </Button>
        </div>
        {isFilterMenuOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 120 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full bg-foreground "
            >
              <div className="grid grid-cols-3 py-5 gap-5">
              <div>
                <Autocomplete label="Category" placeholder="Select Category">
                  {category.map((item) => (
                    <AutocompleteItem
                      key={item.id}
                      classNames={{ title: "text-accent" }}
                    >
                      {item.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <div className="flex justify-center">
                <Slider
                  classNames={{
                    filler: "bg-theme",
                    thumb: "bg-theme",
                    label: "text-secondary",
                    value: "text-secondary",
                  }}
                  className="max-w-md"
                  defaultValue={[0, 200]}
                  formatOptions={{ style: "currency", currency: "USD" }}
                  label="Price Range"
                  maxValue={200}
                  minValue={0}
                  step={10}
                />
              </div>

              <div>
                <Autocomplete label="Sort By" placeholder="Select">
                  {sortingOptions.map((item) => (
                    <AutocompleteItem
                      key={item.id}
                      classNames={{ title: "text-accent" }}
                    >
                      <div className="flex flex-row gap-2">
                      {item.icon} {item.label}

                      </div>
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>
              </div>

              <div className="w-full flex flex-row gap-5 justify-center items-center py-5">
                <Button
            color="success"
          >
            Apply Filters
          </Button>

          <Button
            color="default"
          >
            Reset
          </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
    </div>
  );
}

export default MenuSearch;
