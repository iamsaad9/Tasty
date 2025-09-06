// app/menu/page.tsx
import { Suspense } from "react";
import MenuPageContent from "./ManageMenuContent";
import LoadingScreen from "@/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen showLoading={true} />}>
      <MenuPageContent />
    </Suspense>
  );
}
