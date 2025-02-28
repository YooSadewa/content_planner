import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  FileText,
  Waypoints,
  Trash,
  User,
  CalendarCheck,
  ScrollText,
  CalendarArrowUp,
  Hourglass,
  PauseCircle,
  CheckCircle,
  ArrowBigDownDash,
  Link,
  Video,
} from "lucide-react";
import Link2 from "next/link";
import { ConfirmUpload } from "./uploadcontent";

type IdeKontenVideo = {
  ikv_id: number;
  ikv_tgl: string;
  ikv_judul_konten: string;
  ikv_ringkasan: string;
  ikv_referensi: string;
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
      const statusConfig: Record<
        string,
        { icon: React.ReactNode; className: string }
      > = {
        scheduled: {
          icon: <Hourglass className="w-4 h-4 mr-1" />,
          className: "border-yellow-500 ",
        },
        "on hold": {
          icon: <PauseCircle className="w-4 h-4 mr-1" />,
          className: "border-blue-500 ",
        },
        done: {
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
          className: "border-green-500 ",
        },
      };

      const { icon, className } = statusConfig[status] || {
        icon: <Hourglass className="w-4 h-4 mr-1" />,
        className: "bg-gray-500 text-white",
      };

      return (
        <div className="w-44 p-1 flex items-center justify-center">
          <div
            className={`h-8 w-full flex items-center justify-center capitalize font-semibold text-sm px-4 rounded-xl border-2 ${
              className || ""
            }`}
          >
            {icon}
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
        <div className="w-36 p-1 flex items-center justify-center">
          {row.getValue("ikv_skrip") ? (
            <Button className="h-8 w-full flex items-center justify-center capitalize font-semibold text-xs px-4 rounded-xl border-2 bg-blue-500 hover:bg-blue-600">
              <ArrowBigDownDash />
              <Link2
                href={`http://localhost:8000/uploads/${row.getValue(
                  "ikv_skrip"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Unduh Skrip
              </Link2>
            </Button>
          ) : (
            <span className="text-black text-xs font-medium mt-2">
              Tidak Ada Skrip
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "ikv_referensi",
    header: () => (
      <div className="flex gap-2 w-36 p-2">
        <ScrollText size={18} />
        <p>Referensi</p>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-36 p-1 flex items-center justify-center text-xs font-medium">
          {row.getValue("ikv_referensi") ? (
            <Button className="h-8 w-full flex items-center justify-center capitalize font-semibold text-xs px-4 rounded-xl border-2 bg-purple-500 hover:bg-purple-600">
              <Link />
              <Link2
                href={row.getValue("ikv_referensi")}
                target="_blank"
                className="text-white"
              >
                Lihat Referensi
              </Link2>
            </Button>
          ) : (
            <span className="text-black text-xs font-medium mt-2">
              Tidak Ada Referensi
            </span>
          )}
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
        status: row.getValue("ikv_status"),
      });
      return (
        <div className="w-32 p-1 flex justify-between gap-1">
          {/* <UpdateKontenFoto
            id={row.getValue("ikv_id")}
            currentName={row.getValue("ikv_judul_konten")}
            currentSummary={row.getValue("ikv_ringkasan")}
            currentPic={row.getValue("ikv_pic")}
            currentScript={row.getValue("ikv_skrip")}
            currentStatus={row.getValue("ikv_status")}
          /> */}
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
