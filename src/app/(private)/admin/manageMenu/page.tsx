// app/menu/page.tsx
import { Suspense } from "react";
import ManageMenuClient from "./ManageMenuClient";
import LoadingScreen from "@/components/Loading";

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen showLoading={true} />}>
      <ManageMenuClient />
    </Suspense>
  );
}
