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
import { hostInfoSchema } from "@/validation/Validation";
import axios from "axios";

type Hosts = {
  host_nama: string;
};

export default function InputHost() {
  const [isModalHostOpen, setModalHostOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onAddHost = () => {
    setModalHostOpen(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Hosts>({
    defaultValues: {
      host_nama: "",
    },
    resolver: zodResolver(hostInfoSchema),
  });

  const onSubmit = async (data: Hosts) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/host/create",
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Host berhasil ditambahkan.");
        setModalHostOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan host.");
      }
    } catch (error) {
      setErrorMessage("Gagal menghubungi server. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalHostOpen(false);
  };

  return (
    <div>
      <Button size="sm" variant="default" onClick={onAddHost}>
        <Plus />
        Tambahkan Host
      </Button>
      {isModalHostOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Nama Host</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="host_nama">Nama Host</Label>
                    <Input
                      type="text"
                      id="host_nama"
                      disabled={isSubmitting || loading}
                      placeholder="ex. Muhammad Sumbul"
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
