import EditPembicara from "@/components/(Podcast)/PembicaraManage/EditData";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, UserPen } from "lucide-react";

type Pembicara = {
  pmb_id: number;
  pmb_nama: string;
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
      const pembicara = row.original;
      const meta = table.options.meta as any;
      return (
        <div className="flex justify-center gap-2">
          <EditPembicara 
            id={pembicara.pmb_id} 
            currentName={pembicara.pmb_nama} 
          />
          <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
          <Button size="sm" className="bg-red-600" onClick={() => meta.onDelete(pembicara.pmb_id)}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];