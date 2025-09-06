import PageBanner from "@/components/PageBanner";
import ImageGallery from "@/components/ImageGallery";
import ManageMenuClient from "./ManageMenuClient"; // client wrapper

export default function ReservationPage() {
  return (
    <div>
      <PageBanner
        title="Manage Menu"
        image="/images/PageBanners/reservationPage.jpg"
      />
      <ManageMenuClient /> {/* client-only part */}
      <ImageGallery />
    </div>
  );
}
