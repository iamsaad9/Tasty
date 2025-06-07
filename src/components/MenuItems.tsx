import { Card } from "@heroui/react";
import React from "react";
import { FaWineGlassAlt, FaIceCream, FaDrumstickBite } from "react-icons/fa";
import { motion } from "framer-motion";

function MenuItems() {
  const [activeMenu, setActiveMenu] = React.useState(1);
  const menuType = [
    {
      id: 1,
      name: "Main",
      active: true,
      icon: <FaDrumstickBite className="text-2xl text-background" />,
    },
    {
      id: 2,
      name: "Dessert",
      active: false,
      icon: <FaIceCream className="text-2xl text-background" />,
    },
    {
      id: 3,
      name: "Drinks",
      active: false,
      icon: <FaWineGlassAlt className="text-2xl text-background" />,
    },
  ];

  const menuItems = [
    {
      type: 1,
      id: 1,
      name: "Grilled Beef with Potatoes",
      price: "$29",
      description:
        "Tender grilled beef served with seasoned potatoes and a side of rice and tomatoes.",
    },
    {
      type: 1,
      id: 2,
      name: "Fruit Vanilla Ice Cream",
      price: "$29",
      description:
        "Refreshing vanilla ice cream topped with fresh seasonal fruits.",
    },
    {
      type: 1,
      id: 3,
      name: "Asian Hoisin Pork",
      price: "$29",
      description:
        "Sweet and savory pork glazed in hoisin sauce, served with rice and vegetables.",
    },
    {
      type: 1,
      id: 4,
      name: "Spicy Fried Rice & Bacon",
      price: "$29",
      description:
        "A spicy blend of fried rice and crispy bacon with savory seasonings.",
    },
    {
      type: 1,
      id: 5,
      name: "Mango Chili Chutney",
      price: "$29",
      description:
        "Tangy mango chutney with a kick of chili, perfect as a sweet-spicy main.",
    },
    {
      type: 1,
      id: 6,
      name: "Savory Watercress Pancakes",
      price: "$29",
      description:
        "Chinese-style pancakes with fresh watercress and a savory stuffing.",
    },
    {
      type: 1,
      id: 7,
      name: "Soup with Vegetables and Meat",
      price: "$29",
      description:
        "Hearty soup filled with mixed vegetables and tender cuts of meat.",
    },
    {
      type: 1,
      id: 8,
      name: "Udon Noodles with Vegetables",
      price: "$29",
      description:
        "Thick udon noodles stir-fried with assorted vegetables and light sauce.",
    },
    {
      type: 1,
      id: 9,
      name: "Baked Lobster with Garnish",
      price: "$29",
      description:
        "Oven-baked lobster with herbs and gourmet garnish, served hot.",
    },
    {
      type: 1,
      id: 10,
      name: "Octopus with Vegetables",
      price: "$29",
      description:
        "Grilled octopus with a medley of vegetables, rich in flavor and texture.",
    },
  ];

  const handleMenuClick = (id: number) => {
    console.log("Menu clicked:", id);
    setActiveMenu(id);
  };
  return (
    <div className=" w-full lg:w-[90vw] xl:w-[80vw] flex flex-col gap-10 py-20 justify-center items-center px-5 lg:px-0">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-background/30 text-md font-semibold">OUR MENU</h1>
        <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold ">
          Discover Our Exclusive Menu
        </h1>
      </div>

      <div className="w-full sm:px-0 py-5">
        <div className="flex sm:flex-row justify-center flex-col gap-2 sm:gap-10 p-2 ">
          {menuType.map((item) => (
            <Card
              key={item.id}
              className={`${
                activeMenu == item.id
                  ? "bg-theme scale-105"
                  : "bg-foreground hover:bg-background/10"
              } rounded-sm cursor-pointer px-5`}
            >
              <div
                className="p-2 py-5 flex gap-2"
                onClick={() => handleMenuClick(item.id)}
              >
                {item.icon}
                <h2 className="text-lg font-semibold text-accent">
                  {item.name}
                </h2>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full grid gap-5 md:grid-cols-2">
        {menuItems
          .filter((item) => item.type === activeMenu)
          .map((item) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.8 }}
            >
             
              <Card
                key={item.id}
                className="bg-foreground p-4 rounded-sm hover:bg-theme cursor-pointer"
              >
                <div className="flex flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: Image + Text */}
                  <div className="flex items-center sm:items-center gap-4 flex-1">
                    <div
                      className="min-w-[70px] min-h-[70px] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500 flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundImage: `url(./images/MenuItems/Main/item${item.id}.jpg)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="flex flex-col">
                      <h2 className="text-base sm:text-lg font-semibold text-accent">
                        {item.name}
                      </h2>
                      <p className="text-sm text-accent/60 mt-1 sm:mt-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right flex items-center">
                    <h1 className="text-2xl font-semibold text-accent">
                      {item.price}
                    </h1>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

export default MenuItems;
