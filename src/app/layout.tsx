"use client";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

// Create the client outside of the component
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className={montserrat.variable}>
      <body className={`${montserrat.variable} min-h-screen`}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <div className="flex min-h-screen">
              {!isLoginPage && <Sidebar />}
              <main
                className={`flex-grow ${!isLoginPage ? "bg-gray-100" : ""}`}
              >
                {children}
              </main>
            </div>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}