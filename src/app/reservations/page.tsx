"use client";
import React, { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import FadeInSection from "@/components/ui/scrollAnimated";
import ReservationForm from "@/components/Reservation/ReservationForm";
import ImageGallery from "@/components/ImageGallery";
import ViewReservationsTable from "@/components/Reservation/ReservationTable";

interface Reservation {
  id: number;
  name: string;
  date: string;
  phone?: string;
  time: string;
  guests: number;
  email: string;
  status: string;
  occasion:string;
  requests?: string;
}

function ReservationPage() {
  const [selectedTab, setSelectedTab] = useState<string>("newReservation");
  const [editReservation, setEditReservation] = useState<Reservation | null>(null); // to hold data for editing

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
            onSelectionChange={(key) => setSelectedTab(String(key))}
            aria-label="Options"
            size="lg"
            color="warning"
            classNames={{ tabList: "bg-secondary/30" }}
          >
            <Tab key="newReservation" title="New Reservation">
              <FadeInSection>
                <ReservationForm
                  reservationDataProp={editReservation}
                  resetData = {() => setEditReservation(null)}
                  // clearReservationData={() => setEditReservation(null)}
                />
              </FadeInSection>
            </Tab>

            <Tab isDisabled={editReservation!==null} key="viewReservation" title="View Reservation">
              <FadeInSection className="flex flex-col justify-center items-center gap-2 py-10">
                <h1 className="text-background/30 text-md font-semibold">
                  RESERVATIONS
                </h1>
                <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold">
                  View Reservation
                </h1>
              </FadeInSection>

              <ViewReservationsTable
                onAddNew={() => setSelectedTab("newReservation")}
                onEditReservation={(reservation:Reservation) => {
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
