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
      handleDelete: async (idANC: number) => {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/analyticcontent/delete/${idANC}`
          );

          if (response.data.status) {
            window.location.reload();
            console.log(`Online Planner dengan ID ${idANC} berhasil dihapus.`);
          } else {
            console.error("Deletion failed:", response.data.message);
          }
        } catch (err) {
          console.error("Terjadi kesalahan:", error);
          setError("Gagal menghapus Online Planner");
        }
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
