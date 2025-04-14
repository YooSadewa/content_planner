import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tableplanner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Analytic } from "./columns";
import Swal from "sweetalert2";

interface DataTableAnalyticProps {
  data: Analytic[];
  columns: ColumnDef<Analytic>[];
  isLoading?: boolean; // Add loading prop
}

export default function DataTableAnalytic({
  data,
  columns,
  isLoading = false, // Default to false
}: DataTableAnalyticProps) {
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [monthSort, setMonthSort] = useState<"none" | "asc" | "desc">("none");

  // Memoized sorting function to prevent unnecessary re-renders
  const sortedData = useMemo(() => {
    if (monthSort === "none") return data;

    return [...data].sort((a, b) => {
      const dateA = new Date(a.anc_tanggal);
      const dateB = new Date(b.anc_tanggal);
      const monthA = dateA.getMonth();
      const monthB = dateB.getMonth();

      return monthSort === "asc" ? monthA - monthB : monthB - monthA;
    });
  }, [data, monthSort]); // Only re-sort when data or monthSort changes

  // Inside DataTableAnalytic component
  const table = useReactTable({
    data: sortedData,
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
      handleDelete: async (ancId: number) => {
        try {
          // Find the record to get lup_id and date
          const record = sortedData.find((item) => item.anc_id === ancId);

          if (!record) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Data tidak ditemukan",
            });
            return;
          }

          const { lup_id, anc_tanggal } = record;

          // Use SweetAlert for confirmation
          const result = await Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin menghapus semua data analisis untuk konten ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
          });

          // If the user clicked "Cancel" button
          if (!result.isConfirmed) {
            return;
          }

          // Show loading state
          Swal.fire({
            title: "Memproses...",
            text: "Sedang menghapus data",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // Call the API with lup_id and date parameters
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/analyticcontent/delete/${lup_id}/${anc_tanggal}`
          );

          if (response.data.status) {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: `Data analitik berhasil dihapus.`,
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text: response.data.message || "Gagal menghapus data",
            });
          }
        } catch (err: any) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.message || "Terjadi kesalahan saat menghapus data",
          });
          console.error("Terjadi kesalahan:", err);
        }
      },
      setSelectedItem: (id: number) => {
        // Your existing logic for selecting an item if needed
      },
    },
  });

  // Loading state handler
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4 text-xs">
        <span className="font-medium">Sort by Month:</span>
        <Select
          value={monthSort}
          onValueChange={(value: "none" | "asc" | "desc") => {
            // Prevent unnecessary state updates
            if (value !== monthSort) {
              setMonthSort(value);
            }
          }}
        >
          <SelectTrigger className="w-[180px] h-[30px]">
            <SelectValue placeholder="Select Sort Order">
              {monthSort === "none" && "No Sort"}
              {monthSort === "asc" && "Ascending (Jan-Des)"}
              {monthSort === "desc" && "Descending (Des-Jan)"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sort</SelectItem>
            <SelectItem value="asc">Ascending (Jan-Dec)</SelectItem>
            <SelectItem value="desc">Descending (Dec-Jan)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No data available</div>
      ) : (
        <>
          <div className="rounded-lg border overflow-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-center border-e"
                    >
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
                    onMouseEnter={() => setHoveredRow(row.original.anc_id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`border-t ${
                          index === row.getVisibleCells().length - 1
                            ? ""
                            : "border-t border-e"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => table.previousPage()}
                    aria-disabled={!table.getCanPreviousPage()}
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
                    aria-disabled={!table.getCanNextPage()}
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
        </>
      )}
    </div>
  );
}
