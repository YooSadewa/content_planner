import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  BookMarked,
  CalendarArrowUp,
  CalendarCheck,
  CalendarDays,
  Camera,
  FileText,
  ScrollText,
  Trash,
  Upload,
  User,
  Video,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import UpdateKontenFoto from "../ide-konten-foto/editdata";
import { ConfirmUpload } from "./uploadcontent";
import UpdateKontenVideo from "./editdata";

type IdeKontenVideo = {
  ikv_id: number;
  ikv_tgl: string;
  ikv_judul_konten: string;
  ikv_ringkasan: string;
  ikv_pic: string;
  ikv_status: string;
  ikv_skrip: string;
  ikv_upload: string;
};

export const columns: ColumnDef<IdeKontenVideo>[] = [
  {
    accessorKey: "ikv_judul_konten",
    header: () => (
      <div className="flex gap-2 w-[290px] p-2">
        <Video size={18} />
        <p>Judul Konten</p>
      </div>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        hoveredRow: number | null;
        setSelectedItem: (item: IdeKontenVideo) => void;
      };
      return (
        <div className="flex justify-between p-0 relative">
          <p className="block pt-2 ps-2 sentence-case truncate w-[290px] min-w-0">
            {row.getValue("ikv_judul_konten")}
          </p>
          {meta.hoveredRow === row.original.ikv_id && (
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
    accessorKey: "ikv_tgl",
    header: () => (
      <div className="flex gap-2 w-32 p-2">
        <CalendarDays size={18} />
        <p>Tanggal</p>
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("ikv_tgl"));
      return <div className="w-32 p-2">{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    accessorKey: "ikv_ringkasan",
    header: () => (
      <div className="flex gap-2 w-[290px] p-2">
        <FileText size={18} />
        <p>Ringkasan Konten</p>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[290px] truncate sentence-case p-2">
        {row.getValue("ikv_ringkasan")}
      </div>
    ),
  },
  {
    accessorKey: "ikv_pic",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <User size={18} />
        <p>Person In Charge</p>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-44 truncate sentence-case p-2">
        {row.getValue("ikv_pic")}
      </div>
    ),
  },
  {
    accessorKey: "ikv_status",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <CalendarCheck size={18} />
        <p>Status Pengerjaan</p>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("ikv_status") as string;
      const statusColors: Record<string, string> = {
        scheduled: "bg-yellow-500 text-white",
        "on hold": "bg-blue-500 text-white",
        done: "bg-green-500 text-white",
      };

      return (
        <div className="w-44 p-2 flex items-center justify-center">
          <div
            className={`h-5 w-full flex items-center justify-center capitalize font-semibold text-[10px] px-4 rounded ${
              statusColors[status] || "bg-gray-200 text-black"
            }`}
          >
            {status}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "ikv_skrip",
    header: () => (
      <div className="flex gap-2 w-36 p-2">
        <ScrollText size={18} />
        <p>Skrip Konten</p>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-36 p-2 flex items-center justify-center">
          <Button
            variant="upload"
            className="h-5 w-full text-[10px] px-4 text-white flex items-center font-semibold justify-center"
          >
            <Link
              href={`http://localhost:8000/uploads/${row.getValue(
                "ikv_skrip"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Unduh Skrip
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "ikv_upload",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <CalendarArrowUp size={18} />
        <p>Tanggal Upload</p>
      </div>
    ),
    cell: ({ row }) => {
      const id = row.original.ikv_id;
      const uploadDate = row.getValue("ikv_upload");

      const formattedDate =
        uploadDate &&
        (typeof uploadDate === "string" || typeof uploadDate === "number")
          ? new Date(uploadDate).toLocaleDateString("id-ID")
          : "Belum diupload";

      return (
        <div
          className={`w-44 px-2 flex items-center gap-2 justify-around ${
            uploadDate ? "py-2" : "py-1"
          }`}
        >
          <span className="me-auto">{formattedDate}</span>
          {!uploadDate && <ConfirmUpload id={id} />}
        </div>
      );
    },
  },
  {
    accessorKey: "ikv_id",
    header: () => (
      <div className="flex gap-2 w-32 p-2">
        <Waypoints size={18} />
        <p>Aksi</p>
      </div>
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as { handleDelete: (id: number) => void };
      console.log({
        skrip: row.getValue("ikv_skrip"),
        status: row.getValue("ikv_status")
      });
      return (
        <div className="w-32 p-1 flex justify-between gap-1">
          <UpdateKontenVideo
            id={row.getValue("ikv_id")}
            currentName={row.getValue("ikv_judul_konten")}
            currentSummary={row.getValue("ikv_ringkasan")}
            currentPic={row.getValue("ikv_pic")}
            currentScript={row.getValue("ikv_skrip")}
            currentStatus={row.getValue("ikv_status")}
          />
          <Button
            className="bg-red-600 transition-all h-full duration-300 hover:bg-red-500/80 w-16 h-7"
            onClick={() => meta.handleDelete(row.getValue("ikv_id"))}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
