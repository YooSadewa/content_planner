import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tablecontent";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { columns } from "./columns";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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

type DataTableProps = {
  data: IdeKontenVideo[];
  onOpen: (id: number) => void;
};

export function DataTableVideo({ data }: DataTableProps) {
  const [selectedItem, setSelectedItem] = useState<IdeKontenVideo | null>(null);
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
            `http://127.0.0.1:8000/api/idekontenvideo/delete/${idIkf}`
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
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-100 text-green-700 capitalize";
      case "on hold":
        return "bg-blue-100 text-yellow-700 capitalize";
      default:
        return "bg-yellow-100 text-black capitalize";
    }
  };
  return (
    <div className="p-2">
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
                onMouseEnter={() => setHoveredRow(row.original.ikv_id)}
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
                  {selectedItem.ikv_judul_konten}
                </SheetTitle>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <SheetDescription className="sentence-case text-black m-0">
                    {formatNameDate(selectedItem.ikv_tgl)}
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
                          {selectedItem.ikv_ringkasan}
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
                        {selectedItem.ikv_pic}
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
                          selectedItem.ikv_status
                        )}`}
                      >
                        {selectedItem.ikv_status}
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
                      <Link
                        href={`http://localhost:8000/uploads/${selectedItem.ikv_skrip}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        Unduh Skrip
                      </Link>
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
                        {selectedItem.ikv_upload
                          ? selectedItem.ikv_upload
                          : "Belum diupload"}
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
