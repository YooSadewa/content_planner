"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { DataTable } from "./ide-konten-foto/datatable";
import { DataTableVideo } from "./ide-konten-video/datatable";
import { columns } from "./ide-konten-foto/columns";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateKontenFoto from "./ide-konten-foto/adddata";
import CreateKontenVideo from "./ide-konten-video/adddata";

export default function IdeKontenPage() {
  const [tableData, setTableData] = useState([]);
  const [tableDataVideo, setTableDataVideo] = useState([]);
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
  useEffect(() => {
    const fetchIdeVideo = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenvideo"
        );

        if (response.data.status && response.data.data.ide_konten_video) {
          console.log(
            "Ide Konten Video: ",
            response.data.data.ide_konten_video
          );
          setTableDataVideo(response.data.data.ide_konten_video);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeVideo();
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
          <div className="flex gap-1">
            <CreateKontenFoto />
            <CreateKontenVideo />
          </div>
        </div>
        <div className="px-3 pt-5 mt-5 rounded-xl bg-white flex flex-col items-center">
          <h1 className="font-bold text-2xl ps-1 text-[#293854] me-auto">
            Ide Konten Foto
          </h1>
          <DataTable data={tableData} onOpen={onOpen} />
        </div>
        <div className="px-3 pt-5 mt-5 rounded-xl bg-white flex flex-col items-center">
          <h1 className="font-bold text-2xl ps-1 text-[#293854] me-auto">
            Ide Konten Video
          </h1>
          <DataTableVideo data={tableDataVideo} onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}
