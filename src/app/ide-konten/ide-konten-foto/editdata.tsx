import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPicContentInfoSchema } from "@/validation/Validation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IdeKontenFoto = {
  ikf_id: number;
  ikf_tgl: string;
  ikf_judul_konten: string;
  ikf_ringkasan: string;
  ikf_pic: string;
  ikf_status: string;
  ikf_skrip: string;
  ikf_referensi: string;
  ikf_upload: string;
  created_at: string;
  updated_at: string;
};

type EditKontenFotoProps = {
  id: string | number;
  currentName: string;
  currentDate: string;
  currentSummary: string;
  currentPic: string;
  currentStatus: string;
  currentScript: string;
  currentReference: string;
};

export default function UpdateKontenFoto({
  id,
  currentName,
  currentDate,
  currentSummary,
  currentPic,
  currentStatus,
  currentScript,
  currentReference,
}: EditKontenFotoProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [, setCurrentStatus] = React.useState("scheduled");
  const onEdit = () => {
    setModalOpen(true);
  };
  const handleCancel = () => {
    reset();
    setModalOpen(false);
  };
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IdeKontenFoto>({
    defaultValues: {
      ikf_judul_konten: currentName,
      ikf_tgl: currentDate,
      ikf_pic: currentPic,
      ikf_skrip: currentScript,
      ikf_status: currentStatus,
      ikf_referensi: currentReference,
      ikf_ringkasan: currentSummary,
    },
    resolver: zodResolver(editPicContentInfoSchema(true, currentDate)),
  });
  const handleStatusChange = (value: any) => {
    setCurrentStatus(value);
    setValue("ikf_status", value);
  };

  const canShowDone = currentStatus === "done";
  const onUpdate = async (data: IdeKontenFoto) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      // Basic text fields
      formData.append("ikf_tgl", data.ikf_tgl);
      formData.append("ikf_judul_konten", data.ikf_judul_konten);
      formData.append("ikf_ringkasan", data.ikf_ringkasan);
      formData.append("ikf_pic", data.ikf_pic);
      formData.append("ikf_status", data.ikf_status);

      // Handle reference URL - ensure it's a valid URL
      if (data.ikf_referensi && data.ikf_referensi.trim() !== "") {
        // Check if it starts with http:// or https://
        let referenceUrl = data.ikf_referensi;
        if (
          !referenceUrl.startsWith("http://") &&
          !referenceUrl.startsWith("https://")
        ) {
          referenceUrl = "https://" + referenceUrl;
        }
        formData.append("ikf_referensi", referenceUrl);
      } else {
        formData.append("ikf_referensi", "");
      }

      // File handling
      const fileInput = document.querySelector(
        "#ikf_skrip_new"
      ) as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        // If a new file is selected, append it
        formData.append("ikf_skrip", fileInput.files[0]);
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
        `http://127.0.0.1:8000/api/idekontenfoto/update/${id}`,
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
          <form onSubmit={handleSubmit(onUpdate)}>
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
                {currentScript && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FileText size={16} />
                    <span>Current file: {currentScript}</span>
                  </div>
                )}
                <div className="flex gap-5">
                  <div className="grid w-full items-center gap-1.5 h-fit">
                    <Label htmlFor="ikf_status">
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
                    {errors?.ikf_status?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_status.message}
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
                    <Label htmlFor="ikf_skrip">
                      Skrip Konten <span className="text-red-600">*</span>
                    </Label>

                    <Input
                      type="hidden"
                      {...register("ikf_skrip")}
                      defaultValue={currentScript}
                    />

                    <div className="relative w-full">
                      <Input
                        type="file"
                        id="ikf_skrip_new"
                        disabled={isSubmitting || loading}
                        accept=".pdf,.doc,.docx"
                        className="w-full h-full p-[7px] cursor-pointer"
                        onChange={(e) => {
                          // Safely check if files exist and handle type
                          if (e.target.files && e.target.files.length > 0) {
                            // Keep the current script name if no new file selected
                            setValue("ikf_skrip", e.target.files[0].name);
                          } else {
                            setValue("ikf_skrip", currentScript || "");
                          }
                        }}
                      />
                    </div>

                    {errors.ikf_skrip?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.ikf_skrip?.message}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Select a new file to update the current script
                    </p>
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
    </>
  );
}
