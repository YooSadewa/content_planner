import EditPodcast from "@/components/(Podcast)/Podcast/EditData";
import { AbstractAlert } from "@/components/AbstractAlert";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { FilePenLine, Speech, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Podcast = {
  host_id: number;
  host_nama: string;
  pdc_abstrak: string;
  pdc_catatan: string;
  pdc_id: number;
  pdc_jadwal_shoot: string;
  pdc_jadwal_upload: string;
  pdc_link: string;
  pdc_nama: string;
  pdc_tema: string;
  pmb_id: number;
};

export const columns: ColumnDef<Podcast>[] = [
  {
    accessorKey: "pdc_id",
    accessorFn: (row) =>
      `${row.host_nama} ${row.pdc_abstrak} ${row.pdc_catatan} ${row.pdc_jadwal_shoot} ${row.pdc_jadwal_upload} ${row.pdc_link} ${row.pdc_nama} ${row.pdc_tema}`,
    header: "",
    cell: ({ row, table }) => {
      const idPodcast = row.original.pdc_id;
      const title = row.original.pdc_tema;
      const abstractContent = row.original.pdc_abstrak;
      const speaker = row.original.pdc_nama;
      const host = row.original.host_nama;
      const shootDate = row.original.pdc_jadwal_shoot;
      const uploadDate = row.original.pdc_jadwal_upload;
      const notes = row.original.pdc_catatan;
      const link = row.original.pdc_link;
      const meta = table.options.meta as any;
      const isLoading = meta?.loading || false;
      return (
        <>
          <div className="flex flex-row ps-1 pt-1 gap-4">
            <div className="w-full h-fit shadow-md rounded p-7 bg-white">
              <div className="">
                <h1 className="font-bold text-3xl capitalize truncate">
                  {title}
                </h1>
                <AbstractAlert
                  title={title}
                  content={abstractContent || "Abstract content tidak tersedia"}
                  notes={notes || "Catatan tidak tersedia"}
                />
              </div>
              <div className="flex gap-2 mt-2 justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-[16px]">
                    <Speech />
                    <p className="flex items-center gap-1">
                      Pembicara:{" "}
                      <span className="font-semibold capitalize">
                        {speaker}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-row gap-1 text-[16px]">
                    <Image
                      src={"/assets/icons/mic.png"}
                      alt="Mic"
                      width={200}
                      height={200}
                      className="w-5 h-5"
                    />
                    <p className="flex items-center gap-1 ps-1">
                      Host:{" "}
                      <span className="font-semibold capitalize">{host}</span>
                    </p>
                  </div>
                </div>
                <span className="w-[1px] h-12 my-auto bg-[#f7b500]" />
                <div className="flex flex-col text-[16px] justify-center items-end gap-1">
                  <p>
                    Jadwal Shoot:{" "}
                    <span className="font-semibold">{shootDate}</span>
                  </p>
                  <p>
                    Jadwal Upload:{" "}
                    <span className="font-semibold">{uploadDate}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                {link ? (
                  <Button variant="upload" size="sm">
                    <Link href={link}>Lihat Podcast</Link>
                  </Button>
                ) : (
                  <Button
                    variant="notupload"
                    size="sm"
                    onClick={() => {
                      meta.onUpload(idPodcast);
                    }}
                  >
                    Verifikasi Upload
                  </Button>
                )}
                <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
                <EditPodcast
                  id={idPodcast}
                  currentName={title}
                  currentAbstract={abstractContent}
                  currentHost={host}
                  currentLink={link}
                  currentNote={notes}
                  currentShoot={shootDate}
                  currentSpeaker={speaker}
                  currentUpload={uploadDate}
                />
                <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
                <Button
                  size="sm"
                  className="bg-red-600 transition-all duration-300 hover:bg-red-500/80"
                  onClick={() => meta.onDelete(idPodcast)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    },
  },
];
