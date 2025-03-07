import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema for validation
const onlinePlannerSchema = z.object({
  onp_tanggal: z.string().min(1, "Tanggal harus diisi"),
  onp_hari: z.string().min(1, "Hari harus diisi"),
  onp_topik_konten: z.string().min(1, "Topik konten harus diisi"),
  onp_admin: z.string().min(1, "Admin harus diisi"),
  onp_platform: z.string().min(1, "Platform harus dipilih"),
  onp_checkpoint: z.string().min(1, "Checkpoint harus dipilih"),
});

type Admin = {
  user_id: number;
  user_name: string;
};

type OnlinePlanner = z.infer<typeof onlinePlannerSchema>;

export default function CreateOnlinePlanner() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>("");
  const [formInitialized, setFormInitialized] = useState(false);

  // Get session with status to handle loading state
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnlinePlanner>({
    resolver: zodResolver(onlinePlannerSchema),
    defaultValues: {
      onp_tanggal: "",
      onp_hari: "",
      onp_topik_konten: "",
      onp_admin: "",
      onp_platform: "",
      onp_checkpoint: "",
    },
  });

  // Initialize form when session is ready and modal is opened
  useEffect(() => {
    if (status === "authenticated" && isModalOpen && !formInitialized) {
      const userName = session?.user?.name || "";
      reset({
        onp_tanggal: "",
        onp_hari: "",
        onp_topik_konten: "",
        onp_admin: userName,
        onp_platform: "",
        onp_checkpoint: "",
      });
      setFormInitialized(true);
    }
  }, [status, isModalOpen, session, reset, formInitialized]);

  // Watch for date changes
  const selectedDate = watch("onp_tanggal");

  // Update the day field when date changes
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];
      const dayName = days[date.getDay()];
      setValue("onp_hari", dayName);
    }
  }, [selectedDate, setValue]);

  const onAdd = () => {
    setModalOpen(true);
    setFormInitialized(false); // Reset form initialization flag
    setSelectedPlatforms([]);
    setSelectedCheckpoint("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  // Handle platform selection
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];

      // Update form value immediately
      const platformValue =
        newPlatforms.length > 0
          ? newPlatforms.map((p) => p.toLowerCase()).join(", ")
          : "";
      setValue("onp_platform", platformValue);

      return newPlatforms;
    });
  };

  // Handle checkpoint selection (radio-like behavior)
  const handleCheckpointChange = (checkpoint: string) => {
    setSelectedCheckpoint(checkpoint);
    setValue("onp_checkpoint", checkpoint.toLowerCase());
  };

  const onSubmit = async (data: OnlinePlanner) => {
    // Validate platform and checkpoint selection
    if (!selectedCheckpoint) {
      setErrorMessage("Silakan pilih checkpoint");
      return;
    }

    if (selectedPlatforms.length === 0) {
      setErrorMessage("Silakan pilih minimal satu platform");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Format the data exactly as expected by backend
    const formData = {
      onp_tanggal: data.onp_tanggal,
      onp_hari: data.onp_hari,
      onp_topik_konten: data.onp_topik_konten,
      onp_admin: data.onp_admin,
      onp_platform: selectedPlatforms.map((p) => p.toLowerCase()).join(","),
      onp_checkpoint: selectedCheckpoint.toLowerCase(),
    };

    console.log("Sending data:", formData); // Debug what's being sent

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/onlineplanner/create",
        formData,
      );

      console.log("Response:", response); // Debug the response

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Online Content Planner Berhasil Ditambahkan");
        setTimeout(() => {
          setModalOpen(false);
          window.location.reload();
        }, 1000);
      } else {
        setErrorMessage("Terjadi Kesalahan saat menambahkan data");
      }
    } catch (error) {
      console.error("Error details:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        setErrorMessage(
          error.response?.data?.message ||
            "Terjadi kesalahan yang tidak terduga"
        );
      } else {
        setErrorMessage("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Button size="sm" className="bg-gray-400" disabled>
        <Calendar className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  // Get username for the form
  const userName = session?.user?.name || "";

  return (
    <>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700"
        onClick={onAdd}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Add Content
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Konten</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="onp_topik_konten">
                      Topik Konten <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="onp_topik_konten"
                      disabled={isSubmitting || loading}
                      placeholder="Konten XYZ"
                      {...register("onp_topik_konten")}
                    />
                    {errors.onp_topik_konten?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.onp_topik_konten?.message}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5 h-fit">
                      <Label htmlFor="onp_tanggal">
                        Tanggal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="onp_tanggal"
                        disabled={isSubmitting || loading}
                        {...register("onp_tanggal")}
                      />
                      {errors.onp_tanggal?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_tanggal?.message}
                        </div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="onp_hari">
                        Hari <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="onp_hari"
                        readOnly
                        className="cursor-not-allowed"
                        {...register("onp_hari")}
                      />
                      {errors.onp_hari?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_hari?.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="onp_admin">
                      Admin <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="onp_admin"
                      readOnly
                      className="cursor-not-allowed"
                      defaultValue={userName}
                      {...register("onp_admin", {
                        value: userName, // Set this to ensure the value is correctly initialized
                      })}
                    />
                    {errors.onp_admin?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.onp_admin?.message}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-[70%] items-center gap-1.5">
                      <Label htmlFor="onp_platform" className="mb-1">
                        Platform Media Sosial
                        <span className="text-red-600"> *</span>
                      </Label>
                      <div className="flex flex-col flex-wrap gap-6 h-24">
                        {[
                          "Website",
                          "Instagram",
                          "Twitter",
                          "Facebook",
                          "Youtube",
                          "TikTok",
                        ].map((platform) => (
                          <div
                            key={platform}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={selectedPlatforms.includes(platform)}
                              onCheckedChange={() =>
                                handlePlatformChange(platform)
                              }
                            />
                            <label
                              htmlFor={`platform-${platform}`}
                              className="text-sm font-medium leading-none"
                            >
                              {platform}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.onp_platform?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_platform?.message}
                        </div>
                      )}
                    </div>
                    <div className="grid w-[30%] items-center gap-1.5 h-fit">
                      <Label htmlFor="onp_checkpoint" className="mb-1">
                        Checkpoints
                        <span className="text-red-600"> *</span>
                      </Label>
                      <div className="flex flex-col flex-wrap gap-3">
                        {["Jayaridho", "Gilang", "Chris", "Winny"].map(
                          (checkpoint) => (
                            <div
                              key={checkpoint}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`checkpoint-${checkpoint}`}
                                checked={selectedCheckpoint === checkpoint}
                                onCheckedChange={() =>
                                  handleCheckpointChange(checkpoint)
                                }
                              />
                              <label
                                htmlFor={`checkpoint-${checkpoint}`}
                                className="text-sm font-medium leading-none"
                              >
                                {checkpoint}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                      {errors.onp_checkpoint?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.onp_checkpoint?.message}
                        </div>
                      )}
                    </div>
                  </div>
                  {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="text-green-500">{successMessage}</div>
                  )}
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
    </>
  );
}
