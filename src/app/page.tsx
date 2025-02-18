"use client";
import Image from "next/image";
import DashboardPodcastPage from "./podcast/dashpodcast";
import {
  Camera,
  Flame,
  MessageSquareQuote,
  Podcast,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import TotalUploadPodcast from "./podcast/detailupload";

export default function HomePage() {
  const [totalFoto, setTotalFoto] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [totalPodcast, setTotalPodcast] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalInspiring, setTotalInspiring] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async (url : any, dataKey : any) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/${url}`);
      if (response.data.status && response.data.data[dataKey]) {
        return response.data.data[dataKey].length;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  };
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [fotoCount, videoCount, podcastCount, quoteCount, inspiringCount] = await Promise.all([
          fetchData('idekontenfoto', 'ide_konten_foto'),
          fetchData('idekontenvideo', 'ide_konten_video'),
          fetchData('podcast', 'podcast'),
          fetchData('quote', 'quote'),
          fetchData('inspiringpeople', 'inspiringPeople')
        ]);
  
        setTotalFoto(fotoCount);
        setTotalVideo(videoCount);
        setTotalPodcast(podcastCount);
        setTotalQuotes(quoteCount);
        setTotalInspiring(inspiringCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set all counts to 0 in case of error
        setTotalFoto(0);
        setTotalVideo(0);
        setTotalPodcast(0);
        setTotalQuotes(0);
        setTotalInspiring(0);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllData();
  }, []);

  return (
    <div className="px-5 py-10">
      <p className="flex font-medium text-xs">
        Welcome Back, Admin
        <Image
          src={"/assets/icons/WavingHand.svg"}
          alt="waving hand icon"
          width={15}
          height={15}
          className="flex items-center"
        />
      </p>
      <h1 className="text-[32px] pt-1 font-semibold text-[#293854] mb-3">
        Dashboard
      </h1>
      <div className="w-[1030px] flex-col">
        <div className="flex gap-2 w-full p-0 mb-3">
          {loading ? (
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
              </div>

              <div className="rounded-full bg-gray-200 p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-gray-200 rounded-full p-2 w-10 h-10  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
              <div className="flex flex-col">
                <h1 className="font-semibold text-xl text-[#293854]">
                  {totalFoto > 0 ? totalFoto : "Tidak ada"}
                </h1>
                <p className="text-[10px]">Total Ide Konten Foto</p>
              </div>
              <div className="rounded-full bg-[#f7b500] p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-[#293854] rounded-full p-2">
                    <Camera color="white" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
              </div>

              <div className="rounded-full bg-gray-200 p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-gray-200 rounded-full p-2 w-10 h-10  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
              <div className="flex flex-col">
                <h1 className="font-semibold text-xl text-[#293854]">
                  {totalVideo > 0 ? totalVideo : "Tidak ada"}
                </h1>
                <p className="text-[10px]">Total Ide Konten Video</p>
              </div>
              <div className="rounded-full bg-[#f7b500] p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-[#293854] rounded-full p-2">
                    <Video color="white" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
              </div>

              <div className="rounded-full bg-gray-200 p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-gray-200 rounded-full p-2 w-10 h-10  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
              <div className="flex flex-col">
                <h1 className="font-semibold text-xl text-[#293854]">
                  {totalPodcast > 0 ? totalPodcast : "Tidak ada"}
                </h1>
                <p className="text-[10px]">Total Podcast</p>
              </div>
              <div className="rounded-full bg-[#f7b500] p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-[#293854] rounded-full p-2">
                    <Podcast color="white" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
              </div>

              <div className="rounded-full bg-gray-200 p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-gray-200 rounded-full p-2 w-10 h-10  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
              <div className="flex flex-col">
                <h1 className="font-semibold text-xl text-[#293854]">
                  {totalQuotes > 0 ? totalQuotes : "Tidak ada"}
                </h1>
                <p className="text-[10px]">Total Quote</p>
              </div>
              <div className="rounded-full bg-[#f7b500] p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-[#293854] rounded-full p-2">
                    <MessageSquareQuote color="white" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4 animate-pulse">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
              </div>

              <div className="rounded-full bg-gray-200 p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-gray-200 rounded-full p-2 w-10 h-10  "></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl hover:shadow-lg transition-shadow duration-300 bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
              <div className="flex flex-col">
                <h1 className="font-semibold text-xl text-[#293854]">
                  {totalInspiring > 0 ? totalInspiring : "Tidak ada"}
                </h1>
                <p className="text-[10px]">Total Inspiring People</p>
              </div>
              <div className="rounded-full bg-[#f7b500] p-[1px]">
                <div className="bg-white rounded-full p-[2px]">
                  <div className="bg-[#293854] rounded-full p-2">
                    <Flame color="white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1 h-fit">
          <DashboardPodcastPage />
          <TotalUploadPodcast />
        </div>
      </div>
    </div>
  );
}
