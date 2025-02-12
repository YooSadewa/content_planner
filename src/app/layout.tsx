import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"], 
  weight: ["400", "500", "700"], // Sesuaikan dengan kebutuhan
  variable: "--font-montserrat", // Nama CSS Variable
});
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Content Planner UIB",
  description: "Content Planner UIB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <div className="flex bg-gray-100">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
