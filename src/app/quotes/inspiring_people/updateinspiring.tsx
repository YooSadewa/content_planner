import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { inspiringInfoSchema } from "@/validation/Validation";

type Inspiring = {
  ins_id: number;
  ins_link: string;
  ins_nama: string;
};

type InspiringProps = {
  id: string | number;
  currentLink: string;
  currentName: string;
};

export default function UpdateInspiring({
  id,
  currentLink,
  currentName,
}: InspiringProps) {
  const [loading, setLoading] = useState(false);
  const [isModalInspiringOpen, setModalInspiringOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const onEditInspiring = () => {
    setModalInspiringOpen(true);
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Inspiring>({
    defaultValues: {
      ins_link: currentLink,
      ins_nama: currentName,
    },
    resolver: zodResolver(inspiringInfoSchema),
  });

  const handleCancel = () => {
    reset();
    setModalInspiringOpen(false);
  };

  const sanitizeInstagramLink = (url: string) => {
    const match = url.match(/(https:\/\/www\.instagram\.com\/p\/[\w-]+\/)/);
    return match ? match[1] : url;
  };

  const onUpdate = async (data: Inspiring) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const sanitizedLink = sanitizeInstagramLink(data.ins_link);
    setValue("ins_link", sanitizedLink);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/inspiringpeople/update/${id}`,
        { ins_link: sanitizedLink, ins_nama: data.ins_nama }
      );
      if (response.status === 200) {
        window.location.reload();
        setSuccessMessage("Inspiring berhasil diperbarui");
        setModalInspiringOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat memperbarui data");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-full"
        onClick={onEditInspiring}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <AlertDialog open={isModalInspiringOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onUpdate)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Link Inspiring</AlertDialogTitle>
              <AlertDialogDescription>
                Tambah link menggunakan link Instagram!
              </AlertDialogDescription>
              <div className="pt-1 pb-4 w-full">
                <div className="grid w-full items-center gap-1.5 mb-3">
                  <Label htmlFor="ins_nama">Nama Pembicara</Label>
                  <Input
                    type="text"
                    id="ins_nama"
                    disabled={isSubmitting || loading}
                    placeholder="ex. Muhammad Sumbul"
                    {...register("ins_nama")}
                  />
                  {errors.ins_nama?.message && (
                    <div className="text-red-500 text-xs">
                      {errors.ins_nama?.message}
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
                  <Label htmlFor="ins_link">Link Instagram</Label>
                  <Input
                    type="text"
                    id="ins_link"
                    disabled={isSubmitting || loading}
                    placeholder="https://www.instagram.com/p/"
                    {...register("ins_link", {
                      onChange: (e) => {
                        const sanitizedLink = sanitizeInstagramLink(
                          e.target.value
                        );
                        setValue("ins_link", sanitizedLink, {
                          shouldValidate: true,
                        });
                      },
                    })}
                  />
                  {errors.ins_link?.message && (
                    <div className="text-red-500 text-xs">
                      {errors.ins_link?.message}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
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
