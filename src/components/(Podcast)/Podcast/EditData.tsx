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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { podcastInfoSchema } from "@/validation/Validation";
import axios from "axios";

type Podcasts = {
  pdc_jadwal_shoot: string;
  pdc_jadwal_upload: string;
  pdc_tema: string;
  pdc_abstrak: string;
  pmb_id: Speakers;
  host_id: Hosts;
  pdc_link: string;
  pdc_catatan: string;
};

type Speakers = {
  pmb_id: string;
  pmb_nama: string;
};

type Hosts = {
  host_id: string;
  host_nama: string;
};

type EditPodcastProps = {
  id: string | number;
  currentName: string;
  currentAbstract: string;
  currentSpeaker: any;
  currentHost: any;
  currentShoot: string;
  currentUpload: string;
  currentNote: string;
  currentLink: string;
  currentSpeakerId: number;
  speakers: Speakers[];
  hosts: Hosts[];
};

export default function EditPodcast({
  id,
  currentName,
  currentAbstract,
  currentHost,
  currentLink,
  currentNote,
  currentShoot,
  currentUpload,
  currentSpeaker,
  speakers,
  hosts,
}: EditPodcastProps) {
  const [isModalPodcastOpen, setModalPodcastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onEditPodcast = () => {
    setModalPodcastOpen(true);
  };

  console.log("Speaker data", currentLink);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Podcasts>({
    defaultValues: {
      pdc_tema: currentName,
      pdc_abstrak: currentAbstract,
      host_id: currentHost.host_id,
      pmb_id: currentSpeaker.speaker_id,
      pdc_jadwal_shoot: currentShoot,
      pdc_jadwal_upload: currentUpload,
      pdc_catatan: currentNote,
      pdc_link: currentLink,
    },
    resolver: zodResolver(podcastInfoSchema(true, currentShoot)),
  });

  const onSubmit = async (data: Podcasts) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/podcast/update/${id}`,
        data
      );
      if (response.status === 200) {
        window.location.reload();
        setSuccessMessage("podcast berhasil diperbarui.");
        setModalPodcastOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat memperbarui podcast.");
      }
    } catch (error) {
      setErrorMessage("Podcast sudah tersedia.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setModalPodcastOpen(false);
  };

  console.log(currentShoot, currentUpload);

  return (
    <div>
      <Button size="sm" onClick={onEditPodcast} variant="outline">
        <Pencil className="h-4 w-4" />
      </Button>
      {isModalPodcastOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Podcast</AlertDialogTitle>
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
                      <Label htmlFor="pmb_id">
                        Pembicara <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="pmb_id"
                        disabled={isSubmitting || loading}
                        {...register("pmb_id")}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="Pilih" disabled hidden>
                          Pilih Pembicara
                        </option>
                        {speakers.map((speaker) => (
                          <option
                            key={speaker.pmb_id}
                            value={speaker.pmb_id}
                            className="capitalize"
                          >
                            {speaker.pmb_nama}
                          </option>
                        ))}
                      </select>
                      {errors.pmb_id?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.pmb_id?.message}
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
                      <Label htmlFor="host_id">
                        Host <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="host_id"
                        disabled={isSubmitting || loading}
                        {...register("host_id")}
                        className="border p-2 rounded text-sm w-full"
                      >
                        <option value="Pilih" disabled hidden>
                          Pilih Host
                        </option>
                        {hosts.map((host) => (
                          <option
                            key={host.host_id}
                            value={host.host_id}
                            className="capitalize"
                          >
                            {host.host_nama}
                          </option>
                        ))}
                      </select>
                      {errors.host_id?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.host_id?.message}
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
