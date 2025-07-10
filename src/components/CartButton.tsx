'use client'
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
const CartButton = () => {
    const [showCart, setShowCart] = useState(false);
    const {toggleCart } = useCartStore()
  return (
    <button className="cursor-pointer relative after:content-['Cart'] after:text-white after:absolute after:text-nowrap after:scale-0 hover:after:scale-100 after:duration-200 md:w-16 w-12 h-12 md:h-16 rounded-full border-2 md:border-4 border-theme bg-black pointer flex items-center justify-center duration-300 hover:rounded-[50px] hover:w-20 group/button overflow-hidden active:scale-90" onClick={()=>toggleCart(true)}>
     
      <ShoppingCart className=" delay-50 duration-200 group-hover/button:-translate-y-12" />
    
    </button>
  );
};

export default CartButton;
