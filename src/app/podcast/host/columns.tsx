import EditHost from "@/components/(Podcast)/HostManage/EditData";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, UserPen } from "lucide-react";

type Host = {
  host_id: number;
  host_nama: string;
};

export const columns: ColumnDef<Host>[] = [
  {
    id: "number",
    header: "No",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "host_nama",
    header: "Nama Host",
  },
  {
    id: "actions",
    header: "Management",
    cell: ({ row, table }) => {
      const host = row.original;
      const meta = table.options.meta as any;
      return (
        <div className="flex justify-center gap-2">
          <EditHost id={host.host_id} currentName={host.host_nama} />
          <span className="w-[1px] h-5 bg-[#f7b500] my-auto" />
          <Button size="sm" className="bg-red-600" onClick={() => meta.onDelete(host.host_id)}>
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
