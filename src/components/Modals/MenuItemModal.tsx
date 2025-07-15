'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast,
} from '@heroui/react';
import { useMenuItemModalStore } from '@/lib/store/menuItemModalStore';
import { useRouter } from 'next/navigation';
import { Minus, Plus, X, Share2 } from 'lucide-react';
import Image from 'next/image';

function MenuItemModal() {
  const { isOpen, selectedItem, closeModal, previousPath } = useMenuItemModalStore();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [instructions, setInstructions] = useState('');

  const handleClose = () => {
    closeModal();
    router.push(previousPath || '/', { scroll: false });
    setQuantity(1);
    setSelectedVariation(0);
    setInstructions('');
  };

  const handleAddtoCart = () => {
    addToast({
      title: 'Item Added to Cart',
      color: 'success',
    })
    closeModal();
  }

  const variation = selectedItem?.itemVariation?.[selectedVariation];
  const basePrice = selectedItem?.price ?? 0;
  const finalPrice = (basePrice * (variation?.price_multiplier ?? 1)) * quantity;
  return (
    <Modal isOpen={isOpen} onClose={handleClose} hideCloseButton={true} size="5xl" className="rounded-xl text-accent">
      <ModalContent>
        {() => (
          <div className="flex flex-col md:flex-row h-[80vh]">
            {/* Left image */}
            <div className="w-full h-full md:w-1/2 p-4">
              <img
                src={selectedItem?.image || ''}
                alt={selectedItem?.name || ''}
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
                  <h1 className="text-3xl font-bold">{selectedItem?.name}</h1>
                  <div className="text-2xl font-semibold text-accent mt-2">
                    Rs. {(basePrice * (variation?.price_multiplier ?? 1)).toFixed(0)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Share2 size={18} />
                  </button>
                  <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Variations */}
              <div className="mt-6  ">
                {selectedItem?.itemVariation?.map((v, index) => (
                  <label
                    key={index}
                    className={`flex items-center justify-between border rounded-lg px-4 py-2 mb-2 cursor-pointer ${
                      selectedVariation === index
                        ? 'border-black bg-gray-100'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedVariation(index)}
                  >
                    <div className="flex items-center gap-2 text-accent">
                      <input
                        type="radio"
                        name="variation"
                        checked={selectedVariation === index}
                        onChange={() => setSelectedVariation(index)}
                      />
                      <span>{v.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">
                        $ {(basePrice * v.price_multiplier).toFixed(2)}
                      </span>
                    </div>
                  </label>
                ))}
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
                    className="border rounded-full p-2"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="border rounded-full p-2"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">Rs. {finalPrice.toFixed(2)}</span>
                  <Button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800" onPress={handleAddtoCart}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

export default MenuItemModal;