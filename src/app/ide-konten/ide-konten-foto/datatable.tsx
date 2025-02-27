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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertCircle,
  BookMarked,
  Calendar,
  CalendarArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  LinkIcon,
  User,
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
  ikf_pic: string;
  ikf_status: string;
  ikf_skrip: string;
  ikf_referensi: string;
  ikf_upload: string;
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
  const getStatusColor = (status: any) => {
    if (!status || typeof status !== "string") {
      return "bg-gray-100 text-gray-700 capitalize";
    }

    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-100 text-green-700 capitalize";
      case "on hold":
        return "bg-blue-100 text-blue-700 capitalize";
      default:
        return "bg-yellow-100 text-black capitalize";
    }
  };

  return (
    <div className="px-2">
      <div className="w-[975px] overflow-x-auto">
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
                      index === row.getVisibleCells().length - 1
                        ? ""
                        : "border-e"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full mt-6 py-[7px] pe-1 mb-[22px]">
        <Pagination>
          <PaginationContent>
            <PaginationItem className="cursor-pointer">
              <PaginationPrevious
                aria-disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => table.setPageIndex(i)}
                  isActive={table.getState().pagination.pageIndex === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onClick={() => table.nextPage()}
                aria-disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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

              <div className="space-y-4">
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
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <SheetDescription className="sentence-case">
                      <span className="font-semibold text-gray-700">
                        Person In Charge:{" "}
                      </span>
                      <span className="text-gray-600">
                        {selectedItem.ikf_pic}
                      </span>
                    </SheetDescription>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-gray-500" />
                    <SheetDescription className="sentence-case">
                      <span className="font-semibold text-gray-700">
                        Status Pengerjaan:{" "}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                          selectedItem.ikf_status
                        )}`}
                      >
                        {selectedItem.ikf_status}
                      </span>
                    </SheetDescription>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <SheetDescription className="sentence-case">
                      <span className="font-semibold text-gray-700">
                        Skrip Konten:{" "}
                      </span>
                      {selectedItem.ikf_skrip ? (
                        <Link
                          href={`http://localhost:8000/uploads/${selectedItem.ikf_skrip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline"
                        >
                          Unduh Skrip
                        </Link>
                      ) : (
                        <span className="text-gray-500 italic">
                          Tidak ada skrip
                        </span>
                      )}
                    </SheetDescription>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <SheetDescription className="sentence-case">
                      <span className="font-semibold text-gray-700">
                        Referensi:{" "}
                      </span>
                      {selectedItem.ikf_referensi ? (
                        <Link
                          href={selectedItem.ikf_referensi}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline"
                        >
                          Lihat Referensi
                        </Link>
                      ) : (
                        <span className="text-gray-500 italic">
                          Tidak ada referensi
                        </span>
                      )}
                    </SheetDescription>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CalendarArrowUp className="w-4 h-4 text-gray-500" />
                    <SheetDescription className="sentence-case">
                      <span className="font-semibold text-gray-700">
                        Tanggal Upload:{" "}
                      </span>
                      <span className="text-gray-600">
                        {selectedItem.ikf_upload ? (
                          selectedItem.ikf_upload
                        ) : (
                          <span className="text-gray-500 italic">
                            Belum Diupload
                          </span>
                        )}
                      </span>
                    </SheetDescription>
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
