import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { UpgradeModal } from "@/components/UpgradeModal";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisaVi – UK Visa Sponsorship Job Platform",
  description:
    "Find UK jobs that can actually sponsor you. AI-powered applications, tracking and interview prep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-zinc-50">{children}</main>
        </div>
        <UpgradeModal />
      </body>
    </html>
  );
}
