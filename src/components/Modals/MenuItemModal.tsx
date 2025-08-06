"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  addToast,
  Button,
} from "@heroui/react";
import { useMenuItemModalStore } from "@/lib/store/menuItemModalStore";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, Share2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cartStore";
import { useLocationStore } from "@/lib/store/locationStore";
import LocationModal from "./LocationModal";
import { useSession } from "next-auth/react";
interface MenuItems {
  id: number;
  title: string;
  category: string;
  diet: string[];
  price: number;
  description: string;
  image: string;
  popularity: number;
  rating: number;
  special: boolean;
  itemVariation: [{ type: string; name: string; price_multiplier: number }];
  delivery: {
    isDeliverable: boolean;
    estimatedTime: string;
    baseFee: number;
    freeAbove: number;
    minOrder: number;
    areas: [
      {
        name: string;
        postalCode: string;
        fee: number;
      }
    ];
  };
}

interface CartItem {
  itemId: number | undefined;
  itemName: string | undefined;
  itemImage: string | undefined;
  itemPrice: number;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariation: string | undefined;
  itemInstructions: string;
}

export const CustomRadio = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return (
    <Radio
      value={value}
      classNames={{
        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px]  cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent data-[selected=true]:border-primary border-(--secondary)/20",
      }}
    >
      {children}
    </Radio>
  );
};

function MenuItemModal() {
  const { isOpen, selectedItem, closeModal, previousPath } =
    useMenuItemModalStore();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [instructions, setInstructions] = useState("");
  const { selectedLocation, hasHydrated } = useLocationStore();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const session = useSession();

  const handleClose = () => {
    closeModal();
    router.push(previousPath || "/", { scroll: false });
    setQuantity(1);
    setSelectedVariation(0);
    setInstructions("");
  };

  const handleAddItem = () => {
    const cartItem = {
      itemId: selectedItem?.id,
      itemName: selectedItem?.name,
      itemImage: selectedItem?.image,
      itemPrice: Number(finalPrice.toFixed(2)),
      itemBasePrice: finalPrice / quantity,
      itemQuantity: quantity,
      itemVariation: selectedItem?.itemVariation?.[selectedVariation].name,
      itemInstructions: instructions,
    } as CartItem;

    console.log("cartItem", cartItem);
    addItem(cartItem);
    closeModal();
    addToast({
      title: "Success!",
      description: "Successfully added item to cart",
      color: "success",
    });
  };

  const variation = selectedItem?.itemVariation?.[selectedVariation];
  const basePrice = selectedItem?.price ?? 0;
  const finalPrice = basePrice * (variation?.price_multiplier ?? 1) * quantity;
  console.log("In Modal:", selectedItem);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        hideCloseButton
        backdrop="blur"
        size="5xl"
        placement="center"
        scrollBehavior="inside"
        className="rounded-xl text-accent overflow-auto"
      >
        <ModalContent>
          <div className="flex flex-col md:flex-row h-[80vh]">
            {selectedItem?.id === undefined ||
            selectedItem?.delivery_locations?.every(
              (i) => i.name !== selectedLocation
            ) ? (
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src="/images/Miscellaneous/not_available.png"
                  alt="Not Available Image"
                />
              </div>
            ) : (
              <>
                {/* Left image */}
                <div className="w-full h-80 md:h-auto md:w-1/2 p-4">
                  <img
                    src={selectedItem?.image || ""}
                    alt={selectedItem?.name || ""}
                    width={600}
                    height={600}
                    className="rounded-xl object-cover w-full h-full "
                  />
                </div>

                {/* Right content */}
                <div className="w-full md:w-1/2 p-5 flex flex-col">
                  {/* Header with title and buttons */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {selectedItem?.name}
                      </h1>

                      <div className="text-xl font-semibold text-theme">
                        $.{" "}
                        {(
                          basePrice * (variation?.price_multiplier ?? 1)
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="mt-6">
                    <RadioGroup
                      className=""
                      classNames={{
                        wrapper: "grid grid-cols-2 sm:grid-cols-1",
                      }}
                      value={selectedVariation.toString()}
                      onChange={(e) =>
                        setSelectedVariation(Number(e.target.value))
                      }
                    >
                      {selectedItem?.itemVariation?.map((v, index) => (
                        <CustomRadio key={index} value={index.toString()}>
                          <h1 className="text-accent"> {v.name}</h1>
                        </CustomRadio>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-4">
                    <label className="font-medium">Special Instructions</label>
                    <textarea
                      placeholder="Please enter instructions about this item"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full mt-2 border rounded-md p-2 resize-none h-20"
                    />
                  </div>

                  {/* Spacer */}
                  <div className="flex-grow"></div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-6 border-t pt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="border rounded-full p-2 cursor-pointer bg-theme hover:scale-105 active:scale-100 transition-all duration-200"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        $. {finalPrice.toFixed(2)}
                      </span>
                      <Button
                        className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                        onPress={handleAddItem}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MenuItemModal;
