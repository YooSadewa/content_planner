import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
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
import {
  BookMarked,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  LinkIcon,
} from "lucide-react";
import axios from "axios";
import { columns } from "./columns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
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
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-5 h-5 text-blue-500" />
                <SheetTitle className="sentence-case">
                  {selectedItem.ikf_judul_konten}
                </SheetTitle>
              </div>

              <Separator className="my-4" />

              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <SheetDescription className="sentence-case text-black m-0">
                    {formatNameDate(selectedItem.ikf_tgl)}
                  </SheetDescription>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <SheetDescription className="sentence-case text-black">
                        <span className="font-semibold text-gray-700 block mb-2">
                          Ringkasan Konten
                        </span>
                        <span className="text-gray-600 leading-relaxed">
                          {selectedItem.ikf_ringkasan}
                        </span>
                      </SheetDescription>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <BookMarked className="w-4 h-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <SheetDescription className="sentence-case text-black">
                        <span className="font-semibold text-gray-700 block mb-2">
                          Referensi
                        </span>
                        {selectedItem.ikf_referensi ? (
                          <Link
                            href={selectedItem.ikf_referensi}
                            className="text-blue-500 hover:text-blue-600 underline break-all"
                            target="_blank"
                          >
                            {selectedItem.ikf_referensi}
                          </Link>
                        ) : (
                          <span className="text-gray-500 italic">
                            Tidak ada referensi
                          </span>
                        )}
                      </SheetDescription>
                    </div>
                  </div>
                </div>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
