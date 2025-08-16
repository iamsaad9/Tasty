import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  NumberInput,
  Switch,
  Card,
  CardBody,
  Chip,
  Divider,
  Autocomplete,
  AutocompleteItem,
  addToast,
} from "@heroui/react";
import { z } from "zod";
import { Plus, Trash2, Upload, AlertCircle } from "lucide-react";
import CustomModal from "@/components/Modals/Modal";
import { useCategories } from "@/app/hooks/useCategories";
import LoadingScreen from "@/components/Loading";
import { useDietaries } from "@/app/hooks/useDieties";
import { useVariations } from "@/app/hooks/useVariations";
import { useLocations } from "@/app/hooks/useLocation";

interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryArea {
  area: string;
  postalCode: string;
  fee: number;
}

interface Delivery {
  isDeliverable: boolean;
  estimatedTime: string;
  baseFee: number;
  freeAbove: number;
  minOrder: number;
  areas: DeliveryArea[];
}

interface MenuItem {
  _id?: string;
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
  itemVariation: ItemVariation[];
  delivery: Delivery;
}

interface MenuItemFormProps {
  menuItemDataProp: MenuItem | null;
  resetData: () => void;
}

function MenuItemForm({ menuItemDataProp, resetData }: MenuItemFormProps) {
  // Form state
  const [title, setTitle] = useState(menuItemDataProp?.title || "");
  const [category, setCategory] = useState(menuItemDataProp?.category || "");
  const [price, setPrice] = useState(menuItemDataProp?.price || 0);
  const [description, setDescription] = useState(
    menuItemDataProp?.description || ""
  );
  const [image, setImage] = useState(menuItemDataProp?.image || "");
  const [rating, setRating] = useState(menuItemDataProp?.rating || 0.0);
  const [popularity, setPopularity] = useState(
    menuItemDataProp?.popularity || 0
  );
  const [special, setSpecial] = useState(menuItemDataProp?.special || false);
  const [selectedDiets, setSelectedDiets] = useState<Set<string>>(
    new Set(menuItemDataProp?.diet?.map(String) || ["all"])
  );

  // Item Variations
  const [itemVariations, setItemVariations] = useState<ItemVariation[]>(
    menuItemDataProp?.itemVariation || []
  );

  // Delivery settings
  const [isDeliverable, setIsDeliverable] = useState(
    menuItemDataProp?.delivery?.isDeliverable ?? true
  );
  const [estimatedTime, setEstimatedTime] = useState(
    menuItemDataProp?.delivery?.estimatedTime || "20-35 mins"
  );
  const [baseFee, setBaseFee] = useState(
    menuItemDataProp?.delivery?.baseFee || 2.0
  );
  const [freeAbove, setFreeAbove] = useState(
    menuItemDataProp?.delivery?.freeAbove || 18
  );
  const [minOrder, setMinOrder] = useState(
    menuItemDataProp?.delivery?.minOrder || 7
  );
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(
    menuItemDataProp?.delivery?.areas || []
  );

  const [showModal, setShowModal] = useState({
    open: false,
    title: "",
    description: "",
    button: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deliveryAreasError, setDeliveryAreasError] = useState("");
  const [isSubmitting, setIsisSubmitting] = useState(false);

  // Hook data with fallback to empty arrays
  const { data: Categories } = useCategories();
  const { data: Dietaries } = useDietaries();
  const { data: Variations } = useVariations();
  const { data: locations } = useLocations();

  // Safe data with default empty arrays
  const safeCategories = Categories || [];
  const safeDietaries = Dietaries || [];
  const safeVariations = Variations || [];
  const safeLocations = locations || [];

  useEffect(() => {
    if (deliveryAreasError && deliveryAreas.length > 0) {
      setDeliveryAreasError("");
    }
  }, [deliveryAreas, deliveryAreasError]);

  const schema = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0.1, "Price must be greater than 0"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    image: z.string().url("Must be a valid URL"),
  });

  // Validate delivery areas
  const validateDeliveryAreas = (): boolean => {
    if (!isDeliverable) {
      setDeliveryAreasError("");
      return true;
    }

    if (deliveryAreas.length === 0) {
      setDeliveryAreasError(
        "At least one delivery area is required when delivery is enabled"
      );
      return false;
    }

    // Check if all delivery areas have required fields
    const hasIncompleteAreas = deliveryAreas.some(
      (area) => !area.area || !area.postalCode
    );

    if (hasIncompleteAreas) {
      setDeliveryAreasError("All delivery areas must have name");
      return false;
    }

    setDeliveryAreasError("");
    return true;
  };

  // Handle delivery toggle with automatic area addition
  const handleDeliveryToggle = (value: boolean) => {
    if (value && deliveryAreas.length === 0) {
      // Automatically add one delivery area when enabling delivery
      addDeliveryArea();
    }
    setIsDeliverable(value);

    if (!value) {
      // Clear error when delivery is disabled
      setDeliveryAreasError("");
    }
  };

  // Add new variation
  const addVariation = () => {
    setItemVariations([
      ...itemVariations,
      { type: "size", name: "", price_multiplier: 1.0 },
    ]);
  };

  // Remove variation
  const removeVariation = (index: number) => {
    setItemVariations(itemVariations.filter((_, i) => i !== index));
  };

  // Update variation
  const updateVariation = (
    index: number,
    field: keyof ItemVariation,
    value: string | number
  ) => {
    const updated = itemVariations.map((variation, i) =>
      i === index ? { ...variation, [field]: value } : variation
    );
    setItemVariations(updated);
  };

  // Add delivery area
  const addDeliveryArea = () => {
    setDeliveryAreas([
      ...deliveryAreas,
      { area: "", postalCode: "", fee: 2.0 },
    ]);
  };

  // Remove delivery area with validation
  const removeDeliveryArea = (index: number) => {
    const updatedAreas = deliveryAreas.filter((_, i) => i !== index);
    setDeliveryAreas(updatedAreas);

    // If this was the last area and delivery is enabled, show error
    if (updatedAreas.length === 0 && isDeliverable) {
      setDeliveryAreasError(
        "At least one delivery area is required when delivery is enabled"
      );
    }
  };

  const handleSubmit = async () => {
    // Validate basic fields

    const result = schema.safeParse({
      title,
      category,
      price,
      description,
      image,
      rating,
      popularity,
    });

    let hasErrors = false;

    if (!result.success) {
      const fieldErrors = result.error.format();
      const newErrors: { [key: string]: string } = {};
      Object.keys(fieldErrors).forEach((key) => {
        if (
          key !== "_errors" &&
          typeof fieldErrors[key as keyof typeof fieldErrors] === "object" &&
          fieldErrors[key as keyof typeof fieldErrors] !== null &&
          "_errors" in (fieldErrors[key as keyof typeof fieldErrors] as object)
        ) {
          newErrors[key] = (
            fieldErrors[key as keyof typeof fieldErrors] as {
              _errors: string[];
            }
          )._errors[0];
        }
      });
      setErrors(newErrors);
      hasErrors = true;
    } else {
      setErrors({});
    }

    // Validate delivery areas
    if (!validateDeliveryAreas()) {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const formData: MenuItem = {
      id: menuItemDataProp?.id || Math.floor(Math.random() * 10000),
      title,
      category,
      diet: Array.from(selectedDiets),
      price,
      description,
      image,
      popularity,
      rating,
      special,
      itemVariation: itemVariations,
      delivery: {
        isDeliverable,
        estimatedTime,
        baseFee,
        freeAbove,
        minOrder,
        areas: deliveryAreas,
      },
    };

    const isEditing = !!menuItemDataProp;

    try {
      setIsisSubmitting(true);
      const res = await fetch("/api/menuItems", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...(isEditing ? { _id: menuItemDataProp._id } : {}), // send _id if updating
        }),
      });

      if (!res.ok) {
        addToast({
          title: "Failed",
          description: `Failed to ${isEditing ? "update" : "add"} menu item`,
          color: "danger",
        });
        throw new Error(`Failed to submit: ${res.statusText}`);
      }

      addToast({
        title: "Success",
        description: `Menu Item ${
          isEditing ? "updated" : "added"
        } successfully`,
        color: "success",
      });
      setIsisSubmitting(false);
      handleReset();
    } catch (error) {
      addToast({
        title: "Error",
        description: `Error ${isEditing ? "updating" : "adding"} menu item`,
        color: "danger",
      });
      setIsisSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setCategory("");
    setPrice(0);
    setDescription("");
    setImage("");
    setRating(4.0);
    setPopularity(50);
    setSpecial(false);
    setSelectedDiets(new Set(["all"]));
    setItemVariations([]);
    setIsDeliverable(true);
    setEstimatedTime("20-35 mins");
    setBaseFee(2.0);
    setFreeAbove(18);
    setMinOrder(7);
    setDeliveryAreas([]);
    setErrors({});
    setDeliveryAreasError("");
    resetData();
    setShowModal({
      open: false,
      title: "",
      description: "",
      button: "",
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-theme/70 to-theme p-6">
          <h1 className="text-2xl font-bold text-white">
            {menuItemDataProp ? "Edit Menu Item" : "Add New Menu Item"}
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardBody className="space-y-4">
              <h3 className="text-lg font-semibold text-accent">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Item Title"
                  className="text-accent"
                  placeholder="e.g., Grilled Chicken Caesar Salad"
                  value={title}
                  onValueChange={setTitle}
                  errorMessage={errors.title}
                  isInvalid={!!errors.title}
                  isRequired
                />

                <Select
                  className="text-accent"
                  classNames={{
                    listboxWrapper: "text-accent",
                  }}
                  label="Category"
                  placeholder="Select category"
                  selectedKeys={category ? [category] : []}
                  onSelectionChange={(keys) =>
                    setCategory(Array.from(keys)[0] as string)
                  }
                  isRequired
                >
                  {safeCategories.map((cat) => (
                    <SelectItem key={cat.id}>{cat.name}</SelectItem>
                  ))}
                </Select>

                <NumberInput
                  label="Price ($)"
                  placeholder="0.00"
                  value={price}
                  className="text-accent"
                  onValueChange={setPrice}
                  errorMessage={errors.price}
                  isInvalid={!!errors.price}
                  startContent="$"
                  formatOptions={{ minimumFractionDigits: 2 }}
                  isRequired
                />

                <Input
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  className="text-accent"
                  value={image}
                  onValueChange={setImage}
                  errorMessage={errors.image}
                  isInvalid={!!errors.image}
                  startContent={<Upload size={16} />}
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Describe your menu item..."
                value={description}
                onValueChange={setDescription}
                errorMessage={errors.description}
                isInvalid={!!errors.description}
                minRows={3}
                isRequired
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 py-3">
                  <Switch
                    size="sm"
                    isSelected={special}
                    onValueChange={setSpecial}
                    className="text-accent"
                  />
                  <span className="text-sm text-accent">Special Item</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Dietary Options */}
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-accent mb-4">
                Dietary Options
              </h3>
              <div className="flex flex-wrap gap-2">
                {safeDietaries.map((diet) => (
                  <Chip
                    key={diet.id}
                    variant={
                      selectedDiets.has(String(diet.id)) ? "solid" : "bordered"
                    }
                    color={
                      selectedDiets.has(String(diet.id))
                        ? "primary"
                        : "secondary"
                    }
                    className="cursor-pointer"
                    onClick={() => {
                      const newSelection = new Set(selectedDiets);
                      const dietIdString = String(diet.id);
                      if (newSelection.has(dietIdString)) {
                        newSelection.delete(dietIdString);
                      } else {
                        newSelection.add(dietIdString);
                      }
                      setSelectedDiets(newSelection);
                    }}
                  >
                    {diet.label}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Item Variations */}
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-accent">
                  Item Variations
                </h3>
                <Button
                  size="sm"
                  className="bg-theme"
                  startContent={<Plus size={16} />}
                  onPress={addVariation}
                >
                  Add Variation
                </Button>
              </div>

              <div className="space-y-3">
                {itemVariations.map((variation, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Select
                      label="Type"
                      classNames={{
                        listboxWrapper: "text-accent",
                      }}
                      placeholder="Select type"
                      selectedKeys={[variation.type]}
                      onSelectionChange={(keys) =>
                        updateVariation(
                          index,
                          "type",
                          Array.from(keys)[0] as string
                        )
                      }
                      className="flex-1 text-accent"
                    >
                      {safeVariations.map((type) => (
                        <SelectItem key={type.id}>{type.label}</SelectItem>
                      ))}
                    </Select>

                    <Input
                      label="Name"
                      placeholder="e.g., Large, 4 Pieces"
                      value={variation.name}
                      onValueChange={(val) =>
                        updateVariation(index, "name", val)
                      }
                      className="flex-1 text-accent"
                    />

                    <NumberInput
                      label="Price Multiplier"
                      value={variation.price_multiplier}
                      onValueChange={(val) =>
                        updateVariation(index, "price_multiplier", val)
                      }
                      step={0.1}
                      minValue={0.1}
                      className="flex-1 text-accent"
                    />

                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      isIconOnly
                      onPress={() => removeVariation(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Delivery Settings */}
          <Card>
            <CardBody>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-accent">
                  Delivery Settings
                </h3>
                <Switch
                  isSelected={isDeliverable}
                  onValueChange={handleDeliveryToggle}
                  color="success"
                />
              </div>

              {isDeliverable && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                      label="Estimated Time"
                      placeholder="20-35 mins"
                      value={estimatedTime}
                      onValueChange={setEstimatedTime}
                      className="text-accent"
                    />

                    <NumberInput
                      label="Base Fee ($)"
                      value={baseFee}
                      onValueChange={setBaseFee}
                      step={0.5}
                      minValue={0}
                      startContent="$"
                      className="text-accent"
                    />

                    <NumberInput
                      label="Free Above ($)"
                      value={freeAbove}
                      onValueChange={setFreeAbove}
                      minValue={0}
                      className="text-accent"
                      startContent="$"
                    />

                    <NumberInput
                      label="Min Order ($)"
                      value={minOrder}
                      onValueChange={setMinOrder}
                      minValue={0}
                      className="text-accent"
                      startContent="$"
                    />
                  </div>

                  <Divider />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-accent">
                      <h4 className="font-medium">
                        Delivery Areas <span className="text-red-500">*</span>
                      </h4>
                      <Button
                        size="sm"
                        className="bg-theme"
                        startContent={<Plus size={16} />}
                        onPress={addDeliveryArea}
                      >
                        Add Area
                      </Button>
                    </div>

                    {/* Error message for delivery areas */}
                    {deliveryAreasError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>{deliveryAreasError}</span>
                      </div>
                    )}

                    {/* Show message when no areas exist */}
                    {deliveryAreas.length === 0 && !deliveryAreasError && (
                      <div className="text-orange-600 text-sm bg-orange-50 p-3 rounded-lg text-center border border-orange-200">
                        No delivery areas added yet. Click "Add Area" to add
                        your first delivery area.
                      </div>
                    )}

                    {deliveryAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Autocomplete
                          className="flex-1 text-accent"
                          classNames={{
                            listboxWrapper: "text-accent",
                          }}
                          label="Area Name"
                          placeholder="Select Area"
                          // ✅ Set the value from existing data
                          selectedKey={area.area || ""}
                          onSelectionChange={(val) => {
                            const areaName = (val as string)?.trim() || "";
                            const selectedLocation = safeLocations?.find(
                              (loc) => loc.area === areaName
                            );

                            // Update both area and postalCode at once
                            setDeliveryAreas((prev) => {
                              const updated = prev.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      area: areaName,
                                      postalCode: selectedLocation
                                        ? selectedLocation.postalCode
                                        : "",
                                    }
                                  : item
                              );
                              console.log("Updated delivery areas:", updated);
                              return updated;
                            });
                          }}
                        >
                          {safeLocations.map((item) => (
                            <AutocompleteItem key={item.area}>
                              {item.area}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>

                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          isIconOnly
                          onPress={() => removeDeliveryArea(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            {menuItemDataProp && (
              <Button
                color="danger"
                variant="light"
                onPress={() =>
                  setShowModal({
                    open: true,
                    title: "Reset Editing?",
                    description:
                      "Are you sure you want to Reset editing? All changes will be lost.",
                    button: "Reset",
                  })
                }
              >
                Reset
              </Button>
            )}

            <Button
              onPress={handleSubmit}
              color="warning"
              size="lg"
              isDisabled={isSubmitting || Object.keys(errors).length > 0}
              isLoading={isSubmitting}
              className="px-8 font-medium bg-theme text-white hover:bg-amber-700"
            >
              {menuItemDataProp ? "Update Item" : "Confirm Item"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showModal && (
        <CustomModal
          onClose={() =>
            setShowModal({
              open: false,
              title: "",
              description: "",
              button: "",
            })
          }
          isOpen={showModal.open}
          title={showModal.title}
          description={showModal.description}
        >
          <Button color="danger" variant="flat" onPress={handleReset}>
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
              })
            }
          >
            Close
          </Button>
        </CustomModal>
      )}
    </div>
  );
}

export default MenuItemForm;
