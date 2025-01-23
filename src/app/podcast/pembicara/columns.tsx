import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, UserPen } from "lucide-react";

type Pembicara = {
  host_id: number;
  host_nama: string;
};

export const columns: ColumnDef<Pembicara>[] = [
  {
    id: "number",
    header: "No",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "pmb_nama",
    header: "Nama Pembicara",
  },
  {
    id: "actions",
    header: "Management",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      return (
        <div className="flex justify-center gap-2">
          <Button size="sm">
            <UserPen />
          </Button>
          <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
          <Button size="sm">
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
