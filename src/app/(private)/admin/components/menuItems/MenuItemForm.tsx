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
} from "@heroui/react";
import { z } from "zod";
import { Plus, Trash2, Upload } from "lucide-react";

// Types for your data
interface CategoryType {
  id: number;
  name: string;
  active: boolean;
  icon: React.ReactNode;
}

interface DietaryOption {
  id: string;
  label: string;
}

interface VariationType {
  id: string;
  label: string;
}

interface ItemVariation {
  type: string;
  name: string;
  price_multiplier: number;
}

interface DeliveryArea {
  name: string;
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
    new Set(menuItemDataProp?.diet || ["all"])
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

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [dietary, setDietary] = useState<DietaryOption[]>([]);
  const [variations, setVariations] = useState<VariationType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dietRes, varRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/dietaryPreference"),
          fetch("/api/variationType"),
        ]);

        if (!catRes.ok || !dietRes.ok || !varRes.ok) {
          throw new Error("One or more requests failed");
        }

        const [catData, dietData, varData] = await Promise.all([
          catRes.json(),
          dietRes.json(),
          varRes.json(),
        ]);

        setCategories(catData);
        setDietary(dietData);
        setVariations(varData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("MenuItemForm Data:", categories);

  // Validation schema
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
      { name: "", postalCode: "", fee: 2.0 },
    ]);
  };

  // Remove delivery area
  const removeDeliveryArea = (index: number) => {
    setDeliveryAreas(deliveryAreas.filter((_, i) => i !== index));
  };

  // Update delivery area
  const updateDeliveryArea = (
    index: number,
    field: keyof DeliveryArea,
    value: string | number
  ) => {
    const updated = deliveryAreas.map((area, i) =>
      i === index ? { ...area, [field]: value } : area
    );
    setDeliveryAreas(updated);
  };

  const handleSubmit = () => {
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

    console.log("✅ Submitted Menu Item Data:", formData);
    // Here: send to API or state
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
    resetData();
    setShowModal(false);
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
                  {categories.map((cat) => (
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
                {dietary.map((diet) => (
                  <Chip
                    key={diet.id}
                    variant={selectedDiets.has(diet.id) ? "solid" : "bordered"}
                    color={selectedDiets.has(diet.id) ? "primary" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newSelection = new Set(selectedDiets);
                      if (newSelection.has(diet.id)) {
                        newSelection.delete(diet.id);
                      } else {
                        newSelection.add(diet.id);
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
                  //   color="primary"
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
                      {variations.map((type) => (
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
                  onValueChange={setIsDeliverable}
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
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Delivery Areas</h4>
                      <Button
                        size="sm"
                        // color="primary"
                        className="bg-theme"
                        startContent={<Plus size={16} />}
                        onPress={addDeliveryArea}
                      >
                        Add Area
                      </Button>
                    </div>

                    {deliveryAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Input
                          label="Area Name"
                          placeholder="Garden East"
                          value={area.name}
                          onValueChange={(val) =>
                            updateDeliveryArea(index, "name", val)
                          }
                          className="flex-1 text-accent"
                        />

                        <Input
                          label="Postal Code"
                          placeholder="74400"
                          value={area.postalCode}
                          onValueChange={(val) =>
                            updateDeliveryArea(index, "postalCode", val)
                          }
                          className="flex-1 text-accent"
                        />

                        <NumberInput
                          label="Fee ($)"
                          value={area.fee}
                          onValueChange={(val) =>
                            updateDeliveryArea(index, "fee", val)
                          }
                          step={0.5}
                          minValue={0}
                          startContent="$"
                          className="flex-1 text-accent"
                        />

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
                onPress={() => setShowModal(true)}
              >
                Reset
              </Button>
            )}
            <Button
              onPress={handleSubmit}
              color="primary"
              size="lg"
              className="px-8"
            >
              {menuItemDataProp ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-md mx-4">
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Cancel Editing?</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Are you sure you want to cancel editing? All changes will be
                    lost.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => setShowModal(false)}
                  >
                    Continue Editing
                  </Button>
                  <Button color="danger" onPress={handleReset}>
                    Reset All
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MenuItemForm;
