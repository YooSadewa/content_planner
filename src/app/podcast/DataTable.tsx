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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
      <div className="">
        <div className="w-[1010px] h-[490px]">
          <div className="flex gap-2">
            <div className="flex justify-between w-full mx-3 mt-2 mb-0">
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
                        <Image
                          src={"/assets/nodata.svg"}
                          alt="No data"
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                        Tidak ada data podcast
                      </TableCell>
                    </TableRow>
                  )}
                </>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="w-full mt-8 py-[5px] pe-1">
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

              {/* Generate page numbers */}
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
      </div>
    </>
  );
}
