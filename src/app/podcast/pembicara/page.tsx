import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataSpeakerTable } from "./datatable";
import axios from "axios";

type Pembicara = {
    pmb_id: number;
    pmb_nama: string;
}

export default function PembicaraPage() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/pembicara");
        if (response.data.status && response.data.data.pembicara) {
          setTableData(response.data.data.pembicara);
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

  const onVerify = async (idSpeaker: number) => {
    console.log(idSpeaker);
  };

  const handleDeleteClick = (idSpeaker: number) => {
    setSpeakerToDelete(idSpeaker);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!speakerToDelete) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/pembicara/delete/${speakerToDelete}`
      );

      if (response.data.status) {
        setTableData((prevData) =>
          prevData.filter((speaker: Pembicara) => speaker.pmb_id !== speakerToDelete)
        );
        console.log(`Speaker dengan ID ${speakerToDelete} berhasil dihapus`);
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Gagal menghapus pembicara");
    } finally {
      setIsDeleteDialogOpen(false);
      setSpeakerToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSpeakerToDelete(null);
  };

  return (
    <div className="w-6/12">
      <DataSpeakerTable
        columns={columns}
        data={tableData}
        onVerify={onVerify}
        onDelete={handleDeleteClick}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan bahwa nama pembicara ini tidak ada atau sudah tidak mengikuti podcast! 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} className="bg-gray-200 hover:bg-gray-300">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}