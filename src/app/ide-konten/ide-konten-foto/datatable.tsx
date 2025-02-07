import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tablecontent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
  created_at: string;
  updated_at: string;
};

type DataTableProps = {
  data: IdeKontenFoto[];
  onOpen: (id: number) => void;
};

export function DataTable({ data, onOpen }: DataTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <Table>
        <TableHeader className="text-xs text-white uppercase bg-[#293854]">
          <TableRow>
            <TableHead className="w-[15%] border-e-2">Tanggal</TableHead>
            <TableHead className="w-[30%] border-e-2">Judul Konten</TableHead>
            <TableHead className="w-[30%] border-e-2">
              Ringkasan Konten
            </TableHead>
            <TableHead className="w-[15%] border-e-2">
              Referensi Konten
            </TableHead>
            <TableHead className="w-[10%]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.ikf_id} className="">
              <TableCell className="text-center border-e-2 border-[#293854]">
                {formatDate(item.ikf_tgl)}
              </TableCell>
              <TableCell className="border-e-2 border-[#293854]">
                {item.ikf_judul_konten}
              </TableCell>
              <TableCell className="border-e-2 border-[#293854]">
                {item.ikf_ringkasan}
              </TableCell>
              <TableCell className="text-center border-e-2 border-[#293854]">
                <Button size="sm" variant="notupload" className="w-full">
                  <Link href={item.ikf_referensi}>Lihat Referensi</Link>
                </Button>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="upload"
                  className="w-full"
                  onClick={() => onOpen(item.ikf_id)}
                >
                  Lihat Selengkapnya
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
