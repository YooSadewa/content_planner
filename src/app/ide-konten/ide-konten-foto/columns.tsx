import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CalendarDays,
  FileText,
  BookMarked,
  Waypoints,
  Trash,
} from "lucide-react";
import Link from "next/link";
import UpdateKontenFoto from "./editdata";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
};

export const columns: ColumnDef<IdeKontenFoto>[] = [
  {
    accessorKey: "ikf_judul_konten",
    header: () => (
      <div className="flex gap-2 w-[290px] p-2">
        <Camera size={18} />
        <p>Judul Konten</p>
      </div>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        hoveredRow: number | null;
        setSelectedItem: (item: IdeKontenFoto) => void;
      };
      return (
        <div className="flex justify-between p-0 relative">
          <p className="block pt-2 ps-2 sentence-case truncate w-[290px] min-w-0">
            {row.getValue("ikf_judul_konten")}
          </p>
          {meta.hoveredRow === row.original.ikf_id && (
            <Button
              onClick={() => meta.setSelectedItem(row.original)}
              className="h-7 text-[10px] px-3 mt-1 me-1 text-white absolute right-0"
            >
              Detail
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "ikf_tgl",
    header: () => (
      <div className="flex gap-2 w-32 p-2">
        <CalendarDays size={18} />
        <p>Tanggal</p>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("ikf_tgl"));
      return <div className="w-32 p-2">{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "ikf_ringkasan",
    header: () => (
      <div className="flex gap-2 w-[290px] p-2">
        <FileText size={18} />
        <p>Ringkasan Konten</p>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[290px] truncate sentence-case p-2">
        {row.getValue("ikf_ringkasan")}
      </div>
    ),
  },
  {
    accessorKey: "ikf_referensi",
    header: () => (
      <div className="flex gap-2 w-32 p-2">
        <BookMarked size={18} />
        <p>Referensi</p>
      </div>
    ),
    cell: ({ row }) => {
      const referensi = row.getValue("ikf_referensi") as string;
      return (
        <div className="w-32 p-2">
          <Button
            variant="upload"
            className="h-5 text-[10px] px-4 text-white"
            disabled={!referensi}
          >
            {referensi ? (
              <Link href={referensi} target="_blank" rel="noopener noreferrer">
                Lihat Referensi
              </Link>
            ) : (
              <p className="px-3">Tidak Ada</p>
            )}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "ikf_id",
    header: () => (
      <div className="flex gap-2 w-32 p-2">
        <Waypoints size={18} />
        <p>Aksi</p>
      </div>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as { handleDelete: (id: number) => void };
      return (
        <div className="w-32 p-1 flex justify-between gap-1">
          <UpdateKontenFoto
            id={row.getValue("ikf_id")}
            currentName={row.getValue("ikf_judul_konten")}
            currentSummary={row.getValue("ikf_ringkasan")}
            currentReference={row.getValue("ikf_referensi")}
          />
          <Button
            className="bg-red-600 transition-all h-full duration-300 hover:bg-red-500/80 w-16 h-7"
            onClick={() => meta.handleDelete(row.getValue("ikf_id"))}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
