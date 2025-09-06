"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import FadeInSection from "@/components/ui/scrollAnimated";
import MenuItemForm from "../components/menuItems/MenuItemForm";
import MenuItemTable from "../components/menuItems/MenuItemTable";
import Heading from "@/components/Heading";

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

export default function ManageMenuClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab =
    searchParams.get("mode") === "view" ? "viewMenuItem" : "newMenuItem";

  const [selectedTab, setSelectedTab] = useState<string>(initialTab);
  const [editMenuItem, setMenuItem] = useState<MenuItem | null>(null);

  const handleTabChange = (key: string) => {
    const urlTab = key === "viewMenuItem" ? "view" : "new";
    router.push(`?mode=${urlTab}`, { scroll: false });
    setSelectedTab(key);
  };

  useEffect(() => {
    const urlTab = searchParams.get("mode");
    if (!urlTab) {
      router.replace("?mode=new", { scroll: false });
      return;
    }
    setSelectedTab(urlTab === "view" ? "viewMenuItem" : "newMenuItem");
  }, [searchParams, router]);

  return (
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
              onEditMenuItem={(reservation: MenuItem) =>
                setMenuItem(reservation)
              }
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
