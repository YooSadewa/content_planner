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
  pmb_id: Speakers;
  host_id: Hosts;
  pdc_link: string;
  pdc_catatan: string;
};

type Speakers = {
  pmb_id: string;
  pmb_nama: string;
  pmb_isactive: string;
};

type Hosts = {
  host_id: string;
  host_nama: string;
  host_isactive: string;
};

export default function InputPodcast() {
  const [hosts, setHosts] = useState<Hosts[]>([]);
  const [speakers, setSpeakers] = useState<Speakers[]>([]);
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
      pmb_id: { pmb_id: "", pmb_nama: "" },
      host_id: { host_id: "", host_nama: "" },
      pdc_link: "",
      pdc_catatan: "",
    },
    resolver: zodResolver(podcastInfoSchema),
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

  useEffect(() => {
    setValue("host_id", "Pilih" as any);
    setValue("pmb_id", "Pilih" as any);
  }, [setValue]);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/host");
        console.log("Full API Response:", response.data);

        if (response.data.status && response.data.data.host) {
          console.log("Hosts Data:", response.data.data.host);

          const activeHosts = response.data.data.host.filter(
            (host: any) => host.host_isactive === "Y"
          );

          setHosts(activeHosts);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      }
    };

    fetchHost();
  }, []);

  useEffect(() => {
    const fetchSpeaker = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/pembicara");
        console.log("Full API Response:", response.data);

        if (response.data.status && response.data.data.pembicara) {
          console.log("Speakers Data:", response.data.data.pembicara);

          const activeSpeakers = response.data.data.pembicara.filter(
            (speaker: any) => speaker.pmb_isactive === "Y"
          );

          setSpeakers(activeSpeakers);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      }
    };

    fetchSpeaker();
  }, []);

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
