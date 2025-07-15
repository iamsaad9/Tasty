'use client'
import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { LocateIcon } from "lucide-react";
import { useLocationStore } from "@/lib/store/locationStore";

interface ModalProps {
  isOpen: boolean | undefined;
  onClose?: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

interface Location {
  area: string;
  postalCode: string;
}

function LocationModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [locationData, setLocationData] = useState<Location[]>([]);
  const { selectedLocation, setSelectedLocation, hasHydrated } = useLocationStore();

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await fetch("/Data/location.json");
      const data = await res.json();
      console.log("data", data);
      setLocationData(data);
    };
    fetchLocation();
  }, []);

  useEffect(()=>{
    if(hasHydrated){
      setCurrentLocation(selectedLocation)
    }
  },[hasHydrated])


  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
         onClose={onClose}
        classNames={{ closeButton: "hidden" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col p-5 gap-1 text-center text-accent">
                {title}
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button
                    className="bg-theme"
                  onPress={() => {setSelectedLocation(currentLocation), onClose()}}
                  isDisabled={
                    currentLocation === "" ||
                    currentLocation === selectedLocation
                  }
                >
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default LocationModal;
