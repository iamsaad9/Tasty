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
import ItemNotAvailable from "../ItemNotAvailable";

// Updated interfaces to support multiple variation types
interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface VariationGroup {
  type: string;
  variations: ItemVariation[];
}

interface CartItem {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations: { [key: string]: string }; // Changed to object to store multiple variations
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
        base: "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent data-[selected=true]:border-primary border-(--secondary)/20",
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
  const [selectedVariations, setSelectedVariations] = useState<{
    [key: string]: number;
  }>({});
  const [instructions, setInstructions] = useState("");
  const { selectedLocation, deliveryMode } = useLocationStore();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const session = useSession();

  // Group variations by type
  const getVariationGroups = (): VariationGroup[] => {
    if (!selectedItem?.itemVariation) return [];

    const groups: { [key: string]: ItemVariation[] } = {};

    selectedItem.itemVariation.forEach((variation) => {
      if (!groups[variation.type]) {
        groups[variation.type] = [];
      }
      groups[variation.type].push(variation);
    });

    return Object.entries(groups).map(([type, variations]) => ({
      type,
      variations,
    }));
  };

  // Initialize selected variations when modal opens
  useEffect(() => {
    if (isOpen && selectedItem) {
      const variationGroups = getVariationGroups();
      const initialSelections: { [key: string]: number } = {};

      variationGroups.forEach((group) => {
        // Default to first variation in each group
        initialSelections[group.type] = 0;
      });

      setSelectedVariations(initialSelections);
    }
  }, [isOpen, selectedItem]);

  const handleClose = () => {
    closeModal();
    router.push(previousPath || "/", { scroll: false });
    setQuantity(1);
    setSelectedVariations({});
    setInstructions("");
  };

  const handleVariationChange = (type: string, index: number) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: index,
    }));
  };

  const calculateFinalPrice = () => {
    const basePrice = selectedItem?.price ?? 0;
    let totalMultiplier = 1;

    const variationGroups = getVariationGroups();

    // Calculate combined price multiplier from all selected variations
    variationGroups.forEach((group) => {
      const selectedIndex = selectedVariations[group.type] ?? 0;
      const selectedVariation = group.variations[selectedIndex];
      if (selectedVariation) {
        totalMultiplier *= selectedVariation.price_multiplier;
      }
    });

    return basePrice * totalMultiplier * quantity;
  };

  const getSelectedVariationNames = (): { [key: string]: string } => {
    const variationGroups = getVariationGroups();
    const selectedNames: { [key: string]: string } = {};

    variationGroups.forEach((group) => {
      const selectedIndex = selectedVariations[group.type] ?? 0;
      const selectedVariation = group.variations[selectedIndex];
      if (selectedVariation) {
        selectedNames[group.type] = selectedVariation.name;
      }
    });

    return selectedNames;
  };

  const handleAddItem = () => {
    const finalPrice = calculateFinalPrice();

    const cartItem: CartItem = {
      itemId: selectedItem?.id ?? 0,
      itemName: selectedItem?.name ?? "",
      itemImage: selectedItem?.image ?? "",
      itemPrice: Number(finalPrice.toFixed(2)),
      itemBasePrice: finalPrice / quantity,
      itemQuantity: quantity,
      itemVariations: getSelectedVariationNames(),
      itemInstructions: instructions,
    };
    console.log("cartItem", cartItem);

    addItem(cartItem);
    closeModal();
    addToast({
      title: "Success!",
      description: "Successfully added item to cart",
      color: "success",
    });
  };

  const variationGroups = getVariationGroups();
  const finalPrice = calculateFinalPrice();
  const basePrice = selectedItem?.price ?? 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        hideCloseButton
        backdrop="blur"
        size="5xl"
        placement="center"
        scrollBehavior="outside"
        className="rounded-xl text-accent overflow-auto my-5 mx-2"
      >
        <ModalContent>
          <div className="flex flex-col md:flex-row h-[80vh]">
            {selectedItem?.id === undefined ||
            (selectedItem?.delivery_locations?.every(
              (i) => i.area !== selectedLocation
            ) &&
              deliveryMode === "delivery") ? (
              <ItemNotAvailable />
            ) : (
              <>
                {/* Left image */}
                <div className="w-full h-80 md:h-auto md:w-1/2 p-4">
                  <img
                    src={selectedItem?.image || ""}
                    alt={selectedItem?.name || ""}
                    width={600}
                    height={600}
                    className="rounded-xl object-cover w-full h-full"
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
                        $. {(finalPrice / quantity).toFixed(2)}
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

                  {/* Variations - Multiple Groups */}
                  <div className="mt-4 space-y-4 overflow-y-auto flex-1 max-h-[40vh]">
                    {variationGroups.map((group) => (
                      <div key={group.type}>
                        <h3 className="text-base font-semibold mb-2 capitalize">
                          {group.type}
                        </h3>
                        <RadioGroup
                          className=""
                          classNames={{
                            wrapper: "grid grid-cols-3 sm:grid-cols-2 gap-1",
                          }}
                          value={(
                            selectedVariations[group.type] ?? 0
                          ).toString()}
                          onChange={(e) =>
                            handleVariationChange(
                              group.type,
                              Number(e.target.value)
                            )
                          }
                        >
                          {group.variations.map((variation, index) => (
                            <CustomRadio key={index} value={index.toString()}>
                              <div className="flex justify-between items-center w-full gap-5">
                                <h1 className="text-accent text-sm">
                                  {variation.name}
                                </h1>
                                {variation.price_multiplier !== 1 && (
                                  <span className="text-sm text-gray-500">
                                    {variation.price_multiplier > 1
                                      ? "$ +"
                                      : "$ "}
                                    {(
                                      basePrice * variation.price_multiplier -
                                      basePrice
                                    ).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </CustomRadio>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  <div className="mt-3">
                    <label className="font-medium text-sm">
                      Special Instructions
                    </label>
                    <textarea
                      placeholder="Please enter instructions about this item"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full mt-1 border rounded-md p-2 resize-none h-16 text-sm"
                    />
                  </div>

                  {/* Spacer - Reduced */}
                  <div className="flex-grow min-h-[10px]"></div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 border-t pt-3">
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
