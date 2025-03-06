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

  useEffect(() => {
    const fetchPlatformStats = async () => {
      setLoading(true);
      setError("");
      try {
        const sortSummary = await axios.get(
          "http://127.0.0.1:8000/api/sortdetailaccount"
        );
        console.log("API response:", sortSummary.data);

        if (sortSummary.data.status) {
          // Extract data from the response
          const { total_konten_per_platform, latest_followers } =
            sortSummary.data.data;

          // Create a new object with the correct structure for AllPlatformStats
          const formattedStats: AllPlatformStats = {
            website: {
              total_konten: total_konten_per_platform.website || 0,
              pengikut: latest_followers.website || 0,
            },
            instagram: {
              total_konten: total_konten_per_platform.instagram || 0,
              pengikut: latest_followers.instagram || 0,
            },
            twitter: {
              total_konten: total_konten_per_platform.twitter || 0,
              pengikut: latest_followers.twitter || 0,
            },
            facebook: {
              total_konten: total_konten_per_platform.facebook || 0,
              pengikut: latest_followers.facebook || 0,
            },
            youtube: {
              total_konten: total_konten_per_platform.youtube || 0,
              pengikut: latest_followers.youtube || 0,
            },
            tiktok: {
              total_konten: total_konten_per_platform.tiktok || 0,
              pengikut: latest_followers.tiktok || 0,
            },
          };

          console.log("Formatted platform stats:", formattedStats);
          setPlatformStats(formattedStats);
        } else {
          console.warn("API returned status false");
          setPlatformStats(initialPlatformStats);
        }
      } catch (err) {
        console.error("Error fetching platform stats:", err);
        setError("Gagal mengambil data statistik platform.");
        setPlatformStats(initialPlatformStats);
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
          {loading ? (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between">
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
              </div>
              <div className="flex justify-between">
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
                <span className="w-[305px] h-[173px] bg-gray-100 rounded-xl skeleton" />
              </div>
            </div>
          ) : (
            <>
              <SummaryAccPage data={platformStats} />
            </>
          )}
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
          {loading ? (
            <div className="w-full bg-gray-100 h-[173px] rounded-xl" />
          ) : (
            <MonthlyPostPage data={dataMonthly} />
          )}
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
