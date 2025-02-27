"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Bread from "@/components/BreadCrumb";
import { columns } from "./columns";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertTriangle, Slash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import InputPodcast from "@/app/podcast/manage/create";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadInfoSchema } from "@/validation/Validation";
import { Button } from "@/components/ui/button";

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
  const [search, setSearch] = useState("");
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

              if (!podcast.pdc_link) {
                // Alert untuk jadwal upload hanya jika ada jadwal upload
                if (podcast.pdc_jadwal_upload) {
                  const daysToUpload = calculateDaysDifference(
                    podcast.pdc_jadwal_upload
                  );

                  if (daysToUpload > 0 && daysToUpload <= 3) {
                    acc.push({
                      message: `Jadwal upload Podcast "${podcast.pdc_tema}" tinggal ${daysToUpload} hari lagi.`,
                      color: "bg-yellow-300",
                    });
                  } else if (daysToUpload === 0) {
                    acc.push({
                      message: `Jadwal upload Podcast "${podcast.pdc_tema}" adalah hari ini.`,
                      color: "bg-yellow-300",
                    });
                  } else if (daysToUpload < 0) {
                    acc.push({
                      message: `Jadwal upload Podcast "${podcast.pdc_tema}" telah lewat.`,
                      color: "bg-red-500 text-white",
                    });
                  }
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
      setError("Gagal menghapus podcast");
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
        <div className="flex mb-2 justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/podcast">Podcast</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex">
            <InputPodcast />
          </div>
        </div>
        <div className="flex flex-col gap-1 max-h-16 overflow-auto">
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`${alert.color} py-2 px-3 rounded-md shadow-sm flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <button
                    onClick={() => {
                      setAlerts(alerts.filter((_, i) => i !== index));
                    }}
                    className="text-gray-700 hover:text-black focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <>
            <div className="">
              <div className="w-[1010px]">
                <div className="flex gap-2">
                  <div className="flex justify-between w-full mx-3 mt-2 mb-0">
                    <h1 className="text-xl font-bold flex items-center">
                      Data Podcast
                    </h1>
                    <div className="flex w-full max-w-sm items-center space-x-2 bg-white shadow-sm rounded-md">
                      <Input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Cari..."
                      />
                    </div>
                  </div>
                </div>
                <div className=" mt-1 flex flex-col py-2 ps-3 pe-[8px] gap-5">
                  <div className="bg-white animate-pulse w-full h-[212px] shadow-md rounded" />
                  <div className="bg-white animate-pulse w-full h-[212px] shadow-md rounded" />
                </div>
                <div className="w-full mt-3 py-[7px] pe-1">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          aria-disabled
                          className={"pointer-events-none opacity-50"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink aria-disabled>
                          <Button size="icon" variant="outline">
                            1
                          </Button>
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          aria-disabled
                          className={"pointer-events-none opacity-50"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </>
        ) : (
          <DataTable
            query={search}
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
    </div>
  );
}
