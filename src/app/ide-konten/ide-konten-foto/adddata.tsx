import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { picContentInfoSchema } from "@/validation/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PicContent = {
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
};

export default function CreateKontenFoto() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PicContent>({
    defaultValues: {
      ikf_tgl: new Date().toISOString().split("T")[0],
      ikf_judul_konten: "",
      ikf_ringkasan: "",
      ikf_referensi: "",
    },
    resolver: zodResolver(picContentInfoSchema),
  });

  const onAdd = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  const onSubmit = async (data: PicContent) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/idekontenfoto/create",
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Konten berhasil ditambahkan.");
        setModalOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan Konten.");
      }
    } catch (error) {
      setErrorMessage("Judul Sudah tersedia");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button size="sm" variant="default" onClick={onAdd}>
        <Plus />
        Tambahkan Konten Foto
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Konten</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikf_judul_konten">Judul Konten <span className="text-red-600">*</span></Label>
                    <Input
                      type="text"
                      id="ikf_judul_konten"
                      disabled={isSubmitting || loading}
                      placeholder="Konten XYZ"
                      {...register("ikf_judul_konten")}
                    />
                    {errors.ikf_judul_konten?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_judul_konten?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikf_tgl">Tanggal</Label>
                    <Input
                      type="text"
                      id="ikf_tgl"
                      className="cursor-not-allowed"
                      readOnly
                      {...register("ikf_tgl")}
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikf_ringkasan">Ringkasan Konten <span className="text-red-600">*</span></Label>
                    <textarea
                      id="ikf_ringkasan"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="Konten XYZ menjelaskan tentang ABC"
                      {...register("ikf_ringkasan")}
                    />
                    {errors.ikf_ringkasan?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_ringkasan?.message}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikf_referensi">Referensi Konten</Label>
                    <textarea
                      id="ikf_referensi"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="https://www.instagram.com/p/"
                      {...register("ikf_referensi")}
                    />
                    {errors.ikf_referensi?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_referensi?.message}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
