import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const RalewaySans = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Tasty",
  icons: {
    icon: "/images/favIcon.png",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${RalewaySans.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
