"use client";
import { Pencil } from "lucide-react";
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
import { hostInfoSchema } from "@/validation/Validation";
import axios from "axios";

type Hosts = {
  host_nama: string;
};

type EditHostProps = {
  id: string | number;
  currentName: string;
};

export default function EditHost({ id, currentName }: EditHostProps) {
  const [isModalHostOpen, setModalHostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onEditHost = () => {
    setModalHostOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Hosts>({
    defaultValues: {
      host_nama: currentName,
    },
    resolver: zodResolver(hostInfoSchema),
  });

  const onSubmit = async (data: Hosts) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/host/update/${id}`,
        data
      );
      if (response.status === 200) {
        window.location.reload();
        setSuccessMessage("host berhasil diperbarui.");
        setModalHostOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat memperbarui host.");
      }
    } catch (error) {
      setErrorMessage("Nama sudah tersedia.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setModalHostOpen(false);
  };

  return (
    <div>
      <Button size="sm" onClick={onEditHost} variant="outline">
        <Pencil className="h-4 w-4" />
      </Button>
      {isModalHostOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Nama Host</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="host_nama">Nama host</Label>
                    <Input
                      type="text"
                      id="host_nama"
                      disabled={isSubmitting || loading}
                      {...register("host_nama")}
                    />
                    {errors.host_nama?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.host_nama?.message}
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
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Simpan"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
