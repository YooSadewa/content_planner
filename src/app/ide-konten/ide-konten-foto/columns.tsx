// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_referensi: string;
};

export const columns: ColumnDef<IdeKontenFoto>[] = [
  {
    accessorKey: "ikf_tgl",
    header: "Tanggal",
    cell: ({ row }) => {
      return (
        <div className="text-center w-[100px]">{row.original.ikf_tgl}</div>
      );
    },
  },
  {
    accessorKey: "ikf_judul_konten",
    header: "Judul Konten",
    cell: ({ row }) => {
      return <div className="w-[200px]">{row.original.ikf_judul_konten}</div>;
    },
  },
  {
    accessorKey: "ikf_ringkasan",
    header: "Ringkasan Konten",
    cell: ({ row }) => {
      return <div>{row.original.ikf_ringkasan}</div>;
    },
  },
  {
    accessorKey: "ikf_referensi",
    header: "Referensi Konten",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onOpenReference: (id: number) => void };
      return (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => meta.onOpenReference(row.original.ikf_id)}
        >
          Lihat Referensi
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onOpen: (id: number) => void };
      return (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => meta.onOpen(row.original.ikf_id)}
        >
          Lihat Selengkapnya
        </Button>
      );
    },
  },
];
