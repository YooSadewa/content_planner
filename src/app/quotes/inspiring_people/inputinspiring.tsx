import { Button } from "@/components/ui/button";
import { inspiringInfoSchema } from "@/validation/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
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
} from "../../../components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Inspiring = {
  ins_nama: string;
  ins_link: string;
};

export default function CreateInspiring() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const onAddInspiring = () => {
    setModalOpen(true);
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inspiring>({
    defaultValues: {
      ins_link: "",
    },
    resolver: zodResolver(inspiringInfoSchema),
  });

  const onSubmit = async (data: Inspiring) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/inspiringpeople/create",
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Inspiring People berhasil ditambahkan");
        setModalOpen(false);
      } else {
        setErrorMessage("Gagal menambahkan inspiring people");
      }
    } catch (err) {
      setErrorMessage("Gagal menambahkan inspiring people");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setModalOpen(false);
  };
  return (
    <>
      <Button size="sm" variant="default" onClick={onAddInspiring}>
        <Plus />
        Tambahkan Inspiring People
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Link Inspiring</AlertDialogTitle>
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
                      {...register("ins_link")}
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
      )}
    </>
  );
}
