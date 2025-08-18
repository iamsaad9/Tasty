"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Input,
  Dropdown,
  Select,
  SelectItem,
  Textarea,
  RadioGroup,
  Radio,
  addToast,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { useCartStore } from "@/lib/store/cartStore";
import { useState } from "react";
import { useLocationStore } from "@/lib/store/locationStore";
import { validateAddressWithMaps } from "@/lib/validateAddressWithMaps";
import PageBanner from "@/components/PageBanner";
import { useSession } from "next-auth/react";
import {
  CheckCircle,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Download,
  Home,
  Package,
  MessageSquare,
  Utensils,
  AlertCircle,
  Clock,
  CreditCardIcon,
  User,
} from "lucide-react";

// Updated CartItem interface to match the new format
interface CartItem {
  itemId: number | undefined;
  itemName: string | undefined;
  itemImage: string | undefined;
  itemPrice: number;
  itemBasePrice: number;
  itemQuantity: number;
  itemVariations: { [key: string]: string }; // Updated to object format
  itemInstructions: string;
}

// Types
interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  orderNotes: string;
}

type FormField = keyof FormData;

interface FormErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

interface LocationValidationResult {
  isValid: boolean;
  message: string;
  detectedLocation?: string;
}

interface StripeCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  total: number;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

// Helper function to format variations display
const formatVariations = (
  variations: { [key: string]: string } | undefined
) => {
  if (!variations || Object.keys(variations).length === 0) return "";

  return Object.entries(variations)
    .map(
      ([type, value]) =>
        `${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`
    )
    .join(", ");
};

// Stripe Payment Modal Component
const StripePaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  total,
  isProcessing,
  setIsProcessing,
}: StripePaymentModalProps) => {
  const [cardData, setCardData] = useState<StripeCardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [cardErrors, setCardErrors] = useState<{ [key: string]: string }>({});

  const validateCard = () => {
    const errors: { [key: string]: string } = {};

    // Card number validation (basic)
    if (!cardData.cardNumber.replace(/\s/g, "")) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{13,19}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Invalid card number";
    }

    // Expiry date validation
    if (!cardData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
      errors.expiryDate = "Invalid format (MM/YY)";
    }

    // CVV validation
    if (!cardData.cvv) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = "Invalid CVV";
    }

    // Cardholder name validation
    if (!cardData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces every 4 digits
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setCardData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry date as MM/YY
    let formatted = value.replace(/\D/g, "");
    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + "/" + formatted.substring(2, 4);
    }
    setCardData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handlePayment = async () => {
    if (!validateCard()) return;

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate successful payment
      onSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isDismissable={!isProcessing}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Secure Payment - ${total.toFixed(2)}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              maxLength={19}
              isInvalid={!!cardErrors.cardNumber}
              errorMessage={cardErrors.cardNumber}
              startContent={<CreditCard className="w-4 h-4 text-gray-400" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={(e) => handleExpiryChange(e.target.value)}
                maxLength={5}
                isInvalid={!!cardErrors.expiryDate}
                errorMessage={cardErrors.expiryDate}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData((prev) => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, ""),
                  }))
                }
                maxLength={4}
                type="password"
                isInvalid={!!cardErrors.cvv}
                errorMessage={cardErrors.cvv}
              />
            </div>

            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardData.cardholderName}
              onChange={(e) =>
                setCardData((prev) => ({
                  ...prev,
                  cardholderName: e.target.value,
                }))
              }
              isInvalid={!!cardErrors.cardholderName}
              errorMessage={cardErrors.cardholderName}
            />

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-gray-600">
                Your payment information is encrypted and secure. We use Stripe
                for processing.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isProcessing}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handlePayment}
            isDisabled={isProcessing}
            startContent={isProcessing ? <Spinner size="sm" /> : null}
          >
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface OrderConfirmationData {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

// Order Details Modal Component

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  formData: FormData;
  deliveryMode: string;
  selectedLocation: string;
  paymentMethod: "Card" | "Cash";
  tip: number;
  subTotal: number;
  tax: number;
  delivery: number;
  total: number;
  isProcessing?: boolean;
}

// Add this new component before the main CheckoutPage component
const OrderDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  formData,
  deliveryMode,
  selectedLocation,
  paymentMethod,
  tip,
  subTotal,
  tax,
  delivery,
  total,
  isProcessing = false,
}: OrderDetailsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isDismissable={!isProcessing}
      scrollBehavior="inside"
      className="text-accent"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Review Your Order
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>
                      {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{formData.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{formData.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Payment:</span>
                    <p>
                      {paymentMethod === "Cash"
                        ? `Cash on ${
                            deliveryMode === "pickup" ? "Pickup" : "Delivery"
                          }`
                        : "Credit Card"}
                    </p>
                  </div>
                </div>

                {deliveryMode === "delivery" && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium">Delivery Address:</span>
                    <p className="text-sm">{formData.address}</p>
                    <p className="text-sm text-blue-600">
                      {selectedLocation}, Karachi
                    </p>
                  </div>
                )}

                {deliveryMode === "pickup" && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium">Pickup Location:</span>
                    <p className="text-sm text-blue-600">{selectedLocation}</p>
                  </div>
                )}

                {formData.orderNotes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium">Order Notes:</span>
                    <p className="text-sm">{formData.orderNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                Order Items ({items.length})
              </h3>
              <div className="border border-gray-200 rounded-lg divide-y max-h-64 overflow-y-auto">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start p-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.itemImage}
                        alt={item.itemName || "Item image"}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.itemName}</h4>
                        {item.itemVariations &&
                          Object.keys(item.itemVariations).length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatVariations(item.itemVariations)}
                            </p>
                          )}
                        {item.itemInstructions && (
                          <p className="text-xs text-gray-500 mt-1">
                            Note: {item.itemInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm flex-shrink-0 ml-4">
                      <p className="font-medium">
                        {item.itemQuantity} × $
                        {(item.itemBasePrice ?? 0).toFixed(2)}
                      </p>
                      <p className="text-gray-500">
                        $
                        {(
                          (item.itemBasePrice ?? 0) * item.itemQuantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Order Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    {deliveryMode === "delivery" ? "Delivery Fee" : "Pickup"}
                  </span>
                  <span>
                    {delivery > 0 ? `$${delivery.toFixed(2)}` : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tip</span>
                    <span>${tip.toFixed(2)}</span>
                  </div>
                )}
                <Divider />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">
                    Before you confirm:
                  </p>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Please verify all information is correct</li>
                    <li>
                      •{" "}
                      {deliveryMode === "delivery"
                        ? "Estimated delivery time: 30-45 minutes"
                        : "Your order will be ready for pickup in 15-20 minutes"}
                    </li>
                    {paymentMethod === "Cash" && (
                      <li>• Please have exact change ready</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isProcessing}>
            Back to Edit
          </Button>
          <Button
            color="primary"
            onPress={onConfirm}
            isDisabled={isProcessing}
            startContent={
              isProcessing ? (
                <Spinner size="sm" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )
            }
            className="bg-theme"
          >
            {isProcessing
              ? "Placing Order..."
              : `Confirm Order - $${total.toFixed(2)}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Order Confirmation Modal Component
const OrderConfirmationModal = ({
  isOpen,
  onClose,
  orderData,
}: OrderConfirmationData) => {
  const generateOrderId = () => {
    return "#" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const orderId = generateOrderId();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isDismissable={false}
      className="text-accent"
    >
      <ModalContent>
        <ModalHeader className="text-center">
          <div className="w-full text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">
              Order Placed Successfully!
            </h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg text-accent">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="font-medium">Order ID:</span>
                  <span className="font-bold text-theme">{orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">Payment:</span>
                  <span>
                    {orderData?.paymentMethod === "Cash"
                      ? "Cash on Delivery"
                      : "Credit Card"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">
                    ${orderData?.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {orderData?.deliveryMode === "delivery" && (
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">📍 Delivery Address:</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {orderData?.customer?.firstName}{" "}
                    {orderData?.customer?.lastName}
                  </p>
                  <p>{orderData?.customer?.address}</p>
                  <p>Karachi, Pakistan</p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{orderData?.customer?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{orderData?.customer?.email}</span>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                You'll receive a confirmation SMS and email shortly.
                {orderData?.paymentMethod === "Cash" && (
                  <span className="block mt-2 font-medium">
                    Please keep the exact amount ready for delivery.
                  </span>
                )}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="light"
              startContent={<Package className="w-4 h-4" />}
            >
              Track Order
            </Button>
            <Button
              variant="light"
              startContent={<Download className="w-4 h-4" />}
            >
              Download Invoice
            </Button>
            <Button
              color="primary"
              onPress={onClose}
              startContent={<Home className="w-4 h-4" />}
            >
              Continue Shopping
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();

  // Add selected location state - you might get this from a location store/context
  const { selectedLocation, deliveryMode } = useLocationStore();

  // Modals
  const {
    isOpen: isPaymentOpen,
    onOpen: onPaymentOpen,
    onClose: onPaymentClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"Card" | "Cash">("Card");
  const [tip, setTip] = useState<number>(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [isPaymentProcessing, setIsPaymentProcessing] =
    useState<boolean>(false);
  const [orderConfirmationData, setOrderConfirmationData] = useState<any>(null);

  // Form validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isValidatingAddress, setIsValidatingAddress] =
    useState<boolean>(false);
  const {
    isOpen: isOrderDetailsOpen,
    onOpen: onOrderDetailsOpen,
    onClose: onOrderDetailsClose,
  } = useDisclosure();

  // Calculate totals using useMemo for better performance
  const { subTotal, tax, delivery, total } = useMemo(() => {
    const subtotalCalc = items.reduce((acc, item) => {
      const price = item.itemBasePrice ?? 0;
      const qty = item.itemQuantity ?? 1;
      return acc + price * qty;
    }, 0);

    const taxCalc = subtotalCalc * 0.08;
    const deliveryCalc = deliveryMode === "delivery" ? 2.99 : 0;
    const totalCalc = subtotalCalc + taxCalc + deliveryCalc + tip;

    return {
      subTotal: subtotalCalc,
      tax: taxCalc,
      delivery: deliveryCalc,
      total: totalCalc,
    };
  }, [items, deliveryMode, tip]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    } else {
      console.log("checkout items", items);
    }
  }, [items, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [session]);

  // Form validation
  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (deliveryMode === "delivery") {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required for delivery";
      } else {
        // Validate address with Google Maps
        setIsValidatingAddress(true);
        try {
          const locationValidation = await validateAddressWithMaps(
            formData.address,
            selectedLocation
          );

          if (!locationValidation.isValid) {
            newErrors.address =
              locationValidation.message ?? "Invalid address.";
          }
        } catch (error) {
          console.error("Address validation failed:", error);
          // Don't block submission if validation fails
        } finally {
          setIsValidatingAddress(false);
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Handle input blur for validation feedback
  const handleBlur = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate specific field on blur
    const newErrors: FormErrors = { ...errors };

    if (
      field === "email" &&
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }
    if (
      field === "phone" &&
      formData.phone &&
      !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    onPaymentClose();
    handleOrderCompletion();
  };

  // Handle order completion
  const handleOrderCompletion = () => {
    const orderData = {
      customer: formData,
      items,
      pricing: { subTotal, tax, delivery, tip, total },
      deliveryMode,
      paymentMethod,
      selectedLocation,
      orderDate: new Date().toISOString(),
      total,
    };

    setOrderConfirmationData(orderData);

    addToast({
      title: "Order Placed Successfully!",
      description: `Thank you ${
        formData.firstName
      }! Your order total is $${total.toFixed(2)}.`,
      color: "success",
    });

    onConfirmationOpen();
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      addToast({
        title: "Form Incomplete",
        description: "Please fill in all required fields correctly.",
        color: "danger",
      });
      return;
    }

    // Open the order details modal instead of directly placing the order
    onOrderDetailsOpen();
  };

  const handleConfirmOrder = async () => {
    onOrderDetailsClose();

    if (paymentMethod === "Card") {
      onPaymentOpen();
    } else {
      // Cash on Delivery
      setIsOrderPlaced(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        handleOrderCompletion();
      } catch (error) {
        addToast({
          title: "Order Failed",
          description: "Something went wrong. Please try again.",
          color: "danger",
        });
      } finally {
        setIsOrderPlaced(false);
      }
    }
  };

  // Handle confirmation modal close
  const handleConfirmationClose = () => {
    onConfirmationClose();
    clearCart();
    router.push("/");
  };

  return (
    <>
      <PageBanner
        title="Checkout"
        image="/images/PageBanners/reservationPage.jpg"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12 text-accent mt-5">
        {/* Contact + Shipping */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Additional information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <Input
                type="email"
                label="Email Address"
                placeholder="your.email@example.com"
                value={formData.email || session?.user?.email || ""}
                disabled={!!session?.user?.email}
                onValueChange={(value) => handleInputChange("email", value)}
                onBlur={() => handleBlur("email")}
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                isRequired
                startContent={<Mail className="h-4 w-4 text-default-400" />}
                classNames={{
                  label: "text-accent font-medium",
                  input: "text-accent",
                }}
              />

              <Input
                type="tel"
                label="Phone Number"
                placeholder="03XX-XXXXXXX"
                value={formData.phone}
                onValueChange={(value) => handleInputChange("phone", value)}
                onBlur={() => handleBlur("phone")}
                errorMessage={errors.phone}
                isInvalid={!!errors.phone}
                isRequired
                startContent={<Phone className="h-4 w-4 text-default-400" />}
                classNames={{
                  label: "text-accent font-medium",
                  input: "text-accent",
                }}
              />

              {/*First Name */}
              <Input
                label="First name"
                placeholder="Enter your First name"
                value={formData.firstName}
                onValueChange={(value) => handleInputChange("firstName", value)}
                errorMessage={errors.firstName}
                isInvalid={!!errors.firstName}
                isRequired
                startContent={<User className="h-4 w-4 text-default-400" />}
                classNames={{
                  label: "text-accent font-medium",
                  input: "text-accent",
                }}
              />

              {/*lirst Name */}
              <Input
                label="First name"
                placeholder="Enter your Last name"
                value={formData.lastName}
                onValueChange={(value) => handleInputChange("lastName", value)}
                errorMessage={errors.lastName}
                isInvalid={!!errors.lastName}
                isRequired
                startContent={<User className="h-4 w-4 text-default-400" />}
                classNames={{
                  label: "text-accent font-medium",
                  input: "text-accent",
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {deliveryMode === "delivery" ? (
                <Truck className="h-5 w-5 mr-2" />
              ) : (
                <CreditCard className="h-5 w-5 mr-2" />
              )}
              Billing & Shipping
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {deliveryMode === "delivery" && (
                <>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-800">
                        Delivering to:
                      </span>
                      <span className="text-sm text-blue-600 font-semibold">
                        {selectedLocation}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      We'll verify your address belongs to this area
                    </p>
                  </div>

                  <div className="relative">
                    <Input
                      label="House number and street name"
                      size="sm"
                      variant="flat"
                      value={formData.address}
                      onValueChange={(value) =>
                        handleInputChange("address", value)
                      }
                      isInvalid={!!errors.address}
                      errorMessage={errors.address}
                      endContent={
                        isValidatingAddress ? (
                          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                        ) : null
                      }
                      isRequired
                    />
                    {isValidatingAddress && (
                      <p className="text-xs text-blue-600 mt-1">
                        Verifying address location...
                      </p>
                    )}
                  </div>
                </>
              )}
              <Select
                label="Payment Method"
                variant="flat"
                selectedKeys={[paymentMethod]}
                onSelectionChange={(keys) =>
                  setPaymentMethod(Array.from(keys)[0] as "Card" | "Cash")
                }
                className="text-accent"
                classNames={{
                  listboxWrapper: "text-accent",
                }}
              >
                <SelectItem key="Card" className="text-accent">
                  Card
                </SelectItem>
                <SelectItem key="Cash" className="text-accent">
                  {`Cash on ${
                    deliveryMode === "pickup" ? "Pickup" : "Delivery"
                  }`}
                </SelectItem>
              </Select>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Additional information
            </h2>
            <Textarea
              label="Notes about your order, e.g. special notes for delivery."
              variant="flat"
              value={formData.orderNotes}
              onValueChange={(value) => handleInputChange("orderNotes", value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-default-200">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="mb-4">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">
                  Shipping:
                </span>
                <span className="text-sm text-blue-600 font-semibold">
                  {deliveryMode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-default-200 rounded-md divide-y">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.itemImage}
                    alt={item.itemName || "Item image"}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.itemName}</h3>
                    {/* Updated variations display */}
                    {item.itemVariations &&
                      Object.keys(item.itemVariations).length > 0 && (
                        <p className="text-sm text-default-500">
                          {formatVariations(item.itemVariations)}
                        </p>
                      )}
                    {item.itemInstructions && (
                      <p className="text-sm text-default-500">
                        {item.itemInstructions}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {item.itemQuantity} x ${" "}
                    {(item.itemBasePrice ?? 0).toFixed(2)}
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
                  onPress={() => setTip((subTotal * p) / 100)}
                  className="text-accent text-base"
                >
                  {p}%
                </Button>
              ))}
              <Button
                variant={!tip ? "solid" : "bordered"}
                onPress={() => setTip(0)}
                className="text-accent col-span-1"
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
              <span>{delivery ? `${delivery.toFixed(2)}` : "Free"}</span>
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

          <Button
            className="w-full mt-4 bg-theme text-white"
            onPress={handlePlaceOrder}
            isDisabled={
              isOrderPlaced || items.length === 0 || isValidatingAddress
            }
            startContent={
              isOrderPlaced ? <Spinner size="sm" color="white" /> : null
            }
          >
            {isOrderPlaced
              ? "Placing Order..."
              : isValidatingAddress
              ? "Validating Address..."
              : "Review Order"}{" "}
            {/* Changed from "Place Order" to "Review Order" */}
          </Button>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      <StripePaymentModal
        isOpen={isPaymentOpen}
        onClose={onPaymentClose}
        onSuccess={handlePaymentSuccess}
        total={total}
        isProcessing={isPaymentProcessing}
        setIsProcessing={setIsPaymentProcessing}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderDetailsOpen}
        onClose={onOrderDetailsClose}
        onConfirm={handleConfirmOrder}
        items={items}
        formData={formData}
        deliveryMode={deliveryMode}
        selectedLocation={selectedLocation}
        paymentMethod={paymentMethod}
        tip={tip}
        subTotal={subTotal}
        tax={tax}
        delivery={delivery}
        total={total}
        isProcessing={isOrderPlaced}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => {
          handleConfirmationClose;
          clearCart();
        }}
        orderData={orderConfirmationData}
      />
    </>
  );
}
