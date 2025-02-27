"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus, Slash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateQuote from "./quote/inputquote";
import CreateInspiring from "./inspiring_people/inputinspiring";
import { columns, columns as quoteColumns } from "./quote/columns";
import {
  columnsInsp,
  columnsInsp as inspiringColumns,
} from "./inspiring_people/columns";
import { DataTable } from "./quote/datatable";
import { DataTableInspiring } from "./inspiring_people/datatable";
import Image from "next/image";

type Quote = {
  qotd_id: number;
  qotd_link: string;
};

type Inspiring = {
  ins_id: number;
  ins_link: string;
  ins_nama: string;
};

export default function QuotesPage() {
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [inspiringLoading, setInspiringLoading] = useState(true);
  const [quoteData, setQuoteData] = useState([]);
  const [inspiringData, setInspiringData] = useState([]);
  const [quoteError, setQuoteError] = useState("");
  const [inspiringError, setInspiringError] = useState("");
  const [activeTab, setActiveTab] = useState("quotes");

  // Function to fetch quotes data
  const fetchQuoteData = async () => {
    setQuoteLoading(true);
    setQuoteError("");
    try {
      const quoteResponse = await axios.get("http://127.0.0.1:8000/api/quote");
      console.log("Quote API response:", quoteResponse.data);

      // Check and set quote data with fallback to empty array
      if (quoteResponse.data.status) {
        const quotes = quoteResponse.data.data.quote || [];
        console.log("Quote data being set:", quotes);
        setQuoteData(quotes);
      } else {
        console.warn("Quote API returned status false");
        setQuoteData([]);
      }
    } catch (err) {
      setQuoteError("");
    } finally {
      setQuoteLoading(false);
    }
  };

  // Function to fetch inspiring people data
  const fetchInspiringData = async () => {
    setInspiringLoading(true);
    setInspiringError("");
    try {
      const inspiringResponse = await axios.get(
        "http://127.0.0.1:8000/api/inspiringpeople"
      );
      console.log("Inspiring API response:", inspiringResponse.data);

      // Check and set inspiring data with fallback to empty array
      if (inspiringResponse.data.status) {
        // Make sure we're getting the right property and have a fallback
        const inspiring = inspiringResponse.data.data.inspiringPeople || [];
        console.log("Inspiring data being set:", inspiring);
        setInspiringData(inspiring);
      } else {
        console.warn("Inspiring API returned status false");
        setInspiringData([]);
      }
    } catch (err) {
      setInspiringError("");
    } finally {
      setInspiringLoading(false);
    }
  };

  // Effect to fetch data on initial load - now completely separate
  useEffect(() => {
    fetchQuoteData();
    fetchInspiringData();
  }, []);

  // Add effect to fetch data when tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    if (activeTab === "quotes") {
      console.log("Refreshing quote data on tab change");
      fetchQuoteData();
    } else if (activeTab === "inspiring") {
      console.log("Refreshing inspiring data on tab change");
      fetchInspiringData();
    }
  }, [activeTab]);

  const onDeleteQuote = async (idQuote: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/quote/delete/${idQuote}`
      );

      if (response.data.status) {
        // Use functional update to ensure we have latest state
        setQuoteData((prevData) =>
          prevData.filter((quote: Quote) => quote.qotd_id !== idQuote)
        );
        // Refresh quote data only
        fetchQuoteData();
      } else {
        console.error("Quote deletion failed:", response.data.message);
      }
    } catch (err) {
      console.error("Terjadi kesalahan pada delete quote:", err);
      setQuoteError("Gagal menghapus quote");
    }
  };

  const onDeleteInspiring = async (idInspiring: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/inspiringpeople/delete/${idInspiring}`
      );

      if (response.data.status) {
        // Use functional update to ensure we have latest state
        setInspiringData((prevData) =>
          prevData.filter(
            (inspiring: Inspiring) => inspiring.ins_id !== idInspiring
          )
        );
        // Refresh inspiring data only
        fetchInspiringData();
      } else {
        console.error("Inspiring deletion failed:", response.data.message);
      }
    } catch (err) {
      console.error("Terjadi kesalahan pada delete inspiring:", err);
      setInspiringError("Gagal menghapus inspiring people");
    }
  };

  return (
    <div className="bg-gray-100 w-[1050px]">
      <div className="p-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/quotes">Quotes</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex gap-1">
            <CreateQuote />
            <CreateInspiring />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl mt-5 flex flex-col w-full">
          <Tabs defaultValue="quotes" onValueChange={setActiveTab}>
            <div className="flex justify-between">
              <h1 className="font-bold text-2xl ps-1 text-[#293854] me-auto mb-4">
                Postingan Quote & Inspiring People
              </h1>
              <TabsList className="mb-4 flex gap-1 bg-white w-fit rounded-lg shadow-[0_0_7px_rgba(0,0,0,0.1)]">
                <TabsTrigger
                  value="quotes"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Quote
                </TabsTrigger>
                <TabsTrigger
                  value="inspiring"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Inspiring People
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="quotes">
              {quoteLoading ? (
                <>
                  <div className="flex flex-row gap-3">
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                  </div>
                  <div className="w-full mt-8 py-[8px] pe-1">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink aria-disabled>
                            <Button size="icon" variant="outline">
                              1
                            </Button>
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : quoteError ? (
                <div className="text-red-500 p-4">{quoteError}</div>
              ) : quoteData.length === 0 ? (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <Image
                      src={"/assets/nodata.svg"}
                      alt="no data"
                      width={300}
                      height={300}
                      className=""
                    />
                    <p className="font-medium text-sm">Data Tidak Ditemukan</p>
                  </div>
                  <div className="w-full mt-8 py-[8px] pe-1">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink aria-disabled>
                            <Button size="icon" variant="outline" disabled>
                              1
                            </Button>
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <DataTable
                  query=""
                  columns={columns}
                  data={quoteData}
                  onDelete={onDeleteQuote}
                />
              )}
            </TabsContent>

            <TabsContent value="inspiring">
              {inspiringLoading ? (
                <>
                  <div className="flex flex-row gap-3">
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                    <div className="w-[315px] h-[360px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
                  </div>
                  <div className="w-full mt-8 py-[8px] pe-1">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink aria-disabled>
                            <Button size="icon" variant="outline">
                              1
                            </Button>
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : inspiringError ? (
                <div className="text-red-500 p-4">{inspiringError}</div>
              ) : inspiringData.length === 0 ? (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <Image
                      src={"/assets/nodata.svg"}
                      alt="no data"
                      width={300}
                      height={300}
                      className=""
                    />
                    <p className="font-medium text-sm">Data Tidak Ditemukan</p>
                  </div>
                  <div className="w-full mt-8 py-[8px] pe-1">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink aria-disabled>
                            <Button size="icon" variant="outline" disabled>
                              1
                            </Button>
                          </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            aria-disabled
                            className={"pointer-events-none opacity-50"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <DataTableInspiring
                  query=""
                  columns={columnsInsp}
                  data={inspiringData}
                  onDelete={onDeleteInspiring}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
