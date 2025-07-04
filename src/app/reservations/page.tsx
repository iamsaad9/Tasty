"use client";
import React from "react";
import PageBanner from "@/components/PageBanner";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import FadeInSection from "@/components/ui/scrollAnimated";
import ReservationForm from "@/components/Reservation/ReservationForm";

function ReservationPage() {
  return (
    <div>
      <PageBanner
        title="Make a Reservation"
        image="/images/PageBanners/reservationPage.jpg"
      />

      <div className="w-full p-5">
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" size="lg" color="warning"
          classNames={{
            tabList: "bg-secondary/30",
          }}>
            <Tab key="newReservation" title="New Reservation">
              <FadeInSection>
                <ReservationForm/>
                </FadeInSection>
            </Tab>
            <Tab key="viewReservation" title="View Reservation">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ReservationPage;
