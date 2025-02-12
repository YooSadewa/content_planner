"use client"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/tablecontent";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookMarked, CalendarDays, Camera, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function KontenVideoPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="m-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-t">
            <TableHead className="flex gap-2 w-[425px] border-e">
              <Camera size={18} />
              <p>Judul Konten</p>
            </TableHead>
            <TableHead className="flex gap-2 w-32 border-e">
              <CalendarDays size={18} />
              <p>Tanggal</p>
            </TableHead>
            <TableHead className="flex gap-2 w-[328px] border-e">
              <FileText size={18} />
              <p>Ringkasan Konten</p>
            </TableHead>
            <TableHead className="flex gap-2 w-32">
              <BookMarked size={18} />
              <p>Referensi</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="w-[425px] border-e">
              Anak <Button onClick={handleOpenModal}>Buka</Button>
            </TableCell>
            <TableCell className="w-32 border-e">12/12/2020</TableCell>
            <TableCell className="w-[328px] border-e">oajdas</TableCell>
            <TableCell>
              <Button
                className="h-5 text-[10px] px-5 text-black"
                variant="notupload"
              >
                <Link href={""} target="_blank">
                  Lihat Referensi
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Sheet open={isModalOpen} onOpenChange={setModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
