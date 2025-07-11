'use client'
import {
  Drawer,
  Card,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Image,
  Link,
  Tooltip,
  Avatar,
  AvatarGroup,
} from "@heroui/react";
import { ArrowRight, Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import CheckoutButton from "./ui/CheckoutButton";
import AddItemButton from "./ui/AddItemButton";

export default function CartDrawer() {
  const { isOpen, items, toggleCart, removeItem, clearCart } = useCartStore();
  
return (
  <>
    <Drawer
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: "data-[placement=right]:sm:m-2 rounded-medium text-accent",
      }}
      isOpen={isOpen}
      onClose={() => toggleCart(false)}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            {/* Header */}
            <DrawerHeader className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border-b border-default-200/50">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <Button isIconOnly variant="light" onPress={onClose}>
                <ArrowRight color="black"/>
              </Button>
            </DrawerHeader>

            {/* Body */}
            <DrawerBody className="pt-4 px-4 pb-0 space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {[1, 2].map((item, i) => (
                  <Card key={i} className="flex flex-row gap-2 items-center p-2 text-accent">
                    <img
                      src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                      alt="Dish"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex flex-row justify-between items-center w-full ">
                      <div>
                      <h3 className="font-medium text-sm">Spicy Chicken Burger</h3>
                      <p className="text-xs text-default-500">with cheese & fries</p>
                      </div>
                      <div className="flex items-center justify-between gap-3 ">
                        <div className="flex flex-row items-center gap-2 rounded-full border-1 border-accent p-1">
                          <Minus size={15} className="bg-theme/50 rounded-full cursor-pointer hover:scale-110"/>
                          <span>1</span>
                          <Plus size={15} className="bg-theme/50 rounded-full cursor-pointer hover:scale-110"/>
                        </div>
                        <span className="text-sm font-semibold">Rs. 450</span>
                          <Button isIconOnly size="sm" variant="light">
                          <Trash size={15}/>
                    </Button>
                      </div>
                    </div>
                  
                  </Card>
                ))}
                {/* <Button className="w-full bg-theme mt-5" >
                    <span className="font-medium t.ext-base">Continue Shopping</span>
                </Button> */}
                <div className="flex w-full justify-end mt-5">
                <AddItemButton/>
                </div>
              </div>
            </DrawerBody>

            {/* Footer */}
            <DrawerFooter className="border-t p-4 bg-white flex-col">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-default-500">Subtotal</span>
                <span className="text-sm font-semibold">Rs. 900</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-default-500">Delivery</span>
                <span className="text-sm font-semibold">Rs. 150</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-default-500">Tax</span>
                <span className="text-sm font-semibold">Rs. 105</span>
              </div>
              <div className="flex justify-between mb-2 border-t py-2">
                <span className="text-md text-accent font-medium">Total</span>
                <span className="text-md font-semibold">Rs. 1155</span>
              </div>
              <CheckoutButton/>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  </>
);

}
