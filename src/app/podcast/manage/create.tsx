"use client";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { podcastInfoSchema } from "@/validation/Validation";
import axios from "axios";

type Podcasts = {
  pdc_jadwal_shoot: string;
  pdc_jadwal_upload: string;
  pdc_tema: string;
  pdc_abstrak: string;
  pdc_host: string;
  pdc_speaker: string;
  pdc_link: string;
  pdc_catatan: string;
};

export default function InputPodcast() {
  const [error, setError] = useState("");
  const [isModalPodcastOpen, setModalPodcastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onAddPodcast = () => {
    setModalPodcastOpen(true);
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Podcasts>({
    defaultValues: {
      pdc_jadwal_shoot: "",
      pdc_jadwal_upload: "",
      pdc_tema: "",
      pdc_abstrak: "",
      pdc_host: "",
      pdc_speaker: "",
      pdc_link: "",
      pdc_catatan: "",
    },
    resolver: zodResolver(podcastInfoSchema(false)),
  });

  const onSubmit = async (data: Podcasts) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/podcast/create",
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Podcast berhasil ditambahkan.");
        setModalPodcastOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan pembicara.");
      }
    } catch (error) {
      setErrorMessage("Podcast sudah tersedia.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalPodcastOpen(false);
  };

  return (
    <div>
      <Button size="sm" variant="default" onClick={onAddPodcast}>
        <Plus />
        Tambahkan Podcast
      </Button>
      {isModalPodcastOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Podcast</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full">
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 mb-3">
                      <Label htmlFor="pdc_jadwal_shoot">
                        Jadwal Shooting <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="pdc_jadwal_shoot"
                        disabled={isSubmitting || loading}
                        {...register("pdc_jadwal_shoot")}
                      />
                      {errors.pdc_jadwal_shoot?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.pdc_jadwal_shoot?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5 mb-3">
                      <Label htmlFor="pdc_jadwal_upload">Jadwal Upload</Label>
                      <Input
                        type="date"
                        id="pdc_jadwal_upload"
                        disabled={isSubmitting || loading}
                        {...register("pdc_jadwal_upload")}
                      />
                      {errors.pdc_jadwal_upload?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.pdc_jadwal_upload?.message}
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
                  <div className="grid w-full items-center gap-1.5 mb-3">
                    <Label htmlFor="pdc_tema">
                      Tema Podcast <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="pdc_tema"
                      rows={1}
                      disabled={isSubmitting || loading}
                      {...register("pdc_tema")}
                      className="p-2 border rounded min-h-[40px] max-h-[110px]"
                    />
                    {errors.pdc_tema?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.pdc_tema?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="grid w-full items-center gap-1.5 mb-3">
                    <Label htmlFor="pdc_abstrak">Abstrak</Label>
                    <textarea
                      id="pdc_abstrak"
                      rows={1}
                      disabled={isSubmitting || loading}
                      {...register("pdc_abstrak")}
                      className="p-2 border rounded min-h-[40px] max-h-[110px]"
                    />
                    {errors.pdc_abstrak?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.pdc_abstrak?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 mb-3">
                      <Label htmlFor="pdc_host">
                        Nama Host <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="pdc_host"
                        disabled={isSubmitting || loading}
                        placeholder="Nama Host Podcast"
                        {...register("pdc_host")}
                      />
                      {errors.pdc_host?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.pdc_host?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5 mb-3">
                      <Label htmlFor="pdc_speaker">
                        Nama Pembicara <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="pdc_speaker"
                        disabled={isSubmitting || loading}
                        placeholder="Nama Pembicara Podcast"
                        {...register("pdc_speaker")}
                      />
                      {errors.pdc_speaker?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.pdc_speaker?.message}
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
                  <div className="grid w-full items-center gap-1.5 mb-3">
                    <Label htmlFor="pdc_catatan">Catatan</Label>
                    <textarea
                      id="pdc_catatan"
                      rows={3}
                      disabled={isSubmitting || loading}
                      {...register("pdc_catatan")}
                      className="p-2 border rounded min-h-[40px] max-h-[110px]"
                    />
                    {errors.pdc_catatan?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.pdc_catatan?.message}
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
