import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, Clock, XCircle } from "lucide-react";

export default function TotalUploadPodcast() {
  const [loading, setLoading] = useState(true);
  const [podcastStats, setPodcastStats] = useState({
    uploaded: 0,
    pendingUpload: 0,
    notShot: 0,
  });

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/podcast");
        const data = await response.json();
        console.log("Podcast Data:", data);

        if (data.status && data.data.podcast) {
          const uploaded = data.data.podcast.filter(
            (item: any) => item.pdc_link
          ).length;
          const pendingUpload = data.data.podcast.filter(
            (item: any) => !item.pdc_link && item.pdc_jadwal_upload
          ).length;
          const notShot = data.data.podcast.filter(
            (item: any) => !item.pdc_link
          ).length;

          setPodcastStats({
            uploaded,
            pendingUpload,
            notShot,
          });
        }
      } catch (error) {
        console.error("Error fetching podcast data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, []);

  return (
    <Card className="w-96 bg-white hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Riwayat Posting Podcast
          </h2>
        </div>
      </CardHeader>
      {loading ? (
        <CardContent className="space-y-4">
          <div className="bg-gray-100 skeleton rounded-lg h-[88px]"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 skeleton rounded-lg h-[84px]"></div>
            <div className="bg-gray-100 skeleton rounded-lg h-[84px]"></div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 transform transition-transform duration-200 hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">
                  {podcastStats.uploaded}
                </p>
                <p className="text-sm text-green-100 font-medium">
                  Sudah Terupload
                </p>
              </div>
              <ArrowUpCircle className="w-10 h-10 text-green-100 opacity-80" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-4 transform transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Clock className="w-6 h-6 text-yellow-100 opacity-80" />
                  <p className="text-2xl font-bold text-white">
                    {podcastStats.pendingUpload}
                  </p>
                </div>
                <p className="text-xs text-yellow-100 font-medium mt-1">
                  Belum Diupload
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 transform transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <XCircle className="w-6 h-6 text-red-100 opacity-80" />
                  <p className="text-2xl font-bold text-white">
                    {podcastStats.notShot}
                  </p>
                </div>
                <p className="text-xs text-red-100 font-medium mt-1">
                  Belum Dishoot
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
