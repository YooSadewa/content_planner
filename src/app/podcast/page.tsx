"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Bread from "@/components/BreadCrumb";
import { columns } from "./columns";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus, Search, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./DataTable";
import HostPage from "./host/page";
import PembicaraPage from "./pembicara/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InputHost from "@/components/(Podcast)/HostManage/AddData";
import InputPembicara from "@/components/(Podcast)/PembicaraManage/AddData";
import InputPodcast from "@/components/(Podcast)/Podcast/AddData";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadInfoSchema } from "@/validation/Validation";
import { useRouter } from "next/navigation";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EditPodcast from "@/components/(Podcast)/Podcast/EditData";

const calculateDaysDifference = (date: string): number => {
  const today = new Date();
  const targetDate = new Date(date);
  return Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
};

type Podcasts = {
  pdc_id: number;
  pdc_link: string;
};

export default function PodcastPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const [alerts, setAlerts] = useState<{ message: string; color: string }[]>(
    []
  );
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPodcastId, setSelectedPodcastId] = useState<number | null>(
    null
  );
  const handleCancel = () => {
    setModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Podcasts>({
    defaultValues: {
      pdc_link: "",
    },
    resolver: zodResolver(uploadInfoSchema),
  });

  const onSubmit = async (data: Podcasts) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/podcast/upload/${selectedPodcastId}`,
        data
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Link berhasil ditambahkan.");
        setModalOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan link.");
      }
    } catch (error) {
      setErrorMessage("Gagal menghubungi server. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/podcast");
        if (response.data.status && response.data.data.podcast) {
          setTableData(response.data.data.podcast);

          const newAlerts = response.data.data.podcast.reduce(
            (acc: any, podcast: any) => {
              const daysToShoot = calculateDaysDifference(
                podcast.pdc_jadwal_shoot
              );
              const daysToUpload = calculateDaysDifference(
                podcast.pdc_jadwal_upload
              );

              if (!podcast.pdc_link) {
                if (daysToShoot > 0 && daysToShoot <= 3) {
                  acc.push({
                    message: `Podcast "${podcast.pdc_tema}" jadwal shoot tinggal ${daysToShoot} hari lagi.`,
                    color: "bg-yellow-300",
                  });
                } else if (daysToShoot === 0) {
                  acc.push({
                    message: `Podcast "${podcast.pdc_tema}" jadwal shoot adalah hari ini.`,
                    color: "bg-yellow-300",
                  });
                } else if (daysToShoot < 0) {
                  acc.push({
                    message: `Podcast "${
                      podcast.pdc_tema
                    }" jadwal shoot telah lewat ${Math.abs(daysToShoot)} hari.`,
                    color: "bg-red-500 text-white",
                  });
                }

                if (daysToUpload > 0 && daysToUpload <= 3) {
                  acc.push({
                    message: `Podcast "${podcast.pdc_tema}" jadwal upload tinggal ${daysToUpload} hari lagi.`,
                    color: "bg-yellow-300",
                  });
                } else if (daysToUpload === 0) {
                  acc.push({
                    message: `Podcast "${podcast.pdc_tema}" jadwal upload adalah hari ini.`,
                    color: "bg-yellow-300",
                  });
                } else if (daysToUpload < 0) {
                  acc.push({
                    message: `Podcast "${podcast.pdc_tema}" jadwal upload telah lewat.`,
                    color: "bg-red-500 text-white",
                  });
                }
              }

              return acc;
            },
            []
          );

          setAlerts(newAlerts);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        // console.error("Error:", err);
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onUpload = async (idPodcast: number) => {
    console.log("Opening modal for Podcast ID:", idPodcast);
    setSelectedPodcastId(idPodcast);
    setModalOpen(true);
    console.log("isModalOpen:", isModalOpen);
  };

  const onDelete = async (idPodcast: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/podcast/delete/${idPodcast}`
      );

      if (response.data.status) {
        setTableData((prevData) =>
          prevData.filter((podcast: Podcasts) => podcast.pdc_id !== idPodcast)
        );
        window.location.reload();
        console.log(`Podcast dengan ID ${idPodcast} berhasil dihapus`);
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError("Gagal menghapus pembicara");
    }
  };

  const onEdit = async (idPodcast: number) => {
    console.log("Opening modal for Podcast ID:", idPodcast);
    setSelectedPodcastId(idPodcast);
    setModalEditOpen(true);
  };

  return (
    <div className="bg-gray-100">
      <div className="p-5 w-12/12 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/podcast">Podcast</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex gap-1">
            <InputPodcast />
            <InputHost />
            <InputPembicara />
          </div>
        </div>
        <div className="flex justify-between my-5">
          <h1 className="text-xl font-bold flex items-center">Data Podcast</h1>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search..." />
            <Button type="submit">
              <Search />
            </Button>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="my-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`py-2 px-3 rounded-md ${alert.color} mb-2 text-sm uppercase font-bold`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <>
            <div className="border pb-[72px] flex flex-col py-2 ps-2 pe-[7px] gap-4">
              <div className="flex gap-5">
                <div className="bg-gray-100 skeleton w-[482px] h-[200px] shadow-md rounded" />
                <div className="bg-gray-100 skeleton w-[482px] h-[200px] shadow-md rounded" />
              </div>
              <div className="flex gap-5 mt-[4px]">
                <div className="bg-gray-100 skeleton w-[482px] h-[200px] shadow-md rounded" />
                <div className="bg-gray-100 skeleton w-[482px] h-[200px] shadow-md rounded" />
              </div>
            </div>
          </>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            onUpload={onUpload}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
        {isModalOpen && (
          <AlertDialog defaultOpen open>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Verifikasi upload link ke YouTube
                </AlertDialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-1.5 mb-3">
                    <Label htmlFor="pdc_link">Link Youtube</Label>
                    <Input
                      type="text"
                      id="pdc_link"
                      disabled={isSubmitting || loading}
                      placeholder="https://www.youtube.com/"
                      {...register("pdc_link")}
                    />
                    {errors.pdc_link?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.pdc_link?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button" onClick={handleCancel}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      disabled={isSubmitting || loading}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <h1 className="text-center text-2xl font-bold">
        Data Host dan Pembicara
      </h1>
      {loading ? (
        <div className="flex w-12/12 px-8 mt-5 mb-7 gap-4">
          <div className="skeleton bg-gray-100 w-6/12 h-36 border rounded-none" />
          <div className="skeleton bg-gray-100 w-6/12 h-36 border rounded-none" />
        </div>
      ) : (
        <>
          <div className="flex w-12/12 px-8 gap-4">
            <HostPage />
            <PembicaraPage />
          </div>
        </>
      )}
    </div>
  );
}
