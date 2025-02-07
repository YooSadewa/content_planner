import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import UpdateQuote from "./updatequote";

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
      const quote = row.original;
      const linkQuote = row.original.qotd_link;
      const meta = table.options.meta as any;

      return (
        <>
          <div className="w-[315px] h-[645px] rounded-xl flex flex-col shadow-sm">
            <iframe src={`${linkQuote}embed`} className="w-full h-full disabled-iframe" />
            <div className="border-neutral-300 border-b-2 py-3 flex justify-center rounded-b-xl gap-2">
              <Link
                href={linkQuote}
                target="_blank"
                className="bg-[#5CB338] py-2 text-white font-bold text-sm justify-center rounded-md flex w-48 hover:bg-[#5CB338]/80 duration-200 ease-in"
              >
                Lihat Postingan
              </Link>
              <UpdateQuote id={quote.qotd_id} currentLink={quote.qotd_link}/>
              <Button
                size="sm"
                className="bg-red-600 transition-all h-full duration-300 hover:bg-red-500/80"
                onClick={() => meta.onDelete(quote.qotd_id)}
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
