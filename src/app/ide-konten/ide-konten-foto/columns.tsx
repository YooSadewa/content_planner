import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CalendarDays,
  FileText,
  BookMarked,
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
  Eye,
} from "lucide-react";
import Link2 from "next/link";
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
    accessorKey: "ikf_pic",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <User size={18} />
        <p>Person In Charge</p>
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-44 truncate sentence-case p-2">
        {row.getValue("ikf_pic")}
      </div>
    ),
  },
  {
    accessorKey: "ikf_status",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <CalendarCheck size={18} />
        <p>Status Pengerjaan</p>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("ikf_status") as string;
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
    accessorKey: "ikf_skrip",
    header: () => (
      <div className="flex gap-2 w-36 p-2">
        <ScrollText size={18} />
        <p>Skrip Konten</p>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-36 p-1 flex items-center justify-center">
          {row.getValue("ikf_skrip") ? (
            <Button className="h-8 w-full flex items-center justify-center capitalize font-semibold text-xs px-4 rounded-xl border-2 bg-blue-500 hover:bg-blue-600">
              <ArrowBigDownDash />
              <Link2
                href={`http://localhost:8000/uploads/${row.getValue(
                  "ikf_skrip"
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
    accessorKey: "ikf_referensi",
    header: () => (
      <div className="flex gap-2 w-36 p-2">
        <ScrollText size={18} />
        <p>Referensi</p>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="w-36 p-1 flex items-center justify-center text-xs font-medium">
          {row.getValue("ikf_referensi") ? (
            <Button className="h-8 w-full flex items-center justify-center capitalize font-semibold text-xs px-4 rounded-xl border-2 bg-purple-500 hover:bg-purple-600">
              <Link />
              <Link2
                href={row.getValue("ikf_referensi")}
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
    accessorKey: "ikf_upload",
    header: () => (
      <div className="flex gap-2 w-44 p-2">
        <CalendarArrowUp size={18} />
        <p>Tanggal Upload</p>
      </div>
    ),
    cell: ({ row }) => {
      const id = row.original.ikf_id;
      const uploadDate = row.getValue("ikf_upload");

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
          {/* {!uploadDate && <ConfirmUpload id={id} />} */}
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
      const meta = table.options.meta as {
        handleDelete: (id: number) => void;
        setSelectedItem: (id: number) => void;
      };

      return (
        <div className="w-40 p-1 flex justify-between gap-1">
          <Button
            onClick={() => meta.setSelectedItem(row.original as any)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 h-8 text-xs px-3 rounded-md"
          >
            <Eye size={16} />
          </Button>
          <span className="w-[1px] h-6 bg-yellow-500 my-auto" />
          <Button
            onClick={() => meta.setSelectedItem(row.original as any)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 h-8 text-xs px-3 rounded-md"
          >
            <Eye size={16} />
          </Button>
          <UpdateKontenFoto
            id={row.getValue("ikf_id")}
            currentName={row.getValue("ikf_judul_konten")}
            currentSummary={row.getValue("ikf_ringkasan")}
            currentPic={row.getValue("ikf_pic")}
            currentScript={row.getValue("ikf_skrip")}
            currentStatus={row.getValue("ikf_status")}
          />
          <span className="w-[1px] h-6 bg-yellow-500 my-auto" />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 h-8 text-xs px-3 rounded-md"
            onClick={() => meta.handleDelete(row.getValue("ikf_id"))}
          >
            <Trash size={16} />
          </Button>
        </div>
      );
    },
  },
];
