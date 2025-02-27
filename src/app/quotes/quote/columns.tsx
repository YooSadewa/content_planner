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
          <div className="w-[315px] flex flex-col shadow-sm rounded-xl overflow-hidden border border-neutral-200">
            <div className="relative w-full pt-[100%]">
              <iframe
                src={`${linkQuote}embed`}
                className="absolute top-0 left-0 w-full h-full border-none"
                scrolling="no"
              />
            </div>

            {/* Controls section */}
            <div className="border-t border-neutral-300 py-2 px-3 flex justify-between items-center bg-white">
              <Link
                href={linkQuote}
                target="_blank"
                className="bg-[#5CB338] py-1.5 px-3 text-white font-bold text-xs rounded-md flex items-center hover:bg-[#5CB338]/80 duration-200 ease-in"
              >
                Lihat Postingan
              </Link>
              <div className="flex gap-1">
                <UpdateQuote id={quote.qotd_id} currentLink={quote.qotd_link}/>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 transition-all h-8 w-10 p-0 duration-300 hover:bg-red-500/80"
                  onClick={() => meta.onDelete(quote.qotd_id)}
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
