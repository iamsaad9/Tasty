import React, { useState } from "react";
import FadeInSection from "@/components/ui/scrollAnimated";
import {
  Input,
  Button,
  DatePicker,
  NumberInput,
  Select,
  SelectItem,
  Textarea,
  TimeInput,
} from "@heroui/react";
import {
  CalendarDate,
  CalendarDateTime,
  parseTime,
  Time,
  toTime,
} from "@internationalized/date";
import CustomModal from "../Modals/Modal";
import { z } from "zod";
import { getLocalTimeZone, today } from "@internationalized/date";

interface Reservation {
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  guests: number;
  email: string;
  status: string;
  occasion: string;
  requests?: string;
}

interface ReservationDataProps {
  reservationDataProp: Reservation | null;
  resetData: () => void;
}

function ReservationForm({
  reservationDataProp,
  resetData,
}: ReservationDataProps) {
  const [reservationData, setReservationData] = useState(reservationDataProp);
  const occasionType = [
    { id: 0, label: "Casual" },
    { id: 1, label: "Birthday" },
    { id: 2, label: "Anniversary" },
    { id: 3, label: "Wedding" },
    { id: 4, label: "Business" },
    { id: 5, label: "Solo Meal" },
    { id: 6, label: "Other" },
  ];
  const [name, setName] = useState(reservationDataProp?.name || "");
  const [email, setEmail] = useState(reservationDataProp?.email || "");
  const [phone, setPhone] = useState(reservationDataProp?.phone || "");
  const [date, setDate] = useState<CalendarDate | null>(
    reservationDataProp
      ? (() => {
          const d = new Date(reservationDataProp.date);
          return new CalendarDate(
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
          );
        })()
      : today(getLocalTimeZone()).add({ days: 3 })
  );
  const [time, setTime] = useState<Time | null>(
    reservationDataProp?.time
      ? (() => {
          const [hours, minutes] = reservationDataProp.time
            .split(":")
            .map(Number);
          return new Time(hours, minutes);
        })()
      : null
  );
  const [guests, setGuests] = useState(reservationDataProp?.guests || 1);
  const [occasion, setOccasion] = useState<number | null>(
    reservationDataProp?.occasion
      ? occasionType.find((o) => o.label === reservationDataProp.occasion)
          ?.id ?? null
      : null
  );
  const [requests, setRequests] = useState(reservationDataProp?.requests || "");
  const [showModal, setShowModal] = useState(false);

  const schema = z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name is required")
      .regex(/^[A-Za-z]+(?: [A-Za-z]+)+$/, "Please enter full name"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^03[0-9]{2}[-]?[0-9]{7}$/, "Invalid format eg: 03xx-xxxxxxx"),

    person: z
      .number()
      .min(1, "Number of Person must be at least 1")
      .max(50, "Maximum 50 person allowed per Reservation"),

    occasion: z
      .number({
        required_error: "Please select an occasion",
        invalid_type_error: "Please select an occasion",
      })
      .refine((val) => !isNaN(val) && [0, 1, 2, 3, 4, 5, 6].includes(val), {
        message: "Please select a valid occasion",
      }),

    time: z
      .object({
        hour: z.number(),
        minute: z.number(),
      })
      .refine((val) => val.hour >= 8 && val.hour < 24, {
        message: "Reservation time must be between 8:00 and 23:59",
      }),
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    person?: string;
    occasion?: string;
    time?: string;
  }>({});

  type FieldType = "name" | "email" | "phone" | "person" | "occasion";
  const validateField = (field: FieldType, value: string | number) => {
    const data = { name, email, phone, person: guests };
    if (field === "person") {
      data.person = typeof value === "number" ? value : Number(value);
    } else {
      (data as any)[field] = value;
    }
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field]?._errors?.[0],
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before proceeding
    const result = schema.safeParse({
      name,
      email,
      phone,
      person: guests,
      occasion,
      time, // this must be an object like { hour: number, minute: number }
    });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        name: fieldErrors.name?._errors[0],
        email: fieldErrors.email?._errors[0],
        phone: fieldErrors.phone?._errors[0],
        person: fieldErrors.person?._errors[0],
        occasion: fieldErrors.occasion?._errors[0],
        time: fieldErrors.time?._errors[0],
      });
      return;
    }

    const formData: Reservation = {
      id: Math.random(),
      name,
      email,
      phone,
      guests,
      date: date ? date.toDate("CST").toISOString().split("T")[0] : "",
      time: time
        ? `${time.hour.toString().padStart(2, "0")}:${time.minute
            .toString()
            .padStart(2, "0")}`
        : "",
      occasion: occasionType.find((o) => o.id === occasion)?.label ?? "",
      status: "pending",
      requests,
    };

    console.log("✅ Submitted Data:", formData);
    // Here: send to API or state
  };

  const handleReset = () => {
    setReservationData(null);
    setName("");
    setEmail("");
    setPhone("");
    setDate(null);
    setTime(null);
    setGuests(1);
    setOccasion(null);
    setRequests("");
    resetData();
    setShowModal(false);
  };
  return (
    <div className="flex flex-col items-center ">
      <FadeInSection className="w-full flex justify-center ">
        <div className="flex flex-col md:flex-row justify-around  h-auto w-full lg:w-[80%] xl:w-[60%] my-10 bg-foreground shadow-md  rounded-lg">
          {/* Left Image */}
          <div className="  md:w-[30%] overflow-hidden">
            <img
              src="/images/BgCarousel/bg_1.jpg" // Replace with your image path
              alt="Bar Interior"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Form */}
          <div className="p-5 md:p-8 flex flex-col justify-around flex-1">
            <form
              className="grid grid-cols-1 items-start sm:grid-cols-2 gap-5 h-full p-5"
              onSubmit={handleSubmit}
            >
              {/* Name */}
              <div>
                <Input
                  isClearable
                  placeholder="eg: John Doe"
                  label="Full Name"
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton: "text-secondary",
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={name}
                  onValueChange={(val) => {
                    setName(val);
                    validateField("name", val);
                  }}
                  errorMessage={errors.name}
                  isInvalid={!!errors.name}
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  isClearable
                  placeholder="eg: abc@gmail.com"
                  label="Email"
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton: "text-secondary",
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={email}
                  onValueChange={(val) => {
                    setEmail(val);
                    validateField("email", val);
                  }}
                  errorMessage={errors.email}
                  isInvalid={!!errors.email}
                />
              </div>

              {/* Phone */}
              <div>
                <Input
                  isClearable
                  placeholder="03xx-xxxxxxx"
                  label="Phone #"
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton: "text-secondary",
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={phone}
                  onValueChange={(val) => {
                    setPhone(val);
                    validateField("phone", val);
                  }}
                  errorMessage={errors.phone}
                  isInvalid={!!errors.phone}
                />
              </div>

              {/* Date */}
              <div>
                <DatePicker
                  label="Date"
                  labelPlacement="outside"
                  value={date}
                  onChange={setDate}
                  minValue={today(getLocalTimeZone()).add({ days: 3 })}
                  maxValue={today(getLocalTimeZone()).add({ days: 30 })}
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
              </div>

              <div>
                <TimeInput
                  label="Time"
                  labelPlacement="outside"
                  classNames={{
                    label: "text-accent font-medium",
                    segment: "!text-accent",
                  }}
                  value={time}
                  onChange={setTime}
                  minValue={new Time(8.0)}
                  maxValue={new Time(24.0)}
                />
              </div>

              {/* Person Count */}
              <div>
                <NumberInput
                  isClearable
                  classNames={{
                    clearButton: "text-secondary",
                    label: "!text-accent font-medium",
                  }}
                  key={"numberOfPerson"}
                  minValue={1}
                  maxValue={50}
                  label="Number of Person"
                  labelPlacement="outside"
                  value={guests}
                  onValueChange={(num) => {
                    setGuests(num);
                    validateField("person", num);
                  }}
                  hideStepper
                  errorMessage={errors.person}
                  isInvalid={!!errors.person}
                />
              </div>

              <div>
                <Textarea
                  isClearable
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton: "text-secondary",
                    label: "text-accent font-medium",
                    input: "py-2 text-accent",
                  }}
                  label="Special Requests"
                  placeholder="Enter any special requests"
                  value={requests}
                  onValueChange={setRequests}
                />
              </div>

              <div>
                <Select
                  labelPlacement="outside"
                  label="Occasion Type"
                  placeholder="Select"
                  classNames={{
                    label: "!text-accent font-medium",
                    selectorIcon: "text-accent",
                  }}
                  selectedKeys={occasion !== null ? [occasion.toString()] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    setOccasion(Number(selected)); // convert back to number
                    validateField("occasion", Number(selected));
                  }}
                  errorMessage={errors.occasion}
                  isInvalid={!!errors.occasion}
                >
                  {occasionType.map((type) => (
                    <SelectItem
                      key={type.id.toString()}
                      className="text-accent"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Button */}
              <div className="flex flex-row">
                <Button
                  type="submit"
                  className="w-full bg-theme text-md text-white font-semibold rounded-none h-14 hover:bg-transparent border-2 border-theme hover:border-theme hover:text-theme transition-colors duration-300"
                >
                  {reservationData
                    ? "Update Reservation"
                    : "Make a Reservation"}
                </Button>
              </div>
              {reservationData && (
                <div className="h-full flex items-center">
                  <Button
                    onPress={() => setShowModal(true)}
                    className="px-10 bg-secondary text-md text-white font-semibold rounded-none hover:bg-transparent border-2 border-secondary hover:text-secondary transition-colors duration-300"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </FadeInSection>
      {showModal && (
        <CustomModal
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          title="Cancel Editing?"
          description="Are you sure you want to cancel editing?"
        >
          <Button color="danger" variant="flat" onPress={handleReset}>
            Reset
          </Button>
          <Button color="default" onPress={() => setShowModal(false)}>
            Close
          </Button>
        </CustomModal>
      )}
    </div>
  );
}

export default ReservationForm;
