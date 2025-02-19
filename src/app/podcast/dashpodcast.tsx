import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Podcast, Upload, Video } from "lucide-react";
import Link from "next/link";

export default function DashboardPodcastPage({ podcasts }: any) {
  const formatDate = (dateString : any) => {
    if (!dateString) return "Belum ditentukan";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatus = (podcast : any) => {
    if (!podcast.pdc_jadwal_shoot) {
      return { text: "Belum Dijadwalkan", color: "red" };
    }
    if (!podcast.pdc_link) {
      return { text: "Belum Dishoot", color: "red" };
    }
    return { text: "Sudah Dishoot", color: "green" };
  };

  const getUploadStatus = (podcast : any) => {
    if (!podcast.pdc_jadwal_upload) {
      return { text: "Belum Dijadwalkan", color: "orange" };
    }
    if (!podcast.pdc_link) {
      return { text: "Belum Diupload", color: "orange" };
    }
    return { text: "Sudah Diupload", color: "green" };
  };

  return (
    <Card className="w-[650px] bg-white hover:shadow-lg transition-shadow duration-300 h-[500px]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Podcast</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {podcasts.map((podcast : any, index : any) => (
          <Link href={"/podcast"} key={podcast.pdc_id}>
            <div className="mb-2 h-32 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <span
                      className={`w-3 h-3 bg-${
                        getStatus(podcast).color
                      }-500 rounded-full absolute animate-pulse`}
                    ></span>
                    <div
                      className={`w-12 h-12 bg-${
                        getStatus(podcast).color
                      }-50 rounded-lg flex items-center justify-center`}
                    >
                      <Podcast
                        className={`w-6 h-6 text-${
                          getStatus(podcast).color
                        }-500`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                      {podcast.pdc_tema || "Nama Podcast"}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-3 py-1 bg-${
                          getStatus(podcast).color
                        }-50 text-${
                          getStatus(podcast).color
                        }-600 rounded-full text-xs font-medium`}
                      >
                        {getStatus(podcast).text}
                      </span>
                      <span
                        className={`px-3 py-1 bg-${
                          getUploadStatus(podcast).color
                        }-50 text-${
                          getUploadStatus(podcast).color
                        }-600 rounded-full text-xs font-medium`}
                      >
                        {getUploadStatus(podcast).text}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">
                      <span className="font-medium">Tanggal Shoot:</span>{" "}
                      {formatDate(podcast.pdc_jadwal_shoot)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      <span className="font-medium">Tanggal Upload:</span>{" "}
                      {formatDate(podcast.pdc_jadwal_upload)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
