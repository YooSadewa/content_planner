import { Button } from "@/components/ui/button";
import { Calendar, Pencil } from "lucide-react";
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
import { useEffect, useState } from "react";

type UpdateOnlineProps = {
  id: string;
  currentName: string;
  currentDate: string;
  currentDay: string;
  currentAdmin: string;
  currentPlatform: string | Record<string, boolean>;
  currentCheckpoint: string | Record<string, boolean>;
};

interface OnlinePlanner {
  onp_topik_konten: string;
  onp_hari: string;
  onp_admin: string;
  onp_platform: string;
  onp_checkpoint: string;
  onp_tanggal: string | null;
}

const onlinePlannerSchema = (isEdit: boolean, previousDate?: string) =>
  z.object({
    onp_tanggal: z
      .string()
      .min(1, "Tanggal Harus diisi")
      .nullable()
      .refine(
        (val) => {
          const inputDate = new Date(val as any);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          inputDate.setHours(0, 0, 0, 0);

          if (isEdit && previousDate) {
            const prevDate = new Date(previousDate);
            prevDate.setHours(0, 0, 0, 0);

            // Jika previousDate di masa lalu dan tidak diubah, tetap lolos
            if (
              prevDate < currentDate &&
              inputDate.getTime() === prevDate.getTime()
            ) {
              return true;
            }

            // Jika previousDate di masa lalu tapi diubah, minimal harus hari ini
            if (prevDate < currentDate) {
              return inputDate >= currentDate;
            }

            // Jika previousDate di masa depan dan diubah, minimal harus setelah hari ini tetapi boleh di bawah previousDate
            if (prevDate >= currentDate) {
              return inputDate >= currentDate;
            }
          }

          // Jika bukan edit, tetap tidak boleh di masa lalu
          return inputDate >= currentDate;
        },
        {
          message: "Tanggal shooting tidak boleh di masa lalu",
        }
      ),
    onp_topik_konten: z.string().min(1, "Topik Konten harus diisi"),
    onp_hari: z.string(),
    onp_admin: z.string(),
    onp_platform: z.string(),
    onp_checkpoint: z.string(),
  });

export default function FormUpdateOnline({
  id,
  currentName,
  currentDate,
  currentDay,
  currentAdmin,
  currentPlatform,
  currentCheckpoint,
}: UpdateOnlineProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>("");
  const [formInitialized, setFormInitialized] = useState(false);

  const { data: session, status } = useSession();
  const isEdit = true;
  const previousDate = currentDate;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnlinePlanner>({
    resolver: zodResolver(onlinePlannerSchema(isEdit, previousDate as any)),
    defaultValues: {
      onp_tanggal: currentDate,
      onp_hari: currentDay,
      onp_topik_konten: currentName,
      onp_admin: "",
      onp_platform: typeof currentPlatform === "string" ? currentPlatform : "",
      onp_checkpoint:
        typeof currentCheckpoint === "string" ? currentCheckpoint : "",
    },
  });

  useEffect(() => {
    if (status === "authenticated" && isModalOpen && !formInitialized) {
      const userName = session?.user?.name || "";

      // Handle the platform field value
      let platformValue = "";
      if (typeof currentPlatform === "string") {
        platformValue = currentPlatform;
      } else if (
        typeof currentPlatform === "object" &&
        currentPlatform !== null
      ) {
        // Convert object of booleans to comma-separated string
        platformValue = Object.entries(currentPlatform)
          .filter(([_, isActive]) => isActive)
          .map(([platform]) => platform.toLowerCase())
          .join(",");
      }

      // Handle the checkpoint field value
      let checkpointValue = "";
      if (typeof currentCheckpoint === "string") {
        checkpointValue = currentCheckpoint;
      } else if (
        typeof currentCheckpoint === "object" &&
        currentCheckpoint !== null
      ) {
        // Get the first active checkpoint (assuming single selection)
        const activeCheckpoint = Object.entries(currentCheckpoint).find(
          ([_, isActive]) => isActive
        );
        checkpointValue = activeCheckpoint
          ? activeCheckpoint[0].toLowerCase()
          : "";
      }

      reset({
        onp_tanggal: currentDate,
        onp_hari: currentDay,
        onp_topik_konten: currentName,
        onp_admin: userName,
        onp_platform: platformValue,
        onp_checkpoint: checkpointValue,
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
    setFormInitialized(false);

    // Initialize platforms
    const initialPlatforms: string[] = [];

    if (typeof currentPlatform === "string" && currentPlatform) {
      // Handle string format "instagram, facebook, twitter"
      const platforms = currentPlatform
        .split(",")
        .map((p) => p.trim().charAt(0).toUpperCase() + p.trim().slice(1));
      initialPlatforms.push(...platforms);
    } else if (
      typeof currentPlatform === "object" &&
      currentPlatform !== null
    ) {
      // Handle object format {instagram: true, facebook: true, twitter: false}
      Object.entries(currentPlatform).forEach(([platform, isActive]) => {
        if (isActive) {
          const formattedPlatform =
            platform.charAt(0).toUpperCase() + platform.slice(1);
          initialPlatforms.push(formattedPlatform);
        }
      });
    }

    setSelectedPlatforms(initialPlatforms);

    // Initialize checkpoint
    let initialCheckpoint = "";

    if (typeof currentCheckpoint === "string" && currentCheckpoint) {
      // Handle string format "jayaridho"
      initialCheckpoint =
        currentCheckpoint.charAt(0).toUpperCase() + currentCheckpoint.slice(1);
    } else if (
      typeof currentCheckpoint === "object" &&
      currentCheckpoint !== null
    ) {
      // Handle object format {jayaridho: true, gilang: false}
      const activeCheckpoint = Object.entries(currentCheckpoint).find(
        ([_, isActive]) => isActive
      );

      if (activeCheckpoint) {
        initialCheckpoint =
          activeCheckpoint[0].charAt(0).toUpperCase() +
          activeCheckpoint[0].slice(1);
      }
    }

    setSelectedCheckpoint(initialCheckpoint);

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

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

  const handleCheckpointChange = (checkpoint: string) => {
    setSelectedCheckpoint(checkpoint);
    setValue("onp_checkpoint", checkpoint.toLowerCase());
  };

  const userName = session?.user?.name || "";

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

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/onlineplanner/update/${id}`,
        formData
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

  return (
    <>
      <Button
        onClick={onAdd}
        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2 h-8 w-full text-xs px-3 rounded-md"
      >
        <Pencil size={16} />
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
