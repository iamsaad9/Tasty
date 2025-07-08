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
  const {
  selectedLocation,
  setSelectedLocation,
  hasHydrated,
} = useLocationStore();
  const [ currentLocation, setCurrentLocation ] = useState<string>('');

  useEffect(() => {
  if (hasHydrated) {
    console.log("Hydrated selectedLocation", selectedLocation);
    setCurrentLocation(selectedLocation);
  }
}, [hasHydrated, selectedLocation]);

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
      <Card className="bg-theme mx-auto w-[100vw] xl:w-[70vw] 2xl:w-[60vw] p-5 2xl:p-10 rounded-none">
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
          isClearable={false}
            className="border-1 !text-accent border-black "
            classNames={{
              listboxWrapper: "!text-accent ",
            }}
            inputProps={{
              classNames: {
                label: "!text-accent font-medium",
                base: "focus:!bg-foreground",
                inputWrapper:
                  "text-accent rounded-none  bg-foreground hover:!bg-foreground focus:!bg-foreground active:!bg-foreground",
              },
            }}
            label="Location"
            placeholder="Select your Location"
            startContent={<LocateIcon size={20} />}
            selectedKey={currentLocation}
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
            onPress={()=>setSelectedLocation('')}
            isDisabled={currentLocation==='' || currentLocation===selectedLocation}
          >
            Select
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LocationForm;
