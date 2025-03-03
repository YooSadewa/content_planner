"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Globe,
  Clock,
  Users,
  MapPin,
  Globe2,
  Slash,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Bread from "@/components/BreadCrumb";
import SummaryAccPage from "./summary/page";
import MonthlyPostPage from "./monthly/page";
import DetailAccPage from "./detail/page";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateDetailMonthly from "./monthly/adddata";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

export default function AkunMedsosPage() {
  const [selectedMonth, setSelectedMonth] = React.useState(months[0]);
  const [selectedYear, setSelectedYear] = React.useState(years[0].toString());
  return (
    <div className="p-6 w-[1050px] mx-auto min-h-screen">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Bread>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbLink href="/account">Ringkasan Medsos</BreadcrumbLink>
          </Bread>
        </div>
        {/* <div className="flex gap-1">
          <CreateKontenFoto />
          <CreateKontenVideo />
        </div> */}
      </div>
      <h1 className="mt-5 font-bold text-2xl text-[#293854] me-auto mb-4 flex items-center">
        Daftar Akun Media Sosial
      </h1>

      <div className="bg-white px-5 pt-5 pb-1 rounded-xl">
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Ringkasan Platform
          </h2>
          <SummaryAccPage />
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              Total Postingan Bulan
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </h2>
            <CreateDetailMonthly />
          </div>
          <MonthlyPostPage />
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dashboard Media Sosial
          </h2>
          <DetailAccPage />
        </div>
      </div>
    </div>
  );
}
