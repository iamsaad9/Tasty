"use client";
import React, { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import FadeInSection from "@/components/ui/scrollAnimated";
import ReservationForm from "@/components/Reservation/ReservationForm";
import ImageGallery from "@/components/ImageGallery";
import ViewReservationsTable from "@/components/Reservation/ReservationTable";
import Heading from "@/components/Heading";

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
            size="md"
            color="warning"
            classNames={{ tabList: "bg-secondary/30" }}
          >
            <Tab key="newReservation" title="New Reservation">
              <Heading title="RESERVATIONS" subheading="New Reservation"/>

              <FadeInSection>
                <ReservationForm
                  reservationDataProp={editReservation}
                  resetData = {() => setEditReservation(null)}
                  // clearReservationData={() => setEditReservation(null)}
                />
              </FadeInSection>
              
            </Tab>

            <Tab isDisabled={editReservation!==null} key="viewReservation" title="View Reservation">
              
              <Heading title="RESERVATIONS" subheading="View Reservation"/>

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
