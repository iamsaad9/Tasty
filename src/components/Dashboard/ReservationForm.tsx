import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Autocomplete,
  Button,
  AutocompleteItem,
} from "@heroui/react";
import { LocateIcon } from "lucide-react";
import { useLocationStore } from "@/lib/store/locationStore";

interface Location {
  area: string;
  postalCode: string;
}

function LocationForm() {
  const [action, setAction] = useState<string>("");
  const [locationData, setLocationData] = useState<Location[]>([]);
  const { selectedLocation, setSelectedLocation } = useLocationStore();
  const [ currentLocation, setCurrentLocation ] = useState<string>('');

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await fetch("/Data/location.json");
      const data = await res.json();
      console.log("data", data);
      setLocationData(data);
    };
    fetchLocation();
  }, []);
  return (
    <div className="w-full bg-foreground">
      <Card className="bg-theme mx-auto w-full lg:w-[70vw] xl:w-[60vw] p-5 2xl:p-10 rounded-none">
        <Form
          className="w-full flex-col justify-center items-center md:flex-row gap-5 lg:gap-10"
          onReset={() => setAction("reset")}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));

            setAction(`submit ${JSON.stringify(data)}`);
          }}
        >
          <Autocomplete
            className="border-2 !text-accent border-black "
            classNames={{
              listboxWrapper: "!text-accent ",
            }}
            inputProps={{
              classNames: {
                label: "!text-accent font-medium",
                base: "focus:!bg-transparent",
                inputWrapper:
                  "text-accent rounded-none  bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent",
              },
            }}
            label="Location"
            placeholder="Select your Location"
            startContent={<LocateIcon size={20} />}
            defaultSelectedKey={selectedLocation}
            onSelectionChange={(key) =>
              setCurrentLocation(key ? String(key) : "")
            }
          >
            {locationData.map((loc) => (
              <AutocompleteItem
                key={loc.area}
                className="text-accent font-medium"
              >
                {loc.area}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          <Button
            className="bg-white text-black hover:bg-transparent hover:text-white border-white"
            variant="bordered"
            radius="none"
            size="lg"
            onPress={()=>setSelectedLocation(currentLocation)}
          >
            Select
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LocationForm;
