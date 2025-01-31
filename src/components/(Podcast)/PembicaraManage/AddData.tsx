"use client";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { speakerInfoSchema } from "@/validation/Validation";
import axios from "axios";

type Speakers = {
  pmb_nama: string;
};

export default function InputPembicara() {
  const [isModalPembicaraOpen, setModalPembicaraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onAddPembicara = () => {
    setModalPembicaraOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Speakers>({
    defaultValues: {
      pmb_nama: "",
    },
    resolver: zodResolver(speakerInfoSchema),
  });

  const onSubmit = async (data: Speakers) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/pembicara/create",
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Pembicara berhasil ditambahkan.");
        setModalPembicaraOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan pembicara.");
      }
    } catch (error) {
      setErrorMessage("Nama sudah tersedia");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalPembicaraOpen(false);
  };

  return (
    <div>
      <Button size="sm" variant="default" onClick={onAddPembicara}>
        <Plus />
        Tambahkan Pembicara
      </Button>
      {isModalPembicaraOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Nama Pembicara</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="pmb_nama">Nama Pembicara</Label>
                    <Input
                      type="text"
                      id="pmb_nama"
                      disabled={isSubmitting || loading}
                      placeholder="ex. Muhammad Sumbul"
                      {...register("pmb_nama")}
                    />
                    {errors.pmb_nama?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.pmb_nama?.message}
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
    </div>
  );
}
