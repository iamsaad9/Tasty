import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import {Providers} from "@/components/providers";
import Footer from "@/components/Footer";


const RalewaySans = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "Tasty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${RalewaySans.className} antialiased`}
        >
        <Providers>
        <NavBar/>
        {children}
          <Footer/>

    </Providers>
      </body>
    </html>
  );
}
