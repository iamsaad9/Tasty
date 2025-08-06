"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge, Avatar } from "@heroui/react";
import CartButton from "./CartButton";
import { useCartStore } from "@/lib/store/cartStore";

function CartIcon() {
  const { items } = useCartStore();
  const [itemsInCart, setItemsInCart] = useState(0);
  useEffect(() => {
    setItemsInCart(items.length);
  }, [items]);

  return (
    <div className="fixed right-5 md:right-10 bottom-10 lg:bottom-20 z-50 bg-theme rounded-full shadow-md">
      <Badge
        color="danger"
        content={itemsInCart}
        shape="circle"
        showOutline={false}
      >
        {/* <ShoppingCart className="m-2" color="black" /> */}
        <CartButton />
      </Badge>
    </div>
  );
}

export default CartIcon;
