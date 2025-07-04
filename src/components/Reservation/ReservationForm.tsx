import React from 'react'
import FadeInSection from "@/components/ui/scrollAnimated";

function ReservationForm() {
  return (
    <div>
         <FadeInSection className="flex flex-col justify-center items-center gap-2 py-10">
                <h1 className="text-background/30 text-md font-semibold">RESERVATIONS</h1>
                <h1 className="text-accent text-center text-2xl sm:text-3xl font-semibold ">
                   New Reservation
                </h1>
              </FadeInSection>
    </div>
  )
}

export default ReservationForm