import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { OnlineContent } from "./columns"; // Import the type from columns
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tableplanner";
import axios from "axios";

interface DataTableOnlineProps {
  data: OnlineContent[];
  columns: ColumnDef<OnlineContent>[];
}

export default function DataTableOnline({
  data,
  columns,
}: DataTableOnlineProps) {
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Debug - add this to see if data is reaching component
  console.log("DataTable receiving data:", data);

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
      handleDelete: async (idONP: number) => {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/onlinecontentplanner/delete/${idONP}`
          );

          if (response.data.status) {
            window.location.reload();
            console.log(`Online Planner dengan ID ${idONP} berhasil dihapus.`);
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

  // Add this to debug if table is processing data
  console.log("Table rows:", table.getRowModel().rows.length);

  return (
    <div className="p-6">
      {data.length === 0 ? (
        <div className="text-center p-4 border rounded-lg">
          No data available
        </div>
      ) : (
        <div className="rounded-lg border overflow-auto w-[960px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-center"
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.original.onp_id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`border-t ${
                          index === row.getVisibleCells().length - 1
                            ? ""
                            : "border-t"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
