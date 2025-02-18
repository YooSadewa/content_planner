"use client";
import Image from "next/image";
import DashboardPodcastPage from "./podcast/dashpodcast";
import {
  Camera,
  Flame,
  MessageSquareQuote,
  Podcast,
  Quote,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const [totalFoto, setTotalFoto] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [totalPodcast, setTotalPodcast] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalInspiring, setTotalInspiring] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoto = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenfoto"
        );

        if (response.data.status && response.data.data.ide_konten_foto) {
          const fotoCount = response.data.data.ide_konten_foto.length;
          setTotalFoto(fotoCount);
        } else {
          setTotalFoto(0);
        }
      } catch (err) {
        setTotalFoto(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFoto();
  }, []);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenvideo"
        );

        if (response.data.status && response.data.data.ide_konten_video) {
          const videoCount = response.data.data.ide_konten_video.length;
          setTotalVideo(videoCount);
        } else {
          setTotalVideo(0);
        }
      } catch (err) {
        setTotalVideo(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);
  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/podcast");

        if (response.data.status && response.data.data.podcast) {
          const podcastCount = response.data.data.podcast.length;
          setTotalPodcast(podcastCount);
        } else {
          setTotalPodcast(0);
        }
      } catch (err) {
        setTotalPodcast(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, []);
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/quote");

        if (response.data.status && response.data.data.quote) {
          const quoteCount = response.data.data.quote.length;
          setTotalQuotes(quoteCount);
        } else {
          setTotalQuotes(0);
        }
      } catch (err) {
        setTotalQuotes(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);
  useEffect(() => {
    const fetchInspiring = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/inspiringpeople"
        );

        if (response.data.status && response.data.data.inspiringPeople) {
          const inspiringCount = response.data.data.inspiringPeople.length;
          setTotalInspiring(inspiringCount);
        } else {
          setTotalInspiring(0);
        }
      } catch (err) {
        setTotalInspiring(0);
      } finally {
        setLoading(false);
      }
    };

    fetchInspiring();
  }, []);
  return (
    <div className="px-5 py-10">
      <p className="flex font-medium text-xs">
        Welcome Back, User
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
        {loading ? (
          <div className="flex gap-2 w-full p-0 mb-3">
            <div className="rounded-xl bg-white shadow-md w-[20%] h-20 skeleton"></div>
            <div className="rounded-xl bg-white shadow-md w-[20%] h-20 skeleton"></div>
            <div className="rounded-xl bg-white shadow-md w-[20%] h-20 skeleton"></div>
            <div className="rounded-xl bg-white shadow-md w-[20%] h-20 skeleton"></div>
            <div className="rounded-xl bg-white shadow-md w-[20%] h-20 skeleton"></div>
          </div>
        ) : (
          <div className="flex gap-2 w-full p-0 mb-3">
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
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
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
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
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
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
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
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
            <div className="rounded-xl bg-white shadow-[0_0_7px_rgba(0,0,0,0.1)] w-[20%] h-20 py-2 flex items-center gap-2 justify-between px-4">
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
          </div>
        )}

        <div className="flex">
          <DashboardPodcastPage />
          <div className="bg-white drop-shadow-md rounded-xl p-2 w-[30%] h-52"></div>
        </div>
      </div>
    </div>
  );
}
