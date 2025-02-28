"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { DataTable } from "./ide-konten-foto/datatable";
import { DataTableVideo } from "./ide-konten-video/datatable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateKontenFoto from "./ide-konten-foto/adddata";
import CreateKontenVideo from "./ide-konten-video/adddata";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IdeKontenPage() {
  const [tableData, setTableData] = useState([]);
  const [tableDataVideo, setTableDataVideo] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("foto");

  useEffect(() => {
    const fetchIdeFoto = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenfoto"
        );
        if (response.data.status && response.data.data.ide_konten_foto) {
          console.log("Ide Konten Foto: ", response.data.data.ide_konten_foto);
          const sortOrder = ["scheduled", "on hold", "done"];
          const sortedData = response.data.data.ide_konten_foto.sort(
            (a: any, b: any) => {
              return (
                sortOrder.indexOf(a.ikf_status) -
                sortOrder.indexOf(b.ikf_status)
              );
            }
          );
          setTableData(sortedData);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeFoto();
  }, []);

  useEffect(() => {
    const fetchIdeVideo = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/idekontenvideo"
        );
        if (response.data.status && response.data.data.ide_konten_video) {
          console.log("Ide Konten Video: ", response.data.data.ide_konten_video);
          const sortOrder = ["scheduled", "on hold", "done"];
          const sortedData = response.data.data.ide_konten_video.sort(
            (a: any, b: any) => {
              return (
                sortOrder.indexOf(a.ikv_status) -
                sortOrder.indexOf(b.ikv_status)
              );
            }
          );
          setTableDataVideo(sortedData);
        } else {
          setError("Format data tidak sesuai");
        }
      } catch (err) {
        setError("Gagal mengambil data dari API.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeVideo();
  }, []);

  const onOpen = async (idFoto: number) => {
    setModalOpen(true);
    setSelectedId(idFoto);
  };

  return (
    <div className="w-[1050px]">
      <div className="p-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/ide-konten">Ide Konten</BreadcrumbLink>
            </Bread>
          </div>
          <div className="flex gap-1">
            <CreateKontenFoto />
            <CreateKontenVideo />
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-white">
          <Tabs
            defaultValue="foto"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between px-5 pt-5">
              <h1 className="font-bold text-2xl ps-1 text-[#293854] me-auto mb-4 flex items-center">
                Riwayat Ide Konten
              </h1>
              <TabsList className="mb-4 flex gap-1 bg-white w-fit rounded-lg shadow-[0_0_7px_rgba(0,0,0,0.1)] mx-3">
                <TabsTrigger
                  value="foto"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 
                   hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Ide Konten Foto
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 
                hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Ide Konten Video
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="foto"
              className="px-3 flex flex-col items-center"
            >
              {loading ? (
                <div className="p-2">
                  <div className="w-[975px] h-[240px] bg-gray-100 skeleton rounded-none"></div>
                  <div className="w-full mt-8 py-[8px] pe-1 mb-3">
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
                            <Button size="icon" variant="outline" disabled>
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
              ) : tableData.length > 0 ? (
                <DataTable data={tableData} onOpen={onOpen} />
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Image
                      src={"/assets/nodata.svg"}
                      alt="no data"
                      width={300}
                      height={300}
                      className=""
                    />
                    <p className="font-medium text-sm">Data Tidak Ditemukan</p>
                  </div>
                  <div className="w-full pe-2 mb-5 mt-1 pt-1">
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
                            <Button size="icon" variant="outline" disabled>
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
                </>
              )}
            </TabsContent>

            <TabsContent
              value="video"
              className="px-3 flex flex-col items-center"
            >
              {loading ? (
                <div className="p-2">
                  <div className="w-[975px] h-[240px] bg-gray-100 skeleton rounded-none"></div>
                  <div className="w-full mt-8 py-[8px] pe-1 mb-3">
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
                            <Button size="icon" variant="outline" disabled>
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
              ) : tableDataVideo.length > 0 ? (
                <DataTableVideo data={tableDataVideo} onOpen={onOpen} />
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3 py-6">
                    <Image
                      src={"/assets/nodata.svg"}
                      alt="no data"
                      width={300}
                      height={300}
                      className=""
                    />
                    <p className="font-medium text-sm">Data Tidak Ditemukan</p>
                  </div>
                  <div className="w-full pe-2 mb-7 mt-3 pt-1">
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
                            <Button size="icon" variant="outline" disabled>
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
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
