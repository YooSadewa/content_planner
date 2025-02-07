"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { DataTable } from "./ide-konten-foto/datatable";
import { columns } from "./ide-konten-foto/columns";
import { useEffect, useState } from "react";
import axios from "axios";

export default function IdeKontenPage() {
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  useEffect(() => {
    const fetchIdeFoto = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenfoto"
        );

        if (response.data.status && response.data.data.ide_konten_foto) {
          console.log("Ide Konten Foto: ", response.data.data.ide_konten_foto);
          setTableData(response.data.data.ide_konten_foto);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeFoto();
  }, []);
  const onOpen = async (idFoto: number) => {
    setModalOpen(true);
    setSelectedId(idFoto);
  };
  return (
    <div className="w-[1050px]">
      <div className="p-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/ide-konten">Ide Konten</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex gap-2">

          </div>
        </div>
        <div className="p-5 mt-5 rounded-xl bg-white flex flex-col items-center">
          <h1 className="font-bold text-2xl mb-3 ps-1 text-[#293854] me-auto">
            Ide Konten Foto
          </h1>
          <DataTable data={tableData} onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}
