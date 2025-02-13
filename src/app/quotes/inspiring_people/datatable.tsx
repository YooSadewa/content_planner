import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface DataTableProps<TData, TValue> {
  query: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (idInspiring: number) => void;
}

export function DataTableInspiring<TData, TValue>({
  columns,
  data,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 3,
      },
    },
    meta: {
      onDelete: onDelete,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="bg-white p-5 rounded-xl mt-5 flex flex-col w-[1010px]">
        <h1 className="font-bold text-2xl mb-3 text-[#293854]">
          Data Postingan Instagram "Inspiring People"
        </h1>
        <div className="bg-white flex flex-row flex-wrap gap-3 justify-between">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="p-0">
                  <div className="flex flex-row flex-wrap gap-3">
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <div key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <div key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center">
                        Tidak ada data Postingan
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
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
        </div>
      </div>
    </>
  );
}
