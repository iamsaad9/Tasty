"use client";
import React from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import SpecialsCorousel from "@/components/Menu/SpecialsCorousel";
import MenuFilter from "@/components/Menu/MenuSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/react";
import {
  FaDrumstickBite,
  FaIceCream,
  FaWineGlassAlt,
  FaPizzaSlice,
  FaBreadSlice,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageBanner from "@/components/PageBanner";
import ImageGallery from "@/components/ImageGallery";
function MenuPage() {

  const menuItems = [
    // Main Course
    {
      id: 1,
      title: "Butter Chicken",
      category: "Main Course",
      diet: ["nonveg", "halal", "all"],
      price: 12.99,
      description:
        "A delicious blend of spices and tender chicken cooked in a creamy tomato sauce.",
      image:
        "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop",
      popularity: 120,
      rating: 4.2,
    },
    {
      id: 2,
      title: "Grilled Salmon",
      category: "Main Course",
      diet: ["nonveg", "halal", "all"],
      price: 15.5,
      description:
        "Fresh salmon grilled to perfection served with herbs and lemon.",
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 110,
      rating: 4.5,
    },
    {
      id: 3,
      title: "Lasagna",
      category: "Main Course",
      diet: ["veg", "halal", "all"],
      price: 11.75,
      description: "Layered pasta with rich meat sauce and creamy cheese.",
      image:
        "https://plus.unsplash.com/premium_photo-1671559021023-3da68c12aeed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 80,
      rating: 4,
    },

    // Appetizers
    {
      id: 4,
      title: "Spring Rolls",
      category: "Appetizer",
      diet: ["veg", "halal", "all"],
      price: 5.25,
      description:
        "Crispy fried rolls stuffed with vegetables and served with sweet chili sauce.",
      image:
        "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 150,
      rating: 4.8,
    },
    {
      id: 5,
      title: "Bruschetta",
      category: "Appetizer",
      diet: ["veg", "halal", "all"],
      price: 6.99,
      description:
        "Grilled bread topped with garlic, tomatoes, olive oil, and basil.",
      image:
        "https://plus.unsplash.com/premium_photo-1677686707252-16013f466e61?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 60,
      rating: 3.9,
    },
    {
      id: 6,
      title: "Mozzarella Sticks",
      category: "Appetizer",
      diet: ["veg", "halal", "all"],
      price: 6.5,
      description: "Deep-fried cheese sticks served with marinara sauce.",
      image:
        "https://images.unsplash.com/photo-1734774924912-dcbb467f8599?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 125,
      rating: 4.4,
    },

    // Fast Food
    {
      id: 7,
      title: "Cheeseburger",
      category: "Fast Food",
      diet: ["nonveg", "halal", "all"],
      price: 8.99,
      description:
        "Juicy grilled beef patty with cheese, lettuce, and tomato in a sesame bun.",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=687&auto=format&fit=crop",
      popularity: 102,
      rating: 4.0,
    },
    {
      id: 8,
      title: "Shawarma Wrap",
      category: "Fast Food",
      diet: ["nonveg", "halal", "all"],
      price: 7.49,
      description:
        "Middle Eastern wrap with spiced meat, veggies, and garlic sauce.",
      image:
        "https://images.unsplash.com/photo-1605888983099-e33007b6ff27?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 90,
      rating: 4.7,
    },
    {
      id: 9,
      title: "Chicken Nuggets",
      category: "Fast Food",
      diet: ["nonveg", "halal", "all"],
      price: 6.75,
      description: "Crispy golden chicken nuggets served with dipping sauce.",
      image:
        "https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 210,
      rating: 4.8,
    },

    // Dessert
    {
      id: 10,
      title: "Chocolate Lava Cake",
      category: "Dessert",
      diet: ["halal", "all"],
      price: 5.99,
      description: "Warm chocolate cake with a gooey molten center.",
      image:
        "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 200,
      rating: 4.9,
    },
    {
      id: 11,
      title: "Tiramisu",
      category: "Dessert",
      diet: ["halal", "all"],
      price: 6.49,
      description:
        "Classic Italian dessert with coffee-soaked layers and mascarpone cream.",
      image:
        "https://plus.unsplash.com/premium_photo-1695028378225-97fbe39df62a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 180,
      rating: 4.6,
    },
    {
      id: 12,
      title: "Ice Cream Sundae",
      category: "Dessert",
      diet: ["halal", "all"],
      price: 4.5,
      description:
        "Scoop of vanilla ice cream topped with chocolate syrup and a cherry.",
      image:
        "https://plus.unsplash.com/premium_photo-1669680785558-c189b49aed4e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 160,
      rating: 4.3,
    },

    // Drinks
    {
      id: 13,
      title: "Mojito",
      category: "Drinks",
      diet: ["halal", "all"],
      price: 3.99,
      description: "Refreshing mint and lime drink served with ice.",
      image:
        "https://plus.unsplash.com/premium_photo-1722194069219-16ec49c08625?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 140,
      rating: 4.1,
    },
    {
      id: 14,
      title: "Strawberry Smoothie",
      category: "Drinks",
      diet: ["halal", "all"],
      price: 4.25,
      description: "Creamy blend of strawberries, yogurt, and honey.",
      image:
        "https://images.unsplash.com/photo-1611928237590-087afc90c6fd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 130,
      rating: 4.4,
    },
    {
      id: 15,
      title: "Cold Brew Coffee",
      category: "Drinks",
      diet: ["halal", "all"],
      price: 3.5,
      description: "Chilled, slow-brewed coffee with a smooth flavor.",
      image:
        "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      popularity: 170,
      rating: 4.0,
    },
  ];

  const menuType = [
    {
      id: 1,
      name: "Main Course",
      active: true,
      icon: <FaDrumstickBite className="text-2xl text-background" />,
    },
    {
      id: 2,
      name: "Appetizer",
      active: false,
      icon: <FaBreadSlice className="text-2xl text-background" />,
    },
    {
      id: 3,
      name: "Fast Food",
      active: false,
      icon: <FaPizzaSlice className="text-2xl text-background" />,
    },
    {
      id: 4,
      name: "Dessert",
      active: false,
      icon: <FaIceCream className="text-2xl text-background" />,
    },
    {
      id: 5,
      name: "Drinks",
      active: false,
      icon: <FaWineGlassAlt className="text-2xl text-background" />,
    },
  ];
  const [searchText, setSearchText] = React.useState("");
  const [activeMenu, setActiveMenu] = React.useState("Main Course");
  const [filters, setFilters] = React.useState({
    selectedDiet: ["all"],
    priceRange: [0, 100],
    selectedSort: "default",
  });

  const handleApplySearch = (searchText: { searchText: string }) => {
    console.log("Search applied:", searchText);
    setSearchText(searchText.searchText);
  };

  const handleMenuClick = (name: string) => {
    console.log("Menu clicked:", name);
    setActiveMenu(name);
  };

  const handleApplyFilters = (filters: {
    selectedDiet: string[];
    priceRange: number[];
    selectedSort: string;
  }) => {
    setFilters((prev) => ({
      ...prev,
      selectedDiet:
        filters.selectedDiet.length === 0 ? ["all"] : filters.selectedDiet,
      priceRange: filters.priceRange,
      selectedSort: filters.selectedSort || "default",
    }));
    console.log("Applying filters:", filters);
  };

  const handleResetFilters = () => {
    setFilters({
      selectedDiet: ["all"],
      priceRange: [0, 100],
      selectedSort: "default",
    });
    console.log("Filters reset");
  };
  return (
    <div className="w-full">
      {/* Background Section */}
      <PageBanner title="Discover Our Exclusive Menu" image="/images/PageBanners/menuPage.jpg"/>
      <SpecialsCorousel />

      <MenuFilter
        onApplySearch={handleApplySearch}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <div className="w-full flex flex-col items-center justify-center  gap-5 p-5">
        <div className="w-full sm:px-0 py-5">
          <FadeInSection className="flex sm:flex-row justify-center flex-col gap-2 sm:gap-10 p-2 ">
            {menuType.map((item) => (
              <Card
                key={item.id}
                className={`${
                  activeMenu == item.name
                    ? "bg-theme scale-105"
                    : "bg-foreground hover:bg-background/10"
                } rounded-sm cursor-pointer px-5 transition duration-300`}
              >
                <div
                  className="p-2 py-5 flex gap-2"
                  onClick={() => handleMenuClick(item.name)}
                >
                  {item.icon}
                  <h2 className="text-lg font-semibold text-accent">
                    {item.name}
                  </h2>
                </div>
              </Card>
            ))}
          </FadeInSection>
        </div>

        <FadeInSection className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence mode="wait">
            {menuItems
              .filter(
                (item) =>
                  item.category === activeMenu &&
                  (searchText.trim() === "" ||
                    item.title
                      .toLowerCase()
                      .includes(searchText.toLowerCase())) &&
                  filters.selectedDiet.some((diet) =>
                    item.diet.includes(diet)
                  ) &&
                  item.price >= filters.priceRange[0] &&
                  item.price <= filters.priceRange[1]
              )
              .sort((a, b) => {
                switch (filters.selectedSort) {
                  case "price-asc":
                    return a.price - b.price;
                  case "price-desc":
                    return b.price - a.price;
                  case "popularity":
                    return b.popularity - a.popularity;
                  case "rating":
                    return b.rating - a.rating;
                  default:
                    return 0; // No sorting applied
                }
              })
              .map((item) => (
                <motion.div
                  key={`${activeMenu}-${item.id}`} // IMPORTANT: this key must change when activeMenu changes
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full"
                >
                  <Card className="h-full rounded-2xl max-w-sm border-3 border-theme overflow-hidden transition-shadow duration-300 group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-[1/1] overflow-hidden">
                        <img
                          src={`${item.image}`}
                          alt={`Special ${item.id}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-2 ">
                        <h3 className="text-lg font-semibold text-accent">
                          {item.title}
                        </h3>
                        <p className="text-sm text-secondary">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-theme font-bold text-lg">
                            {item.price.toFixed(2)}$
                          </span>
                          <Button className="bg-theme text-white text-sm px-3 py-1 rounded-full hover:bg-theme-dark transition">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </AnimatePresence>
        </FadeInSection>
      </div>

      <ImageGallery/>
    </div>
  );
}

export default MenuPage;
