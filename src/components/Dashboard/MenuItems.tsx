import { Card } from "@heroui/react";
import React,{useState,useEffect} from "react";
import { FaWineGlassAlt, FaIceCream, FaDrumstickBite } from "react-icons/fa";
import { motion } from "framer-motion";
import FadeInSection from "../ui/scrollAnimated";
import { Link } from "@heroui/react";
import Heading from "../Heading";
interface MenuItems {
  id:number,
  title:string,
  category:string,
  diet:string[],
  price:number,
  description:string,
  image:string,
  popularity:number,
  rating:number,
  special:boolean,
  delivery:{
    isDeliverable:boolean,
    estimatedTime:string,
    baseFee:number,
    freeAbove:number,
    minOrder:number,
    areas:[
      {
        name:string,
        postalCode:string,
        fee:number,
      }
    ]
  }
}

interface MenuItemProps{
 showLoading: (val: boolean) => void;
}

function MenuItems({showLoading}:MenuItemProps) {
  const [activeMenu, setActiveMenu] = useState<string>('Main');
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

  const [menuItems,setMenuItems] = useState<MenuItems[]>([])
 
   useEffect(()=>{
     const fetchMenuItems = async () => {
      showLoading(true);
       const res = await fetch('/Data/menu.json');
       const data = await res.json();
       setMenuItems(data);
       showLoading(false);
     }
 
     fetchMenuItems();
   },[]);

  const handleMenuClick = (id: number) => {
    console.log("Menu clicked:", id);
    console.log(menuType[id-1].name)
    setActiveMenu(menuType[id-1].name);
  };
  return (
    <div className=" w-full lg:w-[90vw] xl:w-[80vw] flex flex-col gap-10 py-10 justify-center items-center px-5 lg:px-0">
      <Heading title="OUR MENU" subheading="Discover Our Exclusive Menu"/>

      <div className="w-full sm:px-0 ">
        <FadeInSection
          delay={0.2}
          className="flex sm:flex-row justify-center flex-col gap-2 sm:gap-10 p-2 "
        >
          {menuType.map((item) => (
            <Card
              key={item.id}
              className={`${
                activeMenu == item.name
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
        </FadeInSection>
      </div>

      <div className="w-full grid gap-5 md:grid-cols-2">
        {menuItems
          .filter((item) => item.category.split(' ')[0] === activeMenu)
          .map((item) => (
            <motion.div
              key={`${activeMenu}-${item.id}`} 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.8 }}
            >
              <FadeInSection className="w-full">
                <Card
                  key={item.id}
                  className="bg-foreground p-4 rounded-sm hover:bg-theme cursor-pointer"
                >
                  <div className="flex flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex items-center sm:items-center gap-4 flex-1">
                      <div
                        className="min-w-[70px] min-h-[70px] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-red-500 flex items-center justify-center text-white font-bold"
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      <div className="flex flex-col">
                        <h2 className="text-base sm:text-lg font-semibold text-accent line-clamp-1">
                          {item.title}
                        </h2>
                        <p className="text-xs md:text-sm text-accent/60 mt-1 sm:mt-2 line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price */}
                    <div className="text-right flex items-center">
                      <h1 className="text-lg md:text-2xl font-semibold text-accent">
                        ${item.price}
                      </h1>
                    </div>
                  </div>
                </Card>
              </FadeInSection>
            </motion.div>
          ))}
      </div>

      <FadeInSection>
        <Link
          href="/menu"
          className="bg-transparent border-2 rounded-none border-secondary text-secondary px-2 md:px-10 py-3 text-sm md:text-xl cursor-pointer hover:bg-secondary hover:text-foreground transition-colors duration-300"
        >
          SEE MORE
        </Link>
      </FadeInSection>
    </div>
  );
}

export default MenuItems;
