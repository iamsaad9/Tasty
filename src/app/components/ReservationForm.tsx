import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  NumberInput,
  DatePicker,
  TimeInput,
} from "@heroui/react";

function ReservationForm() {
  const [action, setAction] = useState<string>("");

  return (
    <div>
      <Card className="bg-theme p-5 lg:p-10 rounded-none">
        <Form
          className="w-full flex-col justify-center items-center md:flex-row gap-5 lg:gap-10"
          onReset={() => setAction("reset")}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));

            setAction(`submit ${JSON.stringify(data)}`);
          }}
        >
          <DatePicker
            classNames={{
              label: "text-black",
              inputWrapper:
                "border-2 border-black hover:border-black bg-transparent",
              calendarContent: "bg-black",
              selectorIcon: "text-black",
              segment: "text-black",
            }}
            id="date"
            variant="bordered"
            label="Reservation Date"
            name="date"
            radius="none"
          />
          <Input
            classNames={{
              label: "!text-black",
              inputWrapper:
                "border-2 border-black hover:border-black bg-transparent ",
              input: "text-white",
            }}
            id="fullname"
            errorMessage="Please enter a valid Full Name"
            label="Full Name"
            name="fullname"
            // placeholder="Enter your Full Name"
            type="text"
            radius="none"
          />

          <NumberInput
            classNames={{
              label: "!text-black",
              inputWrapper:
                "border-2 border-black hover:border-black bg-transparent",
              input: "text-black ",
            }}
            id="phone"
            hideStepper
            // isRequired
            label="Phone #"
            name="phone"
            // placeholder="Phone Number"
            radius="none"
          />

          <TimeInput
            classNames={{
              label: "!text-black",
              inputWrapper:
                "border-2 border-black hover:border-black bg-transparent",
              input: "text-black ",
              //  segment: "text-black",
            }}
            variant="bordered"
            label="Event Time"
            name="time"
            radius="none"
          />

          <NumberInput
            classNames={{
              label: "!text-black",
              inputWrapper:
                "border-2 border-black hover:border-black bg-transparent",
              input: "text-black ",
            }}
            name="persons"
            label="Persons"
            radius="none"
          />

          <Button
            //   className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            className="bg-white text-black hover:bg-transparent hover:text-white border-white"
            variant="bordered"
            radius="none"
            size="lg"
          >
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default ReservationForm;
