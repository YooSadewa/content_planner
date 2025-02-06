import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      const namaInsp = row.original.ins_nama;
      const linkInsp = row.original.ins_link;

      return (
        <>
          <div className="w-[315px] h-[675px] rounded-xl flex flex-col shadow-sm">
            <iframe src={`${linkInsp}embed`} className="w-full h-full" />
            <p className="text-sm ps-3 pt-3">
                <span className="font-bold text-[#293854]">
                  Nama Penginspirasi:{" "}
                </span>
                {namaInsp}
              </p>
            <div className="border-neutral-300 border-b-2 py-3 flex justify-end rounded-b-xl">
              <Link
                href={linkInsp}
                target="_blank"
                className="bg-[#5CB338] py-2 text-white font-bold text-sm justify-center rounded-md me-4 flex w-48 hover:bg-[#5CB338]/80 duration-200 ease-in"
              >
                Lihat Postingan
              </Link>
            </div>
          </div>
        </>
      );
    },
  },
];
