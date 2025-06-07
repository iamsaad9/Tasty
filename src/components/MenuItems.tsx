import { Card } from "@heroui/react";
import React from "react";
import { FaWineGlassAlt,FaIceCream , FaDrumstickBite } from 'react-icons/fa'

function MenuItems() {

    const [activeMenu, setActiveMenu] = React.useState(1);
    const menuItems = [
        {id:1, name:"Main", active:true, icon:<FaDrumstickBite className="text-2xl text-background"/>},
        {id:2, name:"Dessert",active:false, icon:<FaIceCream className="text-2xl text-background"/>},
        {id:3, name:"Drinks",active:false, icon:<FaWineGlassAlt className="text-2xl text-background"/>}
    ]
    const handleMenuClick = (id:number)=>{
        console.log("Menu clicked:", id);
        setActiveMenu(id);
    }
  return (
    <div className=" w-full lg:w-[90vw] xl:w-[80vw] flex flex-col gap-10 py-20 justify-center items-center px-5 lg:px-0">
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-background/30 text-md font-semibold">OUR MENU</h1>
        <h1 className="text-accent text-3xl font-semibold ">
          Discover Our Exclusive Menu
        </h1>
      </div>

      <div className="w-full sm:px-0 ">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-10 lg:gap-30 p-2">
                {menuItems.map((item) => (
                <Card
                    key={item.id}
                    className={`${activeMenu == item.id ? 'bg-theme scale-105' : 'bg-foreground'} rounded-sm cursor-pointer`}
                    
                >
                    <div className="p-2 py-5 flex gap-2" onClick={()=> handleMenuClick(item.id)}>
                        {item.icon}
                        <h2 className="text-lg font-semibold text-accent">{item.name}</h2>
                    </div>
                </Card>
                ))}
            </div>
      </div>
    </div>
  );
}

export default MenuItems;
