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
import { Button } from "@/components/ui/button";

export function AbstractAlert({
  content,
  notes,
  title,
}: {
  content: any;
  notes: any;
  title: any;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="none" className="p-0 m-0 h-0">
          Lihat abstrak dan catatan
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl capitalize break-all text-black">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            {content}
          </AlertDialogDescription>
          <AlertDialogDescription className="break-all">
            {notes}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
