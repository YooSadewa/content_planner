import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

type Quote = {
  qotd_id: number;
  qotd_link: string;
};

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "qotd_id",
    accessorFn: (row) => `${row.qotd_link}`,
    header: "",
    cell: ({ row, table }) => {
      const idQuote = row.original.qotd_id;
      const linkQuote = row.original.qotd_link;

      return (
        <>
          <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm">
            <iframe src={`${linkQuote}embed`} className="w-full h-full" />
            <div className="border-neutral-300 border-b-2 py-3 flex justify-end rounded-b-xl">
              <Link
                href={linkQuote}
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
