// app/menu/page.tsx
import { Suspense } from "react";
import ReservationContent from "./ReservationContent";
import LoadingScreen from "@/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen showLoading={true} />}>
      <ReservationContent />
    </Suspense>
  );
}
