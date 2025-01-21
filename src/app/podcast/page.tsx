"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UploadModal from "@/components/UploadModal";
import { Plus, Search, Slash } from "lucide-react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PodcastPage() {
  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleVerify = () => {
    console.log("Verify clicked");
  };
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/podcast");
        if (response.data.status && response.data.data.podcast) {
          setTableData(response.data.data.podcast);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 w-10/12 overflow-auto">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Bread>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbLink href="/podcast">Podcast</BreadcrumbLink>
          </Bread>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="default">
            <Plus />
            Tambahkan Podcast
          </Button>
          <Button size="sm" variant="default">
            <Plus />
            Tambahkan Host
          </Button>
          <Button size="sm" variant="default">
            <Plus />
            Tambahkan Pembicara
          </Button>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <h1 className="text-xl font-bold flex items-center">Data Podcast</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Search..." />
          <Button type="submit"><Search /></Button>
        </div>
      </div>
      <div className="w-full flex gap-4 mt-4 flex-wrap">
        {tableData.map((item: any) => (
          <Card
            key={item.pdc_id}
            title={item.pdc_tema}
            speaker={item.pdc_nama}
            host={item.host_nama}
            shootDate={item.pdc_jadwal_shoot}
            uploadDate={item.pdc_jadwal_upload}
            onEdit={handleEdit}
            onVerify={handleVerify}
            abstractContent={item.abstract}
          />
        ))}
      </div>
    </div>
  );
}
