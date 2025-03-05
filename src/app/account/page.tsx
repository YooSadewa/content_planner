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
import React, { useEffect, useState, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateDetailMonthly from "./monthly/adddata";
import axios from "axios";

// Generate years array
const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

// Define types with more strict typing
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

// Define interface for account data
interface AccountData {
  [key: string]:
    | {
        dacc_id: number;
        dpl_total_konten?: number | string;
        dpl_pengikut?: number | string;
        created_at?: string;
        updated_at?: string;
      }
    | undefined;
}

export default function AkunMedsosPage() {
  // Months array with type definition
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

  // State initialization with default values
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState(years[0].toString());
  const [dataMonthly, setDataMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial platform stats with type safety
  const initialPlatformStats: AllPlatformStats = {
    website: { total_konten: 0, pengikut: 0 },
    instagram: { total_konten: 0, pengikut: 0 },
    twitter: { total_konten: 0, pengikut: 0 },
    facebook: { total_konten: 0, pengikut: 0 },
    youtube: { total_konten: 0, pengikut: 0 },
    tiktok: { total_konten: 0, pengikut: 0 },
  };

  const [platformStats, setPlatformStats] =
    useState<AllPlatformStats>(initialPlatformStats);

  // Fetch detail monthly data
  useEffect(() => {
    const fetchDetailMonthly = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/detailaccount"
        );

        if (response.data.status && response.data.data.detail_akun) {
          // Filter data based on selected month and year
          let filteredData = response.data.data.detail_akun.filter(
            (item: any) =>
              item.dacc_bulan === parseInt(selectedMonth) &&
              item.dacc_tahun === parseInt(selectedYear)
          );

          // If no data found, provide default empty data
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailMonthly();
  }, [selectedMonth, selectedYear]);

  // Fetch platform stats
  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/sortdetailaccount"
        );

        if (response.data.status) {
          const newStats: AllPlatformStats = { ...initialPlatformStats };

          // Sorting data berdasarkan timestamp terbaru (created_at atau updated_at)
          const sortedData = response.data.data.detail_akun.sort(
            (a: any, b: any) =>
              Math.max(
                new Date(b.created_at).getTime(),
                new Date(b.updated_at).getTime()
              ) -
              Math.max(
                new Date(a.created_at).getTime(),
                new Date(a.updated_at).getTime()
              )
          );

          // Map untuk menyimpan data terbaru berdasarkan timestamp terbesar
          const latestPlatformRecords: Record<keyof AllPlatformStats, any> = {
            website: null,
            instagram: null,
            twitter: null,
            facebook: null,
            youtube: null,
            tiktok: null,
          };

          sortedData.forEach((account: AccountData) => {
            const platforms: (keyof AllPlatformStats)[] = [
              "website",
              "instagram",
              "twitter",
              "facebook",
              "youtube",
              "tiktok",
            ];

            // Hitung timestamp terbaru dari akun
            const latestTimestamp = Math.max(
              new Date(account.created_at as any).getTime(),
              new Date(account.updated_at as any).getTime()
            );

            platforms.forEach((platform) => {
              const platformData = account[platform];
              if (platformData) {
                // Akumulasi total konten
                newStats[platform].total_konten += Number(
                  platformData.dpl_total_konten || 0
                );

                // Karena data sudah diurutkan, cukup ambil yang pertama
                if (!latestPlatformRecords[platform]) {
                  latestPlatformRecords[platform] = {
                    ...platformData,
                    latestTimestamp,
                  };
                }
              }
            });
          });

          // Setelah iterasi selesai, atur jumlah pengikut berdasarkan data terbaru
          (
            Object.keys(latestPlatformRecords) as (keyof AllPlatformStats)[]
          ).forEach((platform) => {
            const latestRecord = latestPlatformRecords[platform];
            if (latestRecord) {
              newStats[platform].pengikut = Number(
                latestRecord.dpl_pengikut || 0
              );
            }
          });

          setPlatformStats(newStats);
        } else {
          setError("Gagal mengambil data: " + response.data.message);
        }
      } catch (err) {
        setError("Error mengambil data: " + (err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStats();
  }, []);

  // Rest of the component remains the same...
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
