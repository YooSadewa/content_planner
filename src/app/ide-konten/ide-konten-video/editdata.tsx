import { Button } from "@/components/ui/button";
import { FileText, Folder, Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editVidContentInfoSchema } from "@/validation/Validation";
import axios from "axios";

type IdeKontenVideo = {
  ikv_id: number;
  ikv_tgl: string;
  ikv_judul_konten: string;
  ikv_ringkasan: string;
  ikv_pic: string;
  ikv_status: string;
  ikv_skrip: string;
  ikv_referensi: string;
  ikv_upload: string;
  created_at: string;
  updated_at: string;
};

type EditKontenVideoProps = {
  id: string | number;
  currentName: string;
  currentDate: string;
  currentSummary: string;
  currentPic: string;
  currentStatus: string;
  currentScript: string;
  currentReference: string;
};

export default function UpdateKontenVideo({
  id,
  currentName,
  currentDate,
  currentSummary,
  currentPic,
  currentStatus,
  currentScript,
  currentReference,
}: EditKontenVideoProps) {
  const [, setCurrentStatus] = React.useState("scheduled");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const onEdit = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    reset();
    setModalOpen(false);
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IdeKontenVideo>({
    defaultValues: {
      ikv_judul_konten: currentName,
      ikv_tgl: currentDate,
      ikv_pic: currentPic,
      ikv_skrip: currentScript,
      ikv_status: currentStatus,
      ikv_referensi: currentReference,
      ikv_ringkasan: currentSummary,
    },

    resolver: zodResolver(editVidContentInfoSchema),
  });

  const handleStatusChange = (value: any) => {
    setCurrentStatus(value);
    setValue("ikv_status", value);
  };

  const canShowDone = currentStatus === "done";

  const onUpdate = async (data: IdeKontenVideo) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      // Basic text fields
      formData.append("ikv_tgl", data.ikv_tgl);
      formData.append("ikv_judul_konten", data.ikv_judul_konten);
      formData.append("ikv_ringkasan", data.ikv_ringkasan);
      formData.append("ikv_pic", data.ikv_pic);
      formData.append("ikv_status", data.ikv_status);

      // Handle reference URL - ensure it's a valid URL
      if (data.ikv_referensi && data.ikv_referensi.trim() !== "") {
        // Check if it starts with http:// or https://
        let referenceUrl = data.ikv_referensi;
        if (
          !referenceUrl.startsWith("http://") &&
          !referenceUrl.startsWith("https://")
        ) {
          referenceUrl = "https://" + referenceUrl;
        }
        formData.append("ikv_referensi", referenceUrl);
      } else {
        formData.append("ikv_referensi", "");
      }

      // File handling
      const fileInput = document.querySelector(
        "#ikv_skrip_new"
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        // If a new file is selected, append it
        formData.append("ikv_skrip", fileInput.files[0]);
      }
      // Note: If no file is selected, don't append anything for the script field
      // The backend will keep the existing file

      formData.append("_method", "PUT");

      // Debug formData contents before sending
      console.log(
        "Form data entries:",
        [...formData.entries()].map((entry) => {
          if (entry[1] instanceof File) {
            return [
              entry[0],
              `File: ${entry[1].name} (${entry[1].size} bytes)`,
            ];
          }
          return entry;
        })
      );

      const response = await axios.post(
        `http://127.0.0.1:8000/api/idekontenvideo/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Data berhasil diupdate");
        setTimeout(() => window.location.reload(), 1000);
        setModalOpen(false);
      }
    } catch (error: any) {
      console.error("Error response:", error.response?.data);
      if (error.response?.data?.error) {
        // If we have detailed validation errors, show the first one
        const errors = error.response.data.error;
        const firstError = Object.values(errors)[0];
        setErrorMessage(
          Array.isArray(firstError) ? firstError[0] : String(firstError)
        );
      } else {
        setErrorMessage(
          error.response?.data?.message || "Gagal mengupdate data"
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        className="bg-white hover:bg-gray-100 text-white flex items-center gap-1 h-8 text-xs px-3 rounded-md"
        onClick={onEdit}
      >
        <Pencil color="black" />
      </Button>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onUpdate)} encType="multipart/form-data">
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
                {currentScript && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FileText size={16} />
                    <span>Current file: {currentScript}</span>
                  </div>
                )}
                <div className="flex gap-5">
                  <div className="grid w-full items-center gap-1.5 h-fit">
                    <Label htmlFor="ikv_status">
                      Status Pengerjaan <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      defaultValue={currentStatus}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="on hold">On Hold</SelectItem>
                          {(canShowDone || currentStatus === "done") && (
                            <SelectItem value="done">Done</SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors?.ikv_status?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikv_status.message}
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
                    <Label htmlFor="ikv_skrip">
                      Skrip Konten <span className="text-red-600">*</span>
                    </Label>

                    <Input
                      type="hidden"
                      {...register("ikv_skrip")}
                      defaultValue={currentScript}
                    />

                    <div className="relative w-full">
                      <Input
                        type="file"
                        id="ikv_skrip_new"
                        disabled={isSubmitting || loading}
                        accept=".pdf,.doc,.docx"
                        className="w-full h-full p-[7px] cursor-pointer"
                        onChange={(e) => {
                          // Safely check if files exist and handle type
                          if (e.target.files && e.target.files.length > 0) {
                            // Keep the current script name if no new file selected
                            setValue("ikv_skrip", e.target.files[0].name);
                          } else {
                            setValue("ikv_skrip", currentScript || "");
                          }
                        }}
                      />
                    </div>

                    {errors.ikv_skrip?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikv_skrip?.message}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Select a new file to update the current script
                    </p>
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
    </>
  );
}
