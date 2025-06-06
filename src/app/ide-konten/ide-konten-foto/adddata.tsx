import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { picContentInfoSchema } from "@/validation/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PicContent = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_pic: string;
  ikf_status: string;
  ikf_skrip: string;
  ikf_referensi: string;
};

export default function CreateKontenFoto() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PicContent>({
    defaultValues: {
      ikf_tgl: "",
      ikf_judul_konten: "",
      ikf_ringkasan: "",
      ikf_pic: "",
      ikf_status: "",
      ikf_skrip: "",
      ikf_referensi: "",
    },
    resolver: zodResolver(picContentInfoSchema),
  });

  const onAdd = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    setModalOpen(false);
  };

  const onSubmit = async (data: PicContent) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const typedKey = key as keyof PicContent;
        if (typedKey === "ikf_skrip" && data[typedKey]) {
          const fileList = data[typedKey] as unknown as FileList;
          if (fileList[0]) {
            formData.append(typedKey, fileList[0]);
          }
        } else {
          formData.append(typedKey, String(data[typedKey]));
        }
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/idekontenfoto/create",
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
        Tambahkan Konten Foto
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Konten</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="ikf_judul_konten">
                      Judul Konten <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="ikf_judul_konten"
                      disabled={isSubmitting || loading}
                      placeholder="Konten XYZ"
                      {...register("ikf_judul_konten")}
                    />
                    {errors.ikf_judul_konten?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_judul_konten?.message}
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
                      <Label htmlFor="ikf_tgl">Tanggal</Label>
                      <Input
                        type="date"
                        id="ikf_tgl"
                        disabled={isSubmitting || loading}
                        {...register("ikf_tgl")}
                      />
                      {errors.ikf_tgl?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikf_tgl?.message}
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
                      <Label htmlFor="ikf_pic">
                        PIC <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="ikf_pic"
                        disabled={isSubmitting || loading}
                        {...register("ikf_pic")}
                      />
                      {errors.ikf_pic?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikf_pic?.message}
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
                    <Label htmlFor="ikf_ringkasan">
                      Ringkasan Konten <span className="text-red-600">*</span>
                    </Label>
                    <textarea
                      id="ikf_ringkasan"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="Konten XYZ menjelaskan tentang ABC"
                      {...register("ikf_ringkasan")}
                    />
                    {errors.ikf_ringkasan?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_ringkasan?.message}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-green-500">{successMessage}</div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="ikf_status">
                        Status Pengerjaan{" "}
                        <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValue("ikf_status", value)}
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
                      {errors.ikf_status?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikf_status?.message}
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
                      <Label htmlFor="ikf_skrip">Skrip Konten</Label>
                      <div className="relative w-full">
                        <Input
                          type="file"
                          id="ikf_skrip"
                          disabled={isSubmitting || loading}
                          accept=".pdf,.doc,.docx"
                          className="w-full h-full p-[7px] cursor-pointer"
                          {...register("ikf_skrip")}
                        />
                      </div>
                      {errors.ikf_skrip?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.ikf_skrip?.message}
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
                    <Label htmlFor="ikf_referensi">Referensi Konten</Label>
                    <textarea
                      id="ikf_referensi"
                      disabled={isSubmitting || loading}
                      rows={3}
                      className="border rounded-md px-3 py-2 text-sm min-h-9 max-h-36"
                      placeholder="https://www.instagram.com/p/"
                      {...register("ikf_referensi")}
                    />
                    {errors.ikf_referensi?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_referensi?.message}
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
