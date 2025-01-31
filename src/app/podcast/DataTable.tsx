"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
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
  onEdit
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onUpload: onUpload,
      onDelete: onDelete,
      onEdit: onEdit
    },
  });

  return (
    <div className="flex flex-col border p-1 rounded w-[1000px]">
      <div className="h-[420px]">
        <div>
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <div key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex w-full flex-wrap gap-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className="w-[486px]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="w-full h-[420px]">
              <div className="flex flex-col items-center gap-5 mt-20">
                <Image
                  src={"/assets/nodata.svg"}
                  alt="no data"
                  width={200}
                  height={100}
                />
                <p className="font-bold text-xl">No data found.</p>
              </div>
            </div>
          )}
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
  );
}
