"use client";
import React, { useEffect, useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Tabs, Tab } from "@heroui/react";
import FadeInSection from "@/components/ui/scrollAnimated";
import ImageGallery from "@/components/ImageGallery";
import MenuItemTable from "../components/menuItems/MenuItemTable";
import Heading from "@/components/Heading";
import { useRouter, useSearchParams } from "next/navigation";
import MenuItemForm from "../components/menuItems/MenuItemForm";

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

function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract tab from URL or default to "new"
  const initialTab =
    searchParams.get("mode") === "view" ? "viewMenuItem" : "newMenuItem";
  const [selectedTab, setSelectedTab] = useState<string>(initialTab);
  const [editMenuItem, setMenuItem] = useState<MenuItem | null>(null);

  // Update URL when tab changes
  const handleTabChange = (key: string) => {
    const urlTab = key === "viewMenuItem" ? "view" : "new";
    router.push(`?mode=${urlTab}`, { scroll: false });
    setSelectedTab(key);
  };

  // Keep tab in sync with URL on first render or if URL manually changes
  useEffect(() => {
    const urlTab = searchParams.get("mode");

    // If tab param is missing, default to newReservation and update URL
    if (!urlTab) {
      router.replace("?mode=new", { scroll: false });
      return;
    }

    // Sync tab state from URL
    if (urlTab === "view") {
      setSelectedTab("viewMenuItem");
    } else {
      setSelectedTab("newMenuItem");
    }
  }, [searchParams, router]);

  return (
    <div>
      <PageBanner
        title={`${
          editMenuItem !== null ? "Edit Menu Item" : "Add New Menu Item"
        }`}
        image="/images/PageBanners/reservationPage.jpg"
      />

      <div className="w-full p-5">
        <div className="flex w-full flex-col">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => handleTabChange(String(key))}
            aria-label="Options"
            size="md"
            color="warning"
            classNames={{ tabList: "bg-secondary/30" }}
          >
            <Tab key="newMenuItem" title="New Menu Item">
              <Heading title="MENUITEMS" subheading="New Menu Item" />

              <FadeInSection>
                <MenuItemForm
                  menuItemDataProp={editMenuItem}
                  resetData={() => setMenuItem(null)}
                />
              </FadeInSection>
            </Tab>

            <Tab
              isDisabled={editMenuItem !== null}
              key="viewMenuItem"
              title="View Menu Item"
            >
              <Heading title="MENUITEMS" subheading="View Menu Item" />

              <MenuItemTable
                onAddNew={() => handleTabChange("newMenuItem")}
                onEditMenuItem={(reservation: MenuItem) => {
                  setMenuItem(reservation);
                }}
              />
            </Tab>
          </Tabs>
        </div>
      </div>

      <ImageGallery />
    </div>
  );
}

export default ReservationPage;
