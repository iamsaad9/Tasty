"use client";
import React, { useEffect, useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Tabs, Tab } from "@heroui/react";
import FadeInSection from "@/components/ui/scrollAnimated";
import ReservationForm from "@/components/Reservation/ReservationForm";
import ImageGallery from "@/components/ImageGallery";
import ViewReservationsTable from "@/components/Reservation/ReservationTable";
import Heading from "@/components/Heading";
import { useRouter, useSearchParams } from "next/navigation";

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

function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract tab from URL or default to "new"
  const initialTab =
    searchParams.get("mode") === "view" ? "viewReservation" : "newReservation";
  const [selectedTab, setSelectedTab] = useState<string>(initialTab);
  const [editReservation, setEditReservation] = useState<Reservation | null>(
    null
  );

  // Update URL when tab changes
  const handleTabChange = (key: string) => {
    const urlTab = key === "viewReservation" ? "view" : "new";
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
      setSelectedTab("viewReservation");
    } else {
      setSelectedTab("newReservation");
    }
  }, [searchParams]);

  return (
    <div>
      <PageBanner
        title="Make a Reservation"
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
            <Tab
              key="newReservation"
              title={`${editReservation ? "Edit" : "New"} Reservation`}
            >
              <Heading
                title="RESERVATIONS"
                subheading={`${editReservation ? "Edit" : "New"} Reservation`}
              />

              <FadeInSection>
                <ReservationForm
                  reservationDataProp={editReservation}
                  resetData={() => setEditReservation(null)}
                />
              </FadeInSection>
            </Tab>

            <Tab
              isDisabled={editReservation !== null}
              key="viewReservation"
              title="View Reservation"
            >
              <Heading title="RESERVATIONS" subheading="View Reservation" />

              <ViewReservationsTable
                onAddNew={() => handleTabChange("newReservation")}
                onEditReservation={(reservation: Reservation) => {
                  setEditReservation(reservation);
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
