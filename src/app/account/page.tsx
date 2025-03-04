"use client";

import { Slash } from "lucide-react";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Bread from "@/components/BreadCrumb";
import SummaryAccPage from "./summary/page";
import MonthlyPostPage from "./monthly/page";
import DetailAccPage from "./detail/page";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateDetailMonthly from "./monthly/adddata";
import axios from "axios";

const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

export type PlatformStats = {
  total_konten: number;
  pengikut: number;
};

export type AllPlatformStats = {
  website: PlatformStats;
  instagram: PlatformStats;
  twitter: PlatformStats;
  facebook: PlatformStats;
  youtube: PlatformStats;
  tiktok: PlatformStats;
};

export default function AkunMedsosPage() {
  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = React.useState(
    currentMonth.toString()
  );
  const [selectedYear, setSelectedYear] = React.useState(years[0].toString());
  const [dataMonthly, setDataMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetailMonthly = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/detailaccount"
        );

        console.log("Data API sebelum filter:", response.data.data.detail_akun);

        if (response.data.status && response.data.data.detail_akun) {
          let filteredData = response.data.data.detail_akun.filter(
            (item: any) =>
              item.dacc_bulan === parseInt(selectedMonth) &&
              item.dacc_tahun === parseInt(selectedYear)
          );

          console.log("bulan", selectedMonth);
          console.log("tahun", selectedYear);
          console.log("Data setelah filter:", filteredData); // Debugging hasil filter

          if (filteredData.length === 0) {
            filteredData = [
              {
                dacc_id: "default",
                website: { dpl_total_konten: 0, dpl_pengikut: 0 },
                instagram: { dpl_total_konten: 0, dpl_pengikut: 0 },
                twitter: { dpl_total_konten: 0, dpl_pengikut: 0 },
                facebook: { dpl_total_konten: 0, dpl_pengikut: 0 },
                youtube: { dpl_total_konten: 0, dpl_pengikut: 0 },
                tiktok: { dpl_total_konten: 0, dpl_pengikut: 0 },
              },
            ];
          }

          setDataMonthly(filteredData);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailMonthly();
  }, [selectedMonth, selectedYear]);

  const [platformStats, setPlatformStats] = useState<AllPlatformStats>({
    website: { total_konten: 0, pengikut: 0 },
    instagram: { total_konten: 0, pengikut: 0 },
    twitter: { total_konten: 0, pengikut: 0 },
    facebook: { total_konten: 0, pengikut: 0 },
    youtube: { total_konten: 0, pengikut: 0 },
    tiktok: { total_konten: 0, pengikut: 0 },
  });
  useEffect(() => {
    // Fungsi untuk fetch data
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data dari API
        const response = await fetch("http://127.0.0.1:8000/api/detailaccount");
        const data = await response.json();

        // Cek jika response berhasil
        if (data.status) {
          // Inisialisasi objek untuk menyimpan data platform yang sudah dijumlahkan
          const newStats = {
            website: { total_konten: 0, pengikut: 0 },
            instagram: { total_konten: 0, pengikut: 0 },
            twitter: { total_konten: 0, pengikut: 0 },
            facebook: { total_konten: 0, pengikut: 0 },
            youtube: { total_konten: 0, pengikut: 0 },
            tiktok: { total_konten: 0, pengikut: 0 },
          };

          // Loop melalui data dari API
          data.data.detail_akun.forEach((account: any) => {
            // Cek setiap platform
            if (account.instagram) {
              newStats.instagram.total_konten += Number(
                account.instagram.dpl_total_konten || 0
              );
              newStats.instagram.pengikut += Number(
                account.instagram.dpl_pengikut || 0
              );
            }

            if (account.twitter) {
              newStats.twitter.total_konten += Number(
                account.twitter.dpl_total_konten || 0
              );
              newStats.twitter.pengikut += Number(
                account.twitter.dpl_pengikut || 0
              );
            }

            if (account.facebook) {
              newStats.facebook.total_konten += Number(
                account.facebook.dpl_total_konten || 0
              );
              newStats.facebook.pengikut += Number(
                account.facebook.dpl_pengikut || 0
              );
            }

            if (account.youtube) {
              newStats.youtube.total_konten += Number(
                account.youtube.dpl_total_konten || 0
              );
              newStats.youtube.pengikut += Number(
                account.youtube.dpl_pengikut || 0
              );
            }

            if (account.tiktok) {
              newStats.tiktok.total_konten += Number(
                account.tiktok.dpl_total_konten || 0
              );
              newStats.tiktok.pengikut += Number(
                account.tiktok.dpl_pengikut || 0
              );
            }

            if (account.website) {
              newStats.website.total_konten += Number(
                account.website.dpl_total_konten || 0
              );
            }
          });

          // Update state dengan data yang telah dijumlahkan
          setPlatformStats(newStats);
        } else {
          setError("Gagal mengambil data: " + data.message);
        }
      } catch (err) {
        setError("Error mengambil data: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    // Panggil fungsi fetch
    fetchData();
  }, []);

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
      </div>
      <h1 className="mt-5 font-bold text-2xl text-[#293854] me-auto mb-4 flex items-center">
        Daftar Akun Media Sosial
      </h1>

      <div className="bg-white px-5 pt-5 pb-1 rounded-xl">
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Ringkasan Platform
          </h2>
          <SummaryAccPage data={platformStats} />
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              Total Postingan Bulan
              <Select
                value={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
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
          <MonthlyPostPage data={dataMonthly} />
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
