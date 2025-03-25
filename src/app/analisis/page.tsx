"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slash } from "lucide-react";
import DataTableAnalytic from "./datatable";
import { useEffect, useState } from "react";
import { Analytic, createColumns } from "./columns"; // Ubah import columns menjadi createColumns
import axios from "axios";
import CreateAnalytic from "./adddata";

export default function ContentAnalyticPage() {
  const [tableDataAnalytic, setTableDataAnalytic] = useState<Analytic[]>([]);
  const [onlinePlanners, setOnlinePlanners] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both data sources
        const [analyticResponse, plannerResponse] = await Promise.allSettled([
          axios.get("http://127.0.0.1:8000/api/analyticcontent"),
          axios.get("http://127.0.0.1:8000/api/onlinecontentplanner"),
        ]);

        // Handle analytic content data
        if (
          analyticResponse.status === "fulfilled" &&
          analyticResponse.value?.data?.status === true
        ) {
          const analyticData =
            analyticResponse.value.data.data.analytic_content || [];
          // Transform the analytic data
          const transformedData: Analytic[] = analyticData.map((item: any) => ({
            anc_id: item.anc_id,
            anc_tanggal: item.anc_tanggal,
            anc_hari: item.anc_hari,
            lup_id: item.lup_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            platforms: item.platforms || [],
            date: item.anc_tanggal,
            day: item.anc_hari,
          }));
          setTableDataAnalytic(transformedData);
        } else {
          console.log("No analytics data available or request failed");
          setTableDataAnalytic([]);
        }

        // Handle planner data
        if (
          plannerResponse.status === "fulfilled" &&
          plannerResponse.value?.data?.status === true
        ) {
          setOnlinePlanners(
            plannerResponse.value.data.data.online_planners || []
          );
        } else {
          console.log("No planner data available or request failed");
          setOnlinePlanners([]);
        }
      } catch (err) {
        console.log("An error occurred during data fetching", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Buat columns dengan melewatkan data onlinePlanners
  const columns = createColumns(onlinePlanners);
  return (
    <div className="w-[1050px]">
      <div className="px-5 pt-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/ide-konten">Rencana Konten</BreadcrumbLink>
            </Bread>
          </div>
        </div>
      </div>
      <div className="mx-5">
        <h1 className="font-bold text-2xl mt-5 text-[#293854] me-auto mb-3 flex items-center">
          Perencanaan Konten
        </h1>

        <Card className="shadow-md border-none mb-5">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-5 ">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Ringkasan Analisis Konten
                </CardTitle>
                <CardDescription>
                  Menganalisis jangkauan konten kepada pengunjung
                </CardDescription>
              </div>
              <CreateAnalytic />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="w-full px-6 pt-6 pb-6">
                <div className="w-full bg-gray-100 skeleton h-80" />
                <div className="w-full mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem className="cursor-pointer">
                        <PaginationPrevious
                          className={"pointer-events-none opacity-50"}
                        />
                      </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationLink>0</PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="cursor-pointer">
                        <PaginationNext
                          className={"pointer-events-none opacity-50"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ) : (
              <>
                <DataTableAnalytic data={tableDataAnalytic} columns={columns} isLoading={loading}/>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
