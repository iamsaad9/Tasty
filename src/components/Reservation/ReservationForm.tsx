import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  User,
  MessageSquare,
  Utensils,
} from "lucide-react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Reservation } from "@/types";
import { useOccasionType } from "@/app/hooks/useOccasionType";
import LoadingScreen from "../Loading";
import { useSession } from "next-auth/react";

interface ReservationDataProps {
  reservationDataProp?: Reservation | null;
  resetData?: () => void;
  onSubmit?: (data: Reservation) => void;
}

function ReservationForm({
  reservationDataProp = null,
  resetData,
  onSubmit,
}: ReservationDataProps) {
  const {
    isOpen: isResetModalOpen,
    onOpen: onResetModalOpen,
    onClose: onResetModalClose,
  } = useDisclosure();

  const guestOptions = Array.from({ length: 20 }, (_, i) => ({
    key: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? "Guest" : "Guests"}`,
  }));

  // Form state
  const [formData, setFormData] = useState({
    name: reservationDataProp?.name || "",
    email: reservationDataProp?.email || "",
    phone: reservationDataProp?.phone || "",
    date: reservationDataProp?.date
      ? (() => {
          const d = new Date(reservationDataProp.date);
          return new CalendarDate(
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
          );
        })()
      : null,
    time: reservationDataProp?.time || "",
    guests: reservationDataProp?.guests?.toString() || "2",
    occasion: reservationDataProp?.occasion || 0,
    requests: reservationDataProp?.requests || "",
  });
  const { data: session } = useSession();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { data: occasionTypes } = useOccasionType();
  // Get today's date
  const minDate = today(getLocalTimeZone()).add({ days: 1 });
  const maxDate = today(getLocalTimeZone()).add({ days: 30 });

  useEffect(() => {
    if (reservationDataProp) {
      console.log("reservationDataProp", reservationDataProp);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [session]);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = new Date(
          `2000-01-01T${timeString}`
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        slots.push({ key: timeString, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Validation functions
  const validateField = (
    name: string,
    value: string | CalendarDate | Number | null
  ) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value || typeof value !== "string" || value.trim().length < 2) {
          newErrors.name =
            "Please enter your full name (at least 2 characters)";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newErrors.name = "Name should only contain letters and spaces";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          !value ||
          typeof value !== "string" ||
          !emailRegex.test(value.trim())
        ) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        const phoneRegex = /^(\+92|0)?3[0-9]{2}[-\s]?[0-9]{7}$/;
        if (
          !value ||
          typeof value !== "string" ||
          !phoneRegex.test(value.trim())
        ) {
          newErrors.phone =
            "Please enter a valid Pakistani phone number (e.g., 03XX-XXXXXXX)";
        } else {
          delete newErrors.phone;
        }
        break;

      case "date":
        if (!value) {
          newErrors.date = "Please select a reservation date";
        } else {
          delete newErrors.date;
        }
        break;

      case "time":
        if (!value || typeof value !== "string") {
          newErrors.time = "Please select a reservation time";
        } else {
          delete newErrors.time;
        }
        break;

      case "guests":
        const guestCount = typeof value === "string" ? parseInt(value) : 0;
        if (!guestCount || guestCount < 1 || guestCount > 20) {
          newErrors.guests = "Please select between 1 and 20 guests";
        } else {
          delete newErrors.guests;
        }
        break;

      case "occasion":
        if (!value || typeof value === "string") {
          newErrors.occasion = "Please select an occasion type";
        } else {
          delete newErrors.occasion;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    name: string,
    value: string | CalendarDate | null | Number
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateAllFields = () => {
    const fields = [
      "name",
      "email",
      "phone",
      "date",
      "time",
      "guests",
      "occasion",
    ];
    let isValid = true;

    fields.forEach((field) => {
      if (
        !validateField(field, formData[field as keyof typeof formData] as any)
      ) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return;
    }
    console.log("Submit clicked");

    setIsSubmitting(true);

    const reservation: Reservation = {
      id: reservationDataProp?.id || Math.floor(Math.random() * 10000),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date ? formData.date.toString() : "",
      time: formData.time,
      guests: parseInt(formData.guests),
      occasion: formData.occasion,
      requests: formData.requests,
      status: "pending",
    };
    console.log("reservation", reservation);
    const isEditing = !!reservationDataProp;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/reservations", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reservation,
          ...(isEditing ? { _id: reservationDataProp.id } : {}), // send _id if updating
        }),
      });

      if (!res.ok) {
        addToast({
          title: "Failed",
          description: `Failed to ${isEditing ? "update" : "add"} reservation`,
          color: "danger",
        });
        throw new Error(`Failed to submit: ${res.statusText}`);
      }

      addToast({
        title: "Success",
        description: `Reservation ${
          isEditing ? "updated" : "added"
        } successfully`,
        color: "success",
      });
      setIsSubmitting(false);
      handleReset();
    } catch (error) {
      addToast({
        title: "Error",
        description: `Error ${isEditing ? "updating" : "adding"} reservation`,
        color: "danger",
      });
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: null,
      time: "",
      guests: "2",
      occasion: 0,
      requests: "",
    });
    setErrors({});
    setShowSuccessMessage(false);
    onResetModalClose();
    if (resetData) resetData();
  };

  if (!occasionTypes) {
    return <LoadingScreen showLoading={true} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardBody>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Reservation {reservationDataProp ? "Updated" : "Confirmed"}!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your reservation has been successfully{" "}
                  {reservationDataProp ? "updated" : "submitted"}. We'll send
                  you a confirmation email shortly.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card className="shadow-large ">
        <CardBody className="p-8">
          {/* Header */}
          <div className="text-center mb-8 ">
            <div className="flex justify-center items-center mb-4">
              <Utensils className="h-8 w-8 text-amber-600 mr-2" />
              <h1 className="text-3xl font-bold text-accent">
                Restaurant Reservation
              </h1>
            </div>
            <p className="text-default-500">
              Reserve your table for an unforgettable dining experience
            </p>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <Card className="bg-default-50">
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                    isRequired
                    startContent={<User className="h-4 w-4 text-default-400" />}
                    classNames={{
                      label: "text-accent font-medium",
                      input: "text-accent",
                    }}
                  />

                  {/* Email */}
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="your.email@example.com"
                    value={formData.email || session?.user?.email || ""}
                    disabled={!!session?.user?.email}
                    onValueChange={(value) => handleInputChange("email", value)}
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                    isRequired
                    startContent={<Mail className="h-4 w-4 text-default-400" />}
                    classNames={{
                      label: "text-accent font-medium",
                      input: "text-accent",
                    }}
                  />

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <Input
                      type="tel"
                      label="Phone Number"
                      placeholder="03XX-XXXXXXX"
                      value={formData.phone}
                      onValueChange={(value) =>
                        handleInputChange("phone", value)
                      }
                      errorMessage={errors.phone}
                      isInvalid={!!errors.phone}
                      isRequired
                      startContent={
                        <Phone className="h-4 w-4 text-default-400" />
                      }
                      classNames={{
                        label: "text-accent font-medium",
                        input: "text-accent",
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Reservation Details */}
            <Card className="bg-default-50">
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Reservation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date */}
                  <DatePicker
                    label="Reservation Date"
                    value={formData.date}
                    onChange={(date) => handleInputChange("date", date)}
                    minValue={minDate}
                    maxValue={maxDate}
                    errorMessage={errors.date}
                    isInvalid={!!errors.date}
                    isRequired
                    calendarProps={{
                      classNames: {
                        gridBody: "bg-white text-accent",
                        cellButton: "text-secondary",
                      },
                    }}
                    classNames={{
                      label: "text-accent font-medium",
                      segment: "!text-accent font-medium",
                    }}
                  />

                  {/* Time */}
                  <Autocomplete
                    label="Reservation Time"
                    placeholder="Select time"
                    selectedKey={formData.time}
                    onSelectionChange={(key) =>
                      handleInputChange("time", key as string)
                    }
                    errorMessage={errors.time}
                    isInvalid={!!errors.time}
                    isRequired
                    startContent={
                      <Clock className="h-4 w-4 text-default-400" />
                    }
                    className="text-accent"
                    classNames={{
                      base: "text-accent font-medium",
                      listboxWrapper: "text-accent font-medium",
                    }}
                  >
                    {timeSlots.map((slot) => (
                      <AutocompleteItem key={slot.key}>
                        {slot.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>

                  {/* Guests */}
                  <Select
                    label="Number of Guests"
                    placeholder="Select guests"
                    selectedKeys={formData.guests ? [formData.guests] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      handleInputChange("guests", selected);
                    }}
                    errorMessage={errors.guests}
                    isInvalid={!!errors.guests}
                    isRequired
                    startContent={
                      <Users className="h-4 w-4 text-default-400" />
                    }
                    className="text-accent"
                    classNames={{
                      label: "text-accent font-medium",
                      listboxWrapper: "text-accent font-medium",
                    }}
                  >
                    {guestOptions.map((guest) => (
                      <SelectItem key={guest.key}>{guest.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </CardBody>
            </Card>

            {/* Occasion & Special Requests */}
            <Card className="bg-default-50">
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold text-accent mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Additional Details
                </h2>
                <div className="space-y-4">
                  {/* Occasion */}
                  <Select
                    label="Occasion Type"
                    placeholder="Select occasion"
                    selectedKeys={
                      formData.occasion ? [String(formData.occasion)] : []
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      handleInputChange("occasion", Number(selected)); // convert if needed
                    }}
                    errorMessage={errors.occasion}
                    isInvalid={!!errors.occasion}
                    isRequired
                    classNames={{
                      label: "text-accent font-medium",
                      listboxWrapper: "text-accent font-medium",
                    }}
                    className="text-accent"
                  >
                    {occasionTypes.map((occasion) => (
                      <SelectItem key={String(occasion.id)}>
                        {occasion.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Special Requests */}
                  <Textarea
                    label="Special Requests"
                    placeholder="Any dietary restrictions, special celebrations, seating preferences, etc."
                    value={formData.requests}
                    onValueChange={(value) =>
                      handleInputChange("requests", value)
                    }
                    minRows={4}
                    classNames={{
                      label: "text-accent font-medium",
                      input: "text-accent",
                    }}
                    className="text-accent"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              {reservationDataProp && (
                <Button
                  variant="bordered"
                  onPress={onResetModalOpen}
                  className="border-default-300 text-default-700 hover:bg-default-50"
                >
                  Reset Form
                </Button>
              )}

              <Button
                color="warning"
                size="lg"
                onPress={handleSubmit}
                isDisabled={isSubmitting || Object.keys(errors).length > 0}
                isLoading={isSubmitting}
                className="px-8 font-medium bg-theme text-white hover:bg-amber-700"
              >
                {reservationDataProp
                  ? "Update Reservation"
                  : "Confirm Reservation"}
              </Button>
            </div>

            {errors.submit && (
              <p className="text-center text-sm text-danger">{errors.submit}</p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={isResetModalOpen} onClose={onResetModalClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-accent">
                Confirm Reset
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to reset the form? All entered
                  information will be lost.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={handleReset}>
                  Reset Form
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ReservationForm;
