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
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";

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
                  <Card key={i} className="flex flex-row gap-4 items-center p-2 text-accent">
                    <img
                      src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                      alt="Dish"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex flex-row justify-between w-full">
                      <div>
                      <h3 className="font-medium text-sm">Spicy Chicken Burger</h3>
                      <p className="text-xs text-default-500">with cheese & fries</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          min={1}
                          className="w-12 px-2 py-1 text-center border rounded text-sm"
                        />
                        <span className="text-sm font-semibold text-foreground">Rs. 450</span>
                          <Button isIconOnly size="sm" variant="light">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-default-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                      </div>
                    </div>
                  
                  </Card>
                ))}
              </div>
            </DrawerBody>

            {/* Footer */}
            <DrawerFooter className="border-t p-4 bg-white">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-default-500">Subtotal</span>
                <span className="text-sm font-semibold">Rs. 900</span>
              </div>
              <Button
                className="w-full bg-primary text-white font-medium hover:bg-primary/90 transition"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  </>
);

}
