"use client";
import { useEffect, useState } from "react";
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
import CustomModal from "./Modals/Modal";

interface CartItem {
  itemId?: number;
  itemName?: string;
  itemImage?: string;
  itemPrice?: number;
  itemBasePrice?: number;
  itemQuantity?: number;
  itemVariation?: string;
  itemInstructions?: string;
}

export default function CartDrawer() {
  const { isOpen, items, toggleCart, removeItem, clearCart } = useCartStore();
  const [cartItem, setCartItem] = useState<CartItem[]>([]);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(2);
  const [taxPrice, setTaxPrice] = useState(0);
  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
    onclose: () => {},
  });

  useEffect(() => {
    setCartItem(items);
  }, [items]);

  useEffect(() => {
    console.log("cartItem", cartItem);
  }, [cartItem]);

  useEffect(() => {
    const total = cartItem.reduce((acc, item) => {
      const price = item.itemPrice ?? 0;
      const qty = item.itemQuantity ?? 1;
      return acc + price * qty;
    }, 0);
    setSubTotalPrice(total);
    setTaxPrice(total * 0.1);
  }, [cartItem]);

  return (
    <>
      <Drawer
        hideCloseButton
        size="lg"
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 rounded-medium text-accent ",
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
                  <ArrowRight color="black" />
                </Button>
              </DrawerHeader>

              {/* Body */}
              <DrawerBody className="pt-4 px-4 pb-0 space-y-6">
                {/* Cart Items */}
                {cartItem.length > 0 ? (
                  <div className="space-y-4">
                    {cartItem.map((i) => (
                      <Card
                        key={i.itemId}
                        className="flex flex-row gap-2 items-center p-2 text-accent"
                      >
                        <img
                          src={i.itemImage}
                          alt="Dish"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex flex-row justify-between items-center w-full ">
                          <div>
                            <h3 className="font-medium text-base line-clamp-1">
                              {i.itemName}
                            </h3>
                            <p className="text-xs text-default-500 line-clamp-2">
                              {i.itemInstructions}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-5 ">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setCartItem((prevItems) =>
                                    prevItems.map((item) =>
                                      item.itemId === i.itemId
                                        ? {
                                            ...item,
                                            itemQuantity: Math.max(
                                              1,
                                              (item.itemQuantity || 1) - 1
                                            ),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                              >
                                <Minus size={10} />
                              </button>

                              <span className="font-medium text-base">
                                {i.itemQuantity}
                              </span>

                              <button
                                onClick={() => {
                                  setCartItem((prevItems) =>
                                    prevItems.map((item) =>
                                      item.itemId === i.itemId
                                        ? {
                                            ...item,
                                            itemQuantity:
                                              (item.itemQuantity || 1) + 1,
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <span className="min-w-14 text-sm font-semibold">
                              ${" "}
                              {(
                                (i.itemBasePrice || 0) * (i.itemQuantity || 1)
                              ).toFixed(2)}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="hover:!bg-red-200"
                            >
                              <Trash
                                size={15}
                                onClick={() => {
                                  setShowModal({
                                    open: true,
                                    title: "Remove Item?",
                                    description: `Are you sure you want to remove ${i.itemName} from the cart?`,
                                    button: "Remove",
                                    onclose: () => removeItem(i.itemId),
                                  });
                                }}
                              />
                            </Button>
                          </div>
                        </div>
                        {showModal && (
                          <CustomModal
                            onClose={() =>
                              setShowModal({
                                open: false,
                                title: "",
                                description: "",
                                button: "",
                                onclose: () => {},
                              })
                            }
                            isOpen={showModal.open}
                            title={showModal.title}
                            description={showModal.description}
                          >
                            <Button
                              color="danger"
                              variant="flat"
                              onPress={() => {
                                removeItem(i.itemId),
                                  setShowModal({
                                    open: false,
                                    title: "",
                                    description: "",
                                    button: "",
                                    onclose: () => {},
                                  });
                              }}
                            >
                              {showModal.button}
                            </Button>
                            <Button
                              color="default"
                              onPress={() =>
                                setShowModal({
                                  open: false,
                                  title: "",
                                  description: "",
                                  button: "",
                                  onclose: () => {},
                                })
                              }
                            >
                              Close
                            </Button>
                          </CustomModal>
                        )}
                      </Card>
                    ))}
                    {/* <Button className="w-full bg-theme mt-5" >
                    <span className="font-medium t.ext-base">Continue Shopping</span>
                </Button> */}
                    <div className="flex w-full justify-end mt-5">
                      <AddItemButton />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
                    <img
                      src="/images/Miscellaneous/emptyCart.jpg"
                      alt="Empty Cart Icon"
                      className="w-96"
                    />
                    <AddItemButton />
                  </div>
                )}
              </DrawerBody>

              {/* Footer */}
              {cartItem.length > 0 && (
                <DrawerFooter className="border-t p-4 bg-white flex-col">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-default-500">Subtotal</span>
                    <span className="text-sm font-semibold">
                      $ {subTotalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-default-500">Delivery</span>
                    <span className="text-sm font-semibold">
                      $ {deliveryCharges}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-default-500">Tax</span>
                    <span className="text-sm font-semibold">
                      $ {taxPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2 border-t py-2">
                    <span className="text-md text-accent font-medium">
                      Total
                    </span>
                    <span className="text-md font-semibold">
                      ${" "}
                      {(subTotalPrice + taxPrice + deliveryCharges).toFixed(2)}
                    </span>
                  </div>
                  <CheckoutButton />
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
