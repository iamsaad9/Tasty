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
} from "@heroui/react";
import { ArrowRight, Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import CheckoutButton from "./ui/CheckoutButton";
import AddItemButton from "./ui/AddItemButton";
import CustomModal from "./Modals/Modal";

export default function CartDrawer() {
  const { isOpen, items, toggleCart, removeItem, updateItemQuantity } =
    useCartStore();
  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
    onclose: () => {},
    itemIndex: -1,
  });

  useEffect(() => {
    console.log("items", items);
  }, []);

  // Helper function to format variations display - handles both old and new formats
  const formatVariations = (
    variations: { [key: string]: string } | ItemVariation[] | undefined
  ) => {
    if (!variations) return "";

    // Handle new format (object)
    if (typeof variations === "object" && !Array.isArray(variations)) {
      if (Object.keys(variations).length === 0) return "";
      return Object.entries(variations)
        .map(
          ([type, value]) =>
            `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`
        )
        .join(", ");
    }

    // Handle old format (array) for backward compatibility
    if (Array.isArray(variations)) {
      return variations
        .map(
          (variation) =>
            `${
              variation.type.charAt(0).toUpperCase() + variation.type.slice(1)
            }: ${variation.name}`
        )
        .join(", ");
    }

    return "";
  };

  // Add interface for backward compatibility
  interface ItemVariation {
    type: string;
    name: string;
    price_multiplier: number;
  }

  // Handle quantity decrease
  const handleDecreaseQuantity = (index: number) => {
    const currentItem = items[index];
    const newQuantity = Math.max(1, (currentItem.itemQuantity || 1) - 1);

    // Update the cart store directly
    updateItemQuantity(index, newQuantity);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (index: number) => {
    const currentItem = items[index];
    const newQuantity = (currentItem.itemQuantity || 1) + 1;

    // Update the cart store directly
    updateItemQuantity(index, newQuantity);
  };

  // Handle item removal
  const handleRemoveItem = (index: number) => {
    removeItem(index);
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
      onclose: () => {},
      itemIndex: -1,
    });
  };

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
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <Card
                        key={`${item.itemId}-${index}`}
                        className="flex flex-row gap-2 items-center p-2 text-accent"
                      >
                        <img
                          src={item.itemImage}
                          alt="Dish"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="flex flex-row justify-between items-center w-full ">
                          <div>
                            <h3 className="font-medium text-base line-clamp-1">
                              {item.itemName}
                            </h3>
                            <p className="text-xs text-default-500 line-clamp-2">
                              {item.itemInstructions}
                            </p>
                            {/* Fixed variations display - handles both formats */}
                            <p className="text-xs text-default-500 line-clamp-2">
                              {formatVariations(
                                item.itemVariations ||
                                  (item as any).itemVariation
                              )}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-5 ">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDecreaseQuantity(index)}
                                className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                              >
                                <Minus size={10} />
                              </button>

                              <span className="font-medium text-base">
                                {item.itemQuantity}
                              </span>

                              <button
                                onClick={() => handleIncreaseQuantity(index)}
                                className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <span className="min-w-14 text-sm font-semibold">
                              ${" "}
                              {(
                                (item.itemBasePrice || 0) *
                                (item.itemQuantity || 1)
                              ).toFixed(2)}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="hover:!bg-red-200"
                              onPress={() => {
                                setShowModal({
                                  open: true,
                                  title: "Remove Item?",
                                  description: `Are you sure you want to remove ${item.itemName} from the cart?`,
                                  button: "Remove",
                                  onclose: () => {},
                                  itemIndex: index,
                                });
                              }}
                            >
                              <Trash size={15} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
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
              {items.length > 0 && (
                <DrawerFooter className="border-t p-4 bg-white flex-col">
                  <div className="flex justify-between mb-2  py-2">
                    <span className="text-md text-accent font-medium">
                      Total
                    </span>
                    <span className="text-md font-semibold">
                      ${" "}
                      {items
                        .reduce(
                          (acc, item) =>
                            acc +
                            (item.itemBasePrice ?? 0) *
                              (item.itemQuantity ?? 1),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <CheckoutButton />
                </DrawerFooter>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Modal */}
      {showModal.open && (
        <CustomModal
          onClose={() =>
            setShowModal({
              open: false,
              title: "",
              description: "",
              button: "",
              onclose: () => {},
              itemIndex: -1,
            })
          }
          isOpen={showModal.open}
          title={showModal.title}
          description={showModal.description}
        >
          <Button
            color="danger"
            variant="flat"
            onPress={() => handleRemoveItem(showModal.itemIndex)}
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
                itemIndex: -1,
              })
            }
          >
            Close
          </Button>
        </CustomModal>
      )}
    </>
  );
}
