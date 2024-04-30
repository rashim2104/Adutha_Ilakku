import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster, toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Adutha Ilakku - Sairam",
  description: "Created by M&T",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="flex flex-col items-center">
        <Toaster richColors position="top-center" closeButton/>
        {children}
        </div>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
