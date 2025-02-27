import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import UpdateInspiring from "./updateinspiring";

type InsPeople = {
  ins_id: number;
  ins_nama: string;
  ins_link: string;
};

export const columnsInsp: ColumnDef<InsPeople>[] = [
  {
    accessorKey: "ins_id",
    accessorFn: (row) => `${row.ins_nama} ${row.ins_link}`,
    header: "",
    cell: ({ row, table }) => {
      const idInsp = row.original.ins_id;
      const inspiring = row.original;
      const namaInsp = row.original.ins_nama;
      const linkInsp = row.original.ins_link;
      const meta = table.options.meta as any;

      return (
        <>
          <div className="w-[315px] flex flex-col shadow-sm rounded-xl overflow-hidden border border-neutral-200">
            {/* Fixed aspect ratio container for iframe */}
            <div className="relative w-full pt-[100%]">
              <iframe
                src={`${linkInsp}embed`}
                className="absolute top-0 left-0 w-full h-full border-none"
                scrolling="no"
              />
            </div>

            {/* Nama Penginspirasi section */}
            <div className="p-3 bg-white border-t border-neutral-200">
              <p className="text-sm capitalize">
                <span className="font-bold text-[#293854]">
                  Nama Penginspirasi:{" "}
                </span>
                {namaInsp}
              </p>
            </div>

            {/* Controls section */}
            <div className="border-t border-neutral-300 py-2 px-3 flex justify-between items-center bg-white">
              <Link
                href={linkInsp}
                target="_blank"
                className="bg-[#5CB338] py-1.5 px-3 text-white font-bold text-xs rounded-md flex items-center hover:bg-[#5CB338]/80 duration-200 ease-in"
              >
                Lihat Postingan
              </Link>
              <div className="flex gap-1">
                <UpdateInspiring
                  id={inspiring.ins_id}
                  currentLink={inspiring.ins_link}
                  currentName={inspiring.ins_nama}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 transition-all h-8 w-10 p-0 duration-300 hover:bg-red-500/80"
                  onClick={() => meta.onDelete(inspiring.ins_id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    },
  },
];
