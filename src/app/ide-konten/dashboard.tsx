import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { Camera, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IdeKontenFoto {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  created_at: string;
  updated_at: string;
}

type IdeKontenVideo = {
  ikv_id: number;
  ikv_tgl: string;
  ikv_judul_konten: string;
  ikv_ringkasan: string;
  ikv_status: string;
  created_at: string;
  updated_at: string;
};

export default function DashboardIdeKontenPage() {
  const [itemsFoto, setItemsFoto] = useState<IdeKontenFoto[]>([]);
  const [itemsVideo, setItemsVideo] = useState<IdeKontenVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenfoto"
        );
        const sortedData = response.data.data.ide_konten_foto
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);
        setItemsFoto(sortedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenvideo"
        );
        const sortedData = response.data.data.ide_konten_video
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);
        setItemsVideo(sortedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const getStatusColor = (ikv_status: string) => {
    switch (ikv_status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "on hold":
        return "bg-blue-100 text-blue-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="w-full flex gap-1">
      <Card className="w-6/12 bg-white hover:shadow-lg transition-shadow duration-300 mt-1 h-[435px]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Ide Konten Foto</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex flex-col gap-2">
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
            </div>
          ) : (
            <>
              {itemsFoto.map((item) => (
                <Link
                  href={"/ide-konten"}
                  key={`foto-${item.ikf_id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="bg-white rounded-lg h-[110px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col gap-2">
                    <div className="flex items-start gap-2 my-auto">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 capitalize">
                        <h3 className="text-lg font-semibold text-slate-900 w-[375px] truncate">
                          {item.ikf_judul_konten}
                        </h3>
                        <div className="flex gap-5 mt-2 justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-600">
                              Tanggal
                            </span>
                            <p className="text-sm text-slate-600 w-40 truncate">
                              {item.ikf_tgl
                                ? new Date(item.ikf_tgl).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-600">
                              Ringkasan Konten:
                            </span>
                            <p className="text-sm text-slate-600 w-40 truncate">
                              {item.ikf_ringkasan}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </CardContent>
      </Card>
      <Card className="w-6/12 bg-white hover:shadow-lg transition-shadow duration-300 mt-1 h-[435px]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              Ide Konten Video
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="flex flex-col gap-2">
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
              <div className="bg-gray-100 skeleton rounded-lg h-[110px] p-4"></div>
            </div>
          ) : (
            <>
              {itemsVideo.map((item, index) => (
                <Link
                  href={"/ide-konten"}
                  key={`video-${item.ikv_id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="bg-white rounded-lg h-[110px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-start gap-2 my-auto">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Video className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 capitalize">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-900 w-[275px] truncate">
                            {item.ikv_judul_konten}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              item.ikv_status
                            )}`}
                          >
                            {item.ikv_status === "on-hold"
                              ? "On Hold"
                              : item.ikv_status}
                          </span>
                        </div>
                        <div className="flex gap-5 mt-2 justify-between">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-600">
                              Tanggal
                            </span>
                            <p className="text-sm text-slate-600 w-40 truncate">
                              {item.ikv_tgl
                                ? new Date(item.ikv_tgl).toLocaleDateString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-600">
                              Ringkasan Konten:
                            </span>
                            <p className="text-sm text-slate-600 w-40 truncate">
                              {item.ikv_ringkasan}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
