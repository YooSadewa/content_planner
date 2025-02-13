import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { picContentInfoSchema } from "@/validation/Validation";
import axios from "axios";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
  created_at: string;
  updated_at: string;
};

type EditKontenFotoProps = {
  id: string | number;
  currentName: string;
  currentSummary: string;
  currentReference: string;
};

export default function UpdateKontenFoto({
  id,
  currentName,
  currentSummary,
  currentReference,
}: EditKontenFotoProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const onEdit = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    reset();
    setModalOpen(false);
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IdeKontenFoto>({
    defaultValues: {
      ikf_judul_konten: currentName,
      ikf_tgl: new Date().toISOString().split("T")[0],
      ikf_ringkasan: currentSummary,
      ikf_referensi: currentReference,
    },
    resolver: zodResolver(picContentInfoSchema),
  });
  const onUpdate = async (data: IdeKontenFoto) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/idekontenfoto/update/${id}`,
        data
      );
      if (response.status === 200) {
        window.location.reload();
        setSuccessMessage("Data berhasil diupdate");
        setModalOpen(false);
      } else {
        setErrorMessage("Gagal mengupdate data");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button variant="outline" className="w-16 h-7" onClick={onEdit}>
        <Pencil />
      </Button>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onUpdate)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Konten</AlertDialogTitle>
              <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="ikf_judul_konten">
                    Judul Konten <span className="text-red-600">*</span>
                  </Label>
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
                  <Label htmlFor="ikf_ringkasan">
                    Ringkasan Konten <span className="text-red-600">*</span>
                  </Label>
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
    </>
  );
}
