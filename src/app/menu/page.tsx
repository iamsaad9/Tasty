"use client";
import React from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import { indie } from "@/components/utils/fonts";
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
function MenuPage() {
  const menuItems = [
    // Main Course
    {
      id: 1,
      title: "Butter Chicken",
      category: "Main Course",
      price: 12.99,
      description:
        "A delicious blend of spices and tender chicken cooked in a creamy tomato sauce.",
      image:
        "https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?q=80&w=687&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Grilled Salmon",
      category: "Main Course",
      price: 15.49,
      description:
        "Fresh salmon grilled to perfection served with herbs and lemon.",
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Lasagna",
      category: "Main Course",
      price: 11.75,
      description: "Layered pasta with rich meat sauce and creamy cheese.",
      image:
        "https://plus.unsplash.com/premium_photo-1671559021023-3da68c12aeed?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    // Appetizers
    {
      id: 4,
      title: "Spring Rolls",
      category: "Appetizer",
      price: 5.25,
      description:
        "Crispy fried rolls stuffed with vegetables and served with sweet chili sauce.",
      image:
        "https://images.unsplash.com/photo-1679310290259-78d9eaa32700?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "Bruschetta",
      category: "Appetizer",
      price: 6.99,
      description:
        "Grilled bread topped with garlic, tomatoes, olive oil, and basil.",
      image:
        "https://plus.unsplash.com/premium_photo-1677686707252-16013f466e61?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      title: "Mozzarella Sticks",
      category: "Appetizer",
      price: 6.5,
      description: "Deep-fried cheese sticks served with marinara sauce.",
      image:
        "https://images.unsplash.com/photo-1734774924912-dcbb467f8599?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    // Fast Food
    {
      id: 7,
      title: "Cheeseburger",
      category: "Fast Food",
      price: 8.99,
      description:
        "Juicy grilled beef patty with cheese, lettuce, and tomato in a sesame bun.",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=687&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Shawarma Wrap",
      category: "Fast Food",
      price: 7.49,
      description:
        "Middle Eastern wrap with spiced meat, veggies, and garlic sauce.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 9,
      title: "Chicken Nuggets",
      category: "Fast Food",
      price: 6.75,
      description: "Crispy golden chicken nuggets served with dipping sauce.",
      image:
        "https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    // Dessert
    {
      id: 10,
      title: "Chocolate Lava Cake",
      category: "Dessert",
      price: 5.99,
      description: "Warm chocolate cake with a gooey molten center.",
      image:
        "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 11,
      title: "Tiramisu",
      category: "Dessert",
      price: 6.49,
      description:
        "Classic Italian dessert with coffee-soaked layers and mascarpone cream.",
      image:
        "https://plus.unsplash.com/premium_photo-1695028378225-97fbe39df62a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 12,
      title: "Ice Cream Sundae",
      category: "Dessert",
      price: 4.5,
      description:
        "Scoop of vanilla ice cream topped with chocolate syrup and a cherry.",
      image:
        "https://plus.unsplash.com/premium_photo-1669680785558-c189b49aed4e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    // Drinks
    {
      id: 13,
      title: "Mojito",
      category: "Drinks",
      price: 3.99,
      description: "Refreshing mint and lime drink served with ice.",
      image:
        "https://plus.unsplash.com/premium_photo-1722194069219-16ec49c08625?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 14,
      title: "Strawberry Smoothie",
      category: "Drinks",
      price: 4.25,
      description: "Creamy blend of strawberries, yogurt, and honey.",
      image:
        "https://images.unsplash.com/photo-1611928237590-087afc90c6fd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 15,
      title: "Cold Brew Coffee",
      category: "Drinks",
      price: 3.5,
      description: "Chilled, slow-brewed coffee with a smooth flavor.",
      image:
        "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=719&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const [searchText,setSearchText] = React.useState("");
  const [activeMenu, setActiveMenu] = React.useState("Main Course");

  const handleApplySearch = (searchText: {
    searchText: string;
  }) => {
    console.log("Search applied:", searchText);
    setSearchText(searchText.searchText);
  };

  const handleMenuClick = (name: string) => {
    console.log("Menu clicked:", name);
    setActiveMenu(name);
  };


  const handleApplyFilters = (filters: {
    selectedCategory: string;
    priceRange: number[];
    selectedSort: string;
  }) => {
    console.log("Applying filters:", filters);
  };

  const handleResetFilters = () => {
    console.log("Filters reset");
  };
  return (
    <div className="w-full">
      {/* Background Section */}
      <div className='bg-[url("/images/menupageBg.jpg")] bg-cover bg-center h-72 md:h-[30rem] flex items-center justify-center relative'>
        <div className="absolute w-full h-full bg-[#404044] opacity-50" />
        <FadeInSection className=" absolute flex flex-col items-center justify-center text-center px-4">
          <h2
            className={`${indie.className}  text-white text-2xl md:text-7xl mt-10 mb-4`}
          >
            Discover Our Exclusive Menu
          </h2>
        </FadeInSection>
      </div>
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
            {menuItems.filter((item) =>
  item.category === activeMenu &&
  (searchText.trim() === "" || item.title.toLowerCase().includes(searchText.toLowerCase()))
)
              .map((item) => (
                <motion.div
                  key={`${activeMenu}-${item.id}`} // IMPORTANT: this key must change when activeMenu changes
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="w-full"
                >
                  <Card className="rounded-2xl max-w-sm border-3 border-theme overflow-hidden transition-shadow duration-300 group cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-[1/1] overflow-hidden">
                        <img
                          src={`${item.image}`}
                          alt={`Special ${item.id}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex flex-col gap-2">
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
    </div>
  );
}

export default MenuPage;
