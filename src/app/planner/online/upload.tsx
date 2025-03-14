import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUploadOnlinePlannerSchema } from "@/validation/Validation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadLinkProps = {
  idONP: string;
  TopikKonten: string;
  Platform: {
    instagram?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    youtube?: boolean;
    website?: boolean;
    tikTok?: boolean;
  };
};

type UploadLink = {
  onp_id: string;
  lup_instagram: string;
  lup_facebook: string;
  lup_twitter: string;
  lup_youtube: string;
  lup_website: string;
  lup_tiktok: string;
};

export default function FormUploadLink({
  idONP,
  TopikKonten,
  Platform,
}: UploadLinkProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Buat schema dinamis berdasarkan Platform
  const uploadSchema = createUploadOnlinePlannerSchema(Platform);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadLink>({
    defaultValues: {
      lup_instagram: "",
      lup_facebook: "",
      lup_twitter: "",
      lup_youtube: "",
      lup_tiktok: "",
      lup_website: "",
    },
    resolver: zodResolver(uploadSchema),
  });

  const onOpen = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
  };

  const onSubmit = async (data: UploadLink) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("onp_id", idONP);
    formData.append("lup_instagram", data.lup_instagram);
    formData.append("lup_twitter", data.lup_twitter);
    formData.append("lup_facebook", data.lup_facebook);
    formData.append("lup_youtube", data.lup_youtube);
    formData.append("lup_website", data.lup_website);
    formData.append("lup_tiktok", data.lup_tiktok);

    try {
      console.log("data input", data);
      const response = await axios.post(
        `http://127.0.0.1:8000/api/uploadcontent/create`,
        formData
      );
      if (response.status === 200 || response.status === 201) {
        window.location.reload();
        setSuccessMessage("Link berhasil ditambahkan.");
        setModalOpen(false);
      } else {
        setErrorMessage("Terjadi kesalahan saat menambahkan link.");
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

  // Sisanya sama dengan kode sebelumnya
  return (
    <>
      <Button
        onClick={onOpen}
        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 h-8 w-full text-xs px-3 rounded-md"
      >
        <MdFileUpload size={16} />
        <p>Upload Link</p>
      </Button>
      <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Upload link untuk: {TopikKonten}
            </AlertDialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Dynamically generate input fields based on platform selection */}
              {Platform && (
                <div className="space-y-4">
                  {Platform.instagram && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_instagram">Link Instagram</Label>
                      <Input
                        type="text"
                        id="lup_instagram"
                        disabled={isSubmitting || loading}
                        placeholder="https://www.instagram.com/"
                        {...register("lup_instagram")}
                      />
                      {errors.lup_instagram?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_instagram?.message}
                        </div>
                      )}
                    </div>
                  )}

                  {Platform.facebook && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_facebook">Link Facebook</Label>
                      <Input
                        type="text"
                        id="lup_facebook"
                        disabled={isSubmitting || loading}
                        placeholder="https://www.facebook.com/"
                        {...register("lup_facebook")}
                      />
                      {errors.lup_facebook?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_facebook?.message}
                        </div>
                      )}
                    </div>
                  )}

                  {Platform.twitter && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_twitter">Link Twitter</Label>
                      <Input
                        type="text"
                        id="lup_twitter"
                        disabled={isSubmitting || loading}
                        placeholder="https://twitter.com/"
                        {...register("lup_twitter")}
                      />
                      {errors.lup_twitter?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_twitter?.message}
                        </div>
                      )}
                    </div>
                  )}

                  {Platform.youtube && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_youtube">Link YouTube</Label>
                      <Input
                        type="text"
                        id="lup_youtube"
                        disabled={isSubmitting || loading}
                        placeholder="https://www.youtube.com/"
                        {...register("lup_youtube")}
                      />
                      {errors.lup_youtube?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_youtube?.message}
                        </div>
                      )}
                    </div>
                  )}

                  {Platform.website && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_website">Link Website</Label>
                      <Input
                        type="text"
                        id="lup_website"
                        disabled={isSubmitting || loading}
                        placeholder="https://"
                        {...register("lup_website")}
                      />
                      {errors.lup_website?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_website?.message}
                        </div>
                      )}
                    </div>
                  )}

                  {Platform.tikTok && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="lup_tiktok">Link TikTok</Label>
                      <Input
                        type="text"
                        id="lup_tiktok"
                        disabled={isSubmitting || loading}
                        placeholder="https://www.tiktok.com/"
                        {...register("lup_tiktok")}
                      />
                      {errors.lup_tiktok?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.lup_tiktok?.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="text-green-500 mt-2">{successMessage}</div>
              )}

              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={isSubmitting || loading}
                >
                  Upload
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}