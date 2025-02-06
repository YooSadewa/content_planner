"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Slash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DataTable } from "./quote/datatable";
import { columns } from "./quote/columns";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateQuote from "./quote/inputquote";
import { columnsInsp } from "./inspiring_people/columns";
import { DataTableInspiring } from "./inspiring_people/datatable";
import CreateInspiring from "./inspiring_people/inputinspiring";

export default function QuotesPage() {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [tableDataInspiring, setTableDataInspiring] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/quote");

        if (response.data.status && response.data.data.quote) {
          console.log("Quote: ", response.data.data.quote);
          setTableData(response.data.data.quote);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);
  useEffect(() => {
    const fetchInspiring = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/inspiringpeople");

        if (response.data.status && response.data.data.inspiringPeople) {
          console.log("Inspiring People: ", response.data.data.inspiringPeople);
          setTableDataInspiring(response.data.data.inspiringPeople);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };
    fetchInspiring();
  }, []);
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
          <div className="flex gap-2">
            <CreateQuote />
            <CreateInspiring />
          </div>
        </div>
        {loading ? (
          <div className="bg-white p-5 rounded-xl mt-5 flex flex-col w-[1010px]">
            <h1 className="font-bold text-2xl mb-3 text-[#293854]">
              Data Postingan Instagram "Quote"
            </h1>
            <div className="flex flex-row gap-3">
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
            </div>
            <div className="flex justify-between items-center w-full mt-8">
              <button className="px-1 py-1 bg-gray-200 rounded-full ms-2">
                <ChevronLeft />
              </button>
              <span className="text-sm">Page 0 of 0</span>
              <button className="px-1 py-1 bg-gray-200 rounded-full me-2">
                <ChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <DataTable query="" columns={columns} data={tableData} />
        )}
        {loading ? (
          <div className="bg-white p-5 rounded-xl mt-5 flex flex-col w-[1010px]">
            <h1 className="font-bold text-2xl mb-3 text-[#293854]">
              Data Postingan Instagram "Inspiring People"
            </h1>
            <div className="flex flex-row gap-3">
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
              <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm bg-gray-100 skeleton" />
            </div>
            <div className="flex justify-between items-center w-full mt-8">
              <button className="px-1 py-1 bg-gray-200 rounded-full ms-2">
                <ChevronLeft />
              </button>
              <span className="text-sm">Page 0 of 0</span>
              <button className="px-1 py-1 bg-gray-200 rounded-full me-2">
                <ChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <DataTableInspiring query="" columns={columnsInsp} data={tableDataInspiring} />
        )}
      </div>
    </div>
  );
}
