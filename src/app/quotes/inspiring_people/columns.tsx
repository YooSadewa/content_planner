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
          <div className="w-[315px] h-[675px] rounded-xl flex flex-col shadow-sm">
            <iframe src={`${linkInsp}embed`} className="w-full h-full disabled-iframe" />
            <p className="text-sm ps-3 pt-3 capitalize">
              <span className="font-bold text-[#293854]">
                Nama Penginspirasi:{" "}
              </span>
              {namaInsp}
            </p>
            <div className="border-neutral-300 border-b-2 py-3 flex justify-center rounded-b-xl gap-2">
              <Link
                href={linkInsp}
                target="_blank"
                className="bg-[#5CB338] py-2 text-white font-bold text-sm justify-center rounded-md flex w-48 hover:bg-[#5CB338]/80 duration-200 ease-in"
              >
                Lihat Postingan
              </Link>
              <UpdateInspiring
                id={inspiring.ins_id}
                currentLink={inspiring.ins_link}
                currentName={inspiring.ins_nama}
              />
              <Button
                size="sm"
                className="bg-red-600 transition-all h-full duration-300 hover:bg-red-500/80"
                onClick={() => meta.onDelete(inspiring.ins_id)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </>
      );
    },
  },
];
