import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/providers";
import NavBar from "@/components/NavBar";
const RalewaySans = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasty - Private",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${RalewaySans.className} antialiased`}>
      <Providers>
        {" "}
        <NavBar />
        {children}
      </Providers>
    </div>
  );
}
