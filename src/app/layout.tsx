import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/layout/SiteChrome";

export const metadata: Metadata = {
  title: "Premium E-Commerce | The Engineered Gallery",
  description: "A highly polished, editorial e-commerce experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body id="top" className="min-h-full flex flex-col bg-gallery text-black font-satoshi overflow-x-hidden w-full max-w-full">
        <SiteChrome header={<Header />} footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
