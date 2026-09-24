import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteChrome from "@/components/layout/SiteChrome";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmazonClone",
  description: "An Amazon.com clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body id="top" className="min-h-full flex flex-col bg-[#EAEDED] text-black">
        <SiteChrome header={<Header />} footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
