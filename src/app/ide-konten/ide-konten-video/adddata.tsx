import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { vidContentInfoSchema } from "@/validation/Validation";
import axios from "axios";
import { Folder, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type VidContent = {
  ikv_id: number;
  ikv_tgl: string;
  ikv_judul_konten: string;
  ikv_ringkasan: string;
  ikv_pic: string;
  ikv_status: string;
  ikv_skrip: string;
  ikv_referensi: string;
};

export default function CreateKontenVideo() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VidContent>({
    defaultValues: {
      ikv_tgl: "",
      ikv_judul_konten: "",
      ikv_ringkasan: "",
      ikv_pic: "",
      ikv_status: "",
      ikv_skrip: "",
      ikv_referensi: "",
    },
    resolver: zodResolver(vidContentInfoSchema),
  });

  const onAdd = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  const onSubmit = async (data: VidContent) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof VidContent;
        if (typedKey === "ikv_skrip" && data[typedKey]) {
          const fileList = data[typedKey] as unknown as FileList;
          if (fileList[0]) {
            formData.append(typedKey, fileList[0]);
          }
        } else {
          formData.append(typedKey, String(data[typedKey]));
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/idekontenvideo/create",
        formData
      );

      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Konten berhasil ditambahkan.");
        setModalOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan Konten.");
      }
    } catch (error) {
      console.error("Error details:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Terjadi kesalahan pada server"
        );
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button size="sm" variant="default" onClick={onAdd}>
        <Plus />
        Tambahkan Konten Video
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Konten</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikv_judul_konten">
                      Judul Konten <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="ikv_judul_konten"
                      disabled={isSubmitting || loading}
                      placeholder="Konten XYZ"
                      {...register("ikv_judul_konten")}
                    />
                    {errors.ikv_judul_konten?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikv_judul_konten?.message}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="text-red-500">{errorMessage}</div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 h-fit">
                      <Label htmlFor="ikv_tgl">Tanggal</Label>
                      <Input
                        type="date"
                        id="ikv_tgl"
                        disabled={isSubmitting || loading}
                        {...register("ikv_tgl")}
                      />
                      {errors.ikv_tgl?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikv_tgl?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="ikv_pic">
                        PIC <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="ikv_pic"
                        disabled={isSubmitting || loading}
                        {...register("ikv_pic")}
                      />
                      {errors.ikv_pic?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikv_pic?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikv_ringkasan">
                      Ringkasan Konten <span className="text-red-600">*</span>
                    </Label>
                    <textarea
                      id="ikv_ringkasan"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="Konten XYZ menjelaskan tentang ABC"
                      {...register("ikv_ringkasan")}
                    />
                    {errors.ikv_ringkasan?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikv_ringkasan?.message}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="ikv_status">
                        Status Pengerjaan{" "}
                        <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("ikv_status", value)}
                      >
                        <SelectTrigger className="w-full text-black">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="on hold">On Hold</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.ikv_status?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikv_status?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5 h-fit">
                      <Label htmlFor="ikv_skrip">Skrip Konten</Label>
                      <div className="relative w-full">
                        <Input
                          type="file"
                          id="ikv_skrip"
                          disabled={isSubmitting || loading}
                          accept=".pdf,.doc,.docx"
                          className="w-full h-full p-[7px] cursor-pointer"
                          {...register("ikv_skrip")}
                        />
                      </div>
                      {errors.ikv_skrip?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikv_skrip?.message}
                        </div>
                      )}
                      {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                      )}
                      {successMessage && (
                        <div className="text-green-500">{successMessage}</div>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikv_referensi">Referensi Konten</Label>
                    <textarea
                      id="ikv_referensi"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="https://www.instagram.com/p/"
                      {...register("ikv_referensi")}
                    />
                    {errors.ikv_referensi?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikv_referensi?.message}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
