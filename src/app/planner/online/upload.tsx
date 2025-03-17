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
import Swal from "sweetalert2";

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
  const [existingLinks, setExistingLinks] = useState<UploadLink | null>(null);
  const [hasFilledInput, setHasFilledInput] = useState(false);

  // Buat schema dinamis berdasarkan Platform
  const uploadSchema = createUploadOnlinePlannerSchema(Platform);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
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

  // Watch all form fields to check if any is filled
  const formValues = watch();

  // Check if at least one field has a value
  useEffect(() => {
    const checkIfAnyFieldFilled = () => {
      const values = Object.values(formValues);
      const anyFieldFilled = values.some(
        (value) => value && value.trim() !== ""
      );
      setHasFilledInput(anyFieldFilled);
    };

    checkIfAnyFieldFilled();
  }, [formValues]);

  // Fungsi untuk mengambil data link yang sudah ada
  const fetchExistingLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/linkplanner/${idONP}`
      );

      if (response.status === 200 && response.data.status) {
        const linkData = response.data.data.linkUploadPlanner;
        setExistingLinks(linkData);

        // Isi form dengan data yang sudah ada
        setValue("lup_instagram", linkData.lup_instagram || "");
        setValue("lup_facebook", linkData.lup_facebook || "");
        setValue("lup_twitter", linkData.lup_twitter || "");
        setValue("lup_youtube", linkData.lup_youtube || "");
        setValue("lup_website", linkData.lup_website || "");
        setValue("lup_tiktok", linkData.lup_tiktok || "");
      }
    } catch (error) {
      console.error("Error fetching existing links:", error);
      // Tidak perlu menampilkan error jika data belum ada
    } finally {
      setLoading(false);
    }
  };

  const onOpen = () => {
    setModalOpen(true);
    // Fetch existing links when modal opens
    fetchExistingLinks();
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
  };

  const onSubmit = async (data: UploadLink) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("data input", data);
      const response = await axios.put(
        `http://127.0.0.1:8000/api/uploadcontent/${idONP}`,
        data
      );
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Link berhasil ditambahkan.");
        setModalOpen(false);

        // Show success SweetAlert with timer
        let timerInterval: any;
        Swal.fire({
          title: "Berhasil!",
          text: "Link berhasil ditambahkan.",
          icon: "success",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup()?.querySelector("b");
            if (timer) {
              timerInterval = setInterval(() => {
                if (timer) timer.textContent = `${Swal.getTimerLeft()}`;
              }, 100);
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("Alert closed by the timer");
            window.location.reload();
          }
        });
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
            {loading ? (
              <div className="text-center py-4">Memuat data...</div>
            ) : (
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
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel type="button" onClick={handleCancel}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={isSubmitting || loading || !hasFilledInput}
                    className={
                      !hasFilledInput ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    {existingLinks ? "Update" : "Upload"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            )}
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
