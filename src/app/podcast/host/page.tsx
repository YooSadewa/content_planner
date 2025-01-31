import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataHostTable } from "./datatable";
import axios from "axios";

type Host = {
  host_id: number;
  host_nama: string;
};

export default function PembicaraPage() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hostToDelete, setHostToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/host");
        if (response.data.status && response.data.data.host) {
          setTableData(response.data.data.host);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onVerify = async (idHost: number) => {
    console.log(idHost);
  };

  const handleDeleteClick = (idHost: number) => {
    setHostToDelete(idHost);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hostToDelete) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/host/delete/${hostToDelete}`
      );

      if (response.data.status) {
        setTableData((prevData) =>
          prevData.filter(
            (host: Host) => host.host_id !== hostToDelete
          )
        );
        window.location.reload();
        console.log(`Host dengan ID ${hostToDelete} berhasil dihapus`);
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Gagal menghapus host");
    } finally {
      setIsDeleteDialogOpen(false);
      setHostToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setHostToDelete(null);
  };

  return (
    <div className="w-6/12">
      <DataHostTable
        columns={columns}
        data={tableData}
        onVerify={onVerify}
        onDelete={handleDeleteClick}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan bahwa nama host ini tidak ada atau sudah tidak
              mengikuti podcast! Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="bg-gray-200 hover:bg-gray-300"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
