"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  query: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpload: (idPodcast: number) => void;
  onDelete: (idPodcast: number) => void;
  onEdit: (idPodcast: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onUpload,
  onDelete,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 2,
      },
    },
    state: {
      columnFilters,
      globalFilter,
    },
    meta: {
      onUpload: onUpload,
      onDelete: onDelete,
      onEdit: onEdit,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter, //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <>
      <div className="shadow-md border-t rounded-xl">
        <div className="w-[1010px] h-[520px]">
          <div className="flex gap-2">
            <div className="flex justify-between mb-1 w-full m-3">
              <h1 className="text-xl font-bold flex items-center">
                Data Podcast
              </h1>
              <div className="flex w-full max-w-sm items-center space-x-2 bg-white shadow-sm rounded-md">
                <Input
                  type="text"
                  name="search"
                  id="search"
                  value={globalFilter ?? ""}
                  placeholder="Cari..."
                  onChange={(e) => setGlobalFilter(String(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg text-black dark:text-white">
            <Table>
              <TableBody>
                <>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                        className="text-center flex flex-col m-auto h-[480px] items-center justify-center gap-5 font-semibold"
                      >
                        <Image src={"/assets/nodata.svg"} alt="No data" width={200} height={200} className="mx-auto"/>
                        Tidak ada data podcast
                      </TableCell>
                    </TableRow>
                  )}
                </>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-2 bg-gray-200 rounded-full mb-2 ms-2"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-2 bg-gray-200 rounded-full my-2 me-2"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}
