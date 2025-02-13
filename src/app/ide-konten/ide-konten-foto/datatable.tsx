import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
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
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash,
  Waypoints,
} from "lucide-react";
import axios from "axios";
import { columns } from "./columns";
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
  const [selectedItem, setSelectedItem] = useState<IdeKontenFoto | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [error, setError] = useState("");

  const formatNameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, 
      },
    },
    meta: {
      hoveredRow,
      setSelectedItem,
      handleDelete: async (idIkf: number) => {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/idekontenfoto/delete/${idIkf}`
          );

          if (response.data.status) {
            window.location.reload();
            console.log(`Quote dengan ID ${idIkf} berhasil dihapus.`);
          } else {
            console.error("Deletion failed:", response.data.message);
          }
        } catch (err) {
          console.error("Terjadi kesalahan:", error);
          setError("Gagal menghapus quote");
        }
      },
    },
  });

  return (
    <div className="p-2">
      <Table>
        <TableHeader>
          <TableRow className="border-t">
            {table.getHeaderGroups()[0].headers.map((header) => (
              <TableHead key={header.id} className="border-e last:border-e-0">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onMouseEnter={() => setHoveredRow(row.original.ikf_id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {row.getVisibleCells().map((cell, index) => (
                <TableCell
                  key={cell.id}
                  className={`border-e ${
                    index === row.getVisibleCells().length - 1 ? "" : "border-e"
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center w-full mt-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          className="px-2 py-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="outline"
          className="px-2 py-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
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
