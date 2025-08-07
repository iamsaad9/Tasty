"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { useCartStore } from "@/lib/store/cartStore";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [tip, setTip] = useState(0);
  const [shippingOption, setShippingOption] = useState("pickup");

  useEffect(() => {
    const subtotalCalc = items.reduce((acc, item) => {
      const price = item.itemPrice ?? item.itemPrice ?? 0;
      const qty = item.itemQuantity ?? 1;
      return acc + price * qty;
    }, 0);
    setSubTotal(subtotalCalc);
    setTax(subtotalCalc * 0.08);
    setDelivery(shippingOption === "delivery" ? 2.99 : 0);
  }, [items, shippingOption]);

  const total = subTotal + tax + delivery + tip;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12 text-accent mt-20">
      {/* Contact + Shipping */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email address" size="sm" variant="flat" />
            <Input label="Phone" size="sm" variant="flat" />
            <Input label="First name" size="sm" variant="flat" />
            <Input label="Last name" size="sm" variant="flat" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Billing & Shipping</h2>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="House number and street name"
              size="sm"
              variant="flat"
            />
            <Input label="Town / City" size="sm" variant="flat" />
            <Select label="State" size="sm">
              <SelectItem key="CA">California</SelectItem>
              <SelectItem key="NY">New York</SelectItem>
              <SelectItem key="TX">Texas</SelectItem>
            </Select>
            <Input label="ZIP Code" size="sm" variant="flat" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Additional information</h2>
          <Textarea
            label="Notes about your order, e.g. special notes for delivery."
            variant="flat"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-default-200">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="mb-4">
          <RadioGroup
            label="Shipping"
            orientation="horizontal"
            value={shippingOption}
            onValueChange={setShippingOption}
          >
            <Radio value="pickup">Local pickup</Radio>
            <Radio value="delivery">Local Delivery: $2.99</Radio>
          </RadioGroup>
        </div>

        <div className="border border-default-200 rounded-md divide-y">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start p-4">
              <div>
                <h3 className="font-medium">{item.itemName}</h3>
                {item.itemVariation && (
                  <p className="text-sm text-default-500">
                    {item.itemVariation}
                  </p>
                )}
                {item.itemInstructions && (
                  <p className="text-sm text-default-500">
                    {item.itemInstructions}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm">
                  {item.itemQuantity} x ${" "}
                  {(item.itemPrice ?? item.itemPrice ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tip Buttons */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Tip Amount</h3>
          <div className="grid grid-cols-3 gap-2">
            {[15, 18, 22].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={tip === (subTotal * p) / 100 ? "solid" : "bordered"}
                onClick={() => setTip((subTotal * p) / 100)}
              >
                {p}%
              </Button>
            ))}
            <Button
              size="sm"
              variant={!tip ? "solid" : "bordered"}
              onClick={() => setTip(0)}
              className="col-span-1"
            >
              No Tip
            </Button>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-default-500">Subtotal</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-default-500">Shipping</span>
            <span>{delivery ? `$${delivery.toFixed(2)}` : "Free"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-default-500">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {tip > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-default-500">Tip</span>
              <span>${tip.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-md font-semibold border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button className="w-full mt-4 bg-theme text-white">Place Order</Button>
      </div>
    </div>
  );
}
