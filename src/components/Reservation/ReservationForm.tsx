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
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import CustomModal from "../Modal";
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
    { id: 0, label: "Casual Dinner" },
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
      : null
  );
  const [time, setTime] = useState(reservationDataProp?.time || "");
  const [guests, setGuests] = useState(reservationDataProp?.guests || 1);
  const [occasion, setOccasion] = useState<number | null>(
    reservationDataProp?.occasion
      ? occasionType.find((o) => o.label === reservationDataProp.occasion)
          ?.id ?? null
      : null
  );
  const [requests, setRequests] = useState(reservationDataProp?.requests || "");
  const [showModal, setShowModal] = useState(false);
  const handleReset = () => {
    setReservationData(null);
    setName("");
    setEmail("");
    setPhone("");
    setDate(null);
    setTime("");
    setGuests(1);
    setOccasion(null);
    setRequests("");
    resetData();
    setShowModal(false);
  };
  return (
    <div className="flex flex-col items-center ">
      <FadeInSection className="flex flex-col justify-center items-center gap-2 py-10">
        <h1 className="text-background/30 text-md font-semibold">
          RESERVATIONS
        </h1>
        <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold ">
          New Reservation
        </h1>
      </FadeInSection>

      <FadeInSection className="w-full flex justify-center ">
        <div className="flex flex-row justify-around  h-auto w-[60%] my-10 bg-foreground">
          {/* Left Image */}
          <div className="  w-[30%] ">
            <img
              src="/images/BgCarousel/bg_1.jpg" // Replace with your image path
              alt="Bar Interior"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Form */}
          <div className="p-8 flex flex-col justify-around flex-1">
            <form className="grid grid-cols-1 items-start sm:grid-cols-2 gap-5 h-full p-5">
              {/* Name */}
              <div>
                <Input
                  isClearable
                  placeholder="eg: John Doe"
                  label="Full Name"
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton:'text-secondary',
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={name}
                  onValueChange={setName}
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
                    clearButton:'text-secondary',
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={email}
                  onValueChange={setEmail}
                />
              </div>

              {/* Phone */}
              <div>
                <Input
                isClearable
                  placeholder="Phone"
                  label="Phone #"
                  labelPlacement="outside-top"
                  classNames={{
                    clearButton:'text-secondary',
                    label: "text-accent font-medium",
                    input: "text-accent",
                  }}
                  value={phone}
                  onValueChange={setPhone}
                />
              </div>

              {/* Date */}
              <div>
                <DatePicker
                  label="Date"
                  labelPlacement="outside"
                  value={date}
                  onChange={setDate}
                  calendarProps={{
                    classNames: {
                      gridBody: "bg-white text-accent",
                      cellButton: "text-secondary",
                    },
                  }}
                  classNames={{
                    label: "text-accent font-medium",
                    segment: "!text-black", // <- Force override here
                  }}
                />
              </div>

              {/* Time */}
              <div>
                <Input
                isClearable
                  type="time"
                  label="Time"
                  labelPlacement="outside-top"
                  classNames={{ label: "text-accent font-medium",clearButton:'text-secondary', }}
                  value={time}
                  onValueChange={setTime}
                />
              </div>

              {/* Person Count */}
              <div>
                <NumberInput
                isClearable
                  classNames={{
                    clearButton:'text-secondary',
                    label: "!text-accent font-medium",
                  }}
                  key={"numberOfPerson"}
                  minValue={1}
                  maxValue={50}
                  label="Number of Person"
                  labelPlacement="outside"
                  value={guests}
                  onValueChange={setGuests}
                  hideStepper
                />
              </div>

              <div>
                <Textarea
                isClearable

                  labelPlacement="outside-top"
                  
                  classNames={{
                    clearButton:'text-secondary',
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
                  }}
                >
                  {occasionType.map((type) => (
                    <SelectItem key={type.id.toString()} className="text-accent">
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Button */}
              <div className="">
                <Button className="w-full bg-theme text-md text-white font-semibold rounded-none h-14 hover:bg-transparent border-2 border-theme hover:border-theme hover:text-theme transition-colors duration-300">
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
