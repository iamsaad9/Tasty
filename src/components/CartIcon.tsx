"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge,Avatar } from "@heroui/react";
import CartButton from "./CartButton";
function CartIcon() {
  return (
    <div className="fixed right-5 md:right-10 bottom-10 lg:bottom-20 z-50 bg-theme rounded-full shadow-md">
      <Badge color="danger" content="2" shape="circle" showOutline={false} >
        {/* <ShoppingCart className="m-2" color="black" /> */}
        <CartButton/>
      </Badge>
    </div>
  );
}

export default CartIcon;
