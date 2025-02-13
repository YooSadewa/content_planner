import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tablecontent";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookMarked,
  CalendarDays,
  Camera,
  FileText,
  Pencil,
  Trash,
  Waypoints,
} from "lucide-react";
import axios from "axios";
import UpdateKontenFoto from "./editdata";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
  created_at: string;
  updated_at: string;
};

type DataTableProps = {
  data: IdeKontenFoto[];
  onOpen: (id: number) => void;
};

export function DataTable({ data }: DataTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID");
  };
  const formatNameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const [selectedItem, setSelectedItem] = useState<IdeKontenFoto | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const handleDelete = async (idIkf: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/idekontenfoto/delete/${idIkf}`
      );

      if (response.data.status) {
        setTableData((prevData) =>
          prevData.filter(
            (kontenFoto: IdeKontenFoto) => kontenFoto.ikf_id !== idIkf
          )
        );
        window.location.reload();
        console.log(`Quote dengan ID ${idIkf} berhasil dihapus.`);
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", error);
      setError("Gagal menghapus quote");
    }
  };

  return (
    <div className="p-2">
      <Table>
        <TableHeader>
          <TableRow className="border-t">
            <TableHead className="flex gap-2 w-[290px] border-e">
              <Camera size={18} />
              <p>Judul Konten</p>
            </TableHead>
            <TableHead className="flex gap-2 w-32 border-e">
              <CalendarDays size={18} />
              <p>Tanggal</p>
            </TableHead>
            <TableHead className="flex gap-2 w-[290px] border-e">
              <FileText size={18} />
              <p>Ringkasan Konten</p>
            </TableHead>
            <TableHead className="flex gap-2 w-32 border-e">
              <BookMarked size={18} />
              <p>Referensi</p>
            </TableHead>
            <TableHead className="flex gap-2 w-32">
              <Waypoints size={18} />
              <p>Aksi</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.ikf_id}
              onMouseEnter={() => setHoveredRow(item.ikf_id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="border-e flex justify-between p-0 relative">
                <p className="block pt-2 ps-2 sentence-case truncate w-[290px] min-w-0">
                  {item.ikf_judul_konten}
                </p>
                {hoveredRow === item.ikf_id && (
                  <Button
                    onClick={() => setSelectedItem(item)}
                    className="h-7 text-[10px] px-3 mt-1 me-1 text-white absolute right-0"
                  >
                    Detail
                  </Button>
                )}
              </TableCell>

              <TableCell className="w-32 border-e">
                {formatDate(item.ikf_tgl)}
              </TableCell>
              <TableCell className="w-[290px] truncate border-e sentence-case">
                {item.ikf_ringkasan}
              </TableCell>
              <TableCell className="w-32 border-e">
                <Button
                  variant="upload"
                  className="h-5 text-[10px] px-4 text-white"
                  disabled={!item.ikf_referensi}
                >
                  {item.ikf_referensi ? (
                    <Link
                      href={item.ikf_referensi}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat Referensi
                    </Link>
                  ) : (
                    <p className="px-3">Tidak Ada</p>
                  )}
                </Button>
              </TableCell>

              <TableCell className="w-32 p-1 flex justify-between gap-1">
                <UpdateKontenFoto
                  id={item.ikf_id}
                  currentName={item.ikf_judul_konten}
                  currentSummary={item.ikf_ringkasan}
                  currentReference={item.ikf_referensi}
                />
                <Button
                  className="bg-red-600 transition-all h-full duration-300 hover:bg-red-500/80 w-16 h-7"
                  onClick={() => handleDelete(item.ikf_id)}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedItem && (
        <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="sentence-case">
                {selectedItem.ikf_judul_konten}
              </SheetTitle>
              <SheetDescription className="sentence-case text-black">
                {formatNameDate(selectedItem.ikf_tgl)}
              </SheetDescription>
              <SheetDescription className="sentence-case">
                {selectedItem.ikf_ringkasan}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
