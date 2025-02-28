import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Component for handling uploads
export const ConfirmUpload = ({ id }: any) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const onUpload = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.put(
        `http://127.0.0.1:8000/api/idekontenfoto/upload/${id}`,
        { ikf_upload: today }
      );

      if (response.status !== 200) throw new Error("Gagal mengupload");
      window.location.reload();
    } catch (error) {
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
      setModalOpen(false); // Tutup modal setelah upload
    }
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-7 h-8 bg-blue-500 hover:bg-blue-600 hover:text-white text-white"
          disabled={loading}
        >
          {loading ? "..." : <Upload size={16} />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi sudah upload?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini untuk mengonfirmasi bahwa Anda sudah mengupload konten ke
            medsos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setModalOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onUpload}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
