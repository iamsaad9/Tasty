import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/providers";
import Footer from "@/components/Footer";
import CartIcon from "@/components/ui/CartIcon";
import CartDrawer from "@/components/CartDrawer";
import MenuItemModal from "@/components/Modals/MenuItemModal";
import NavBar from "@/components/NavBar";

const RalewaySans = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasty",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${RalewaySans.className} antialiased`}>
      <NavBar />
      <CartIcon />
      <CartDrawer />
      {children} <Footer />
      <MenuItemModal />
    </div>
  );
}
