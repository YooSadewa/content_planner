import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function UploadModal() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-[#293854] text-secondary-foreground text-white rounded shadow-sm p-2">Validasi Upload</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin untuk konfirmasi upload?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak bisa dibatalkan. Pastikan kamu sudah validasi dengan benar. Silahkan input link Youtube yang benar.
          </AlertDialogDescription>
          <Input type="email" placeholder="https://youtu.be/" />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#293854]">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
