import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/analyticmodal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnalyticSchema,
  validatePlatformMetrics,
} from "@/validation/Validation";
import Swal from "sweetalert2";

interface UpdateAnalyticProps {
  id: number;
  currentDate: string;
  currentDay: string;
  currentLup: string;
  lupId: number;
  currentPlatform: any[];
}

type PlatformMetrics = {
  [key in PlatformKey]: {
    reach: string;
    like: string;
    comment: string;
    share: string;
    save: string;
  };
};

type PlatformKey =
  | "website"
  | "instagram"
  | "twitter"
  | "facebook"
  | "youtube"
  | "tiktok";

type PlatformSettings = {
  [key in PlatformKey]: {
    displayName: string;
    metrics: string[];
  };
};

export default function UpdateAnalytic({
  id,
  currentDate,
  currentDay,
  currentLup,
  lupId,
  currentPlatform,
}: UpdateAnalyticProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDisabled, setPlatformsDisabled] = useState(false);
  const [platformErrors, setPlatformErrors] = useState<any>({});

  // Initial platform metrics based on current platform data
  const initializePlatformMetrics = (): PlatformMetrics => {
    const metrics: PlatformMetrics = {
      website: { reach: "", like: "", comment: "", share: "", save: "" },
      instagram: { reach: "", like: "", comment: "", share: "", save: "" },
      twitter: { reach: "", like: "", comment: "", share: "", save: "" },
      facebook: { reach: "", like: "", comment: "", share: "", save: "" },
      youtube: { reach: "", like: "", comment: "", share: "", save: "" },
      tiktok: { reach: "", like: "", comment: "", share: "", save: "" },
    };

    if (currentPlatform && currentPlatform.length > 0) {
      currentPlatform.forEach((platform) => {
        const platformKey = platform.acr_platform.toLowerCase() as PlatformKey;

        // Check if the platform exists in our predefined keys
        if (platformSettings[platformKey]) {
          metrics[platformKey] = {
            reach: platform.acr_reach || "",
            like: platform.acr_like || "",
            comment: platform.acr_comment || "",
            share: platform.acr_share || "",
            save: platform.acr_save || "",
          };
        }
      });
    }

    return metrics;
  };

  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>(
    initializePlatformMetrics()
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AnalyticSchema),
    defaultValues: {
      anc_tanggal: currentDate,
      anc_hari: currentDay,
      lup_id: lupId.toString(),
      platforms: currentPlatform
        .map((p) => p.acr_platform.toLowerCase())
        .join(","),
    },
  });

  // Set initial selected platforms
  useEffect(() => {
    if (currentPlatform && currentPlatform.length > 0) {
      const platforms = currentPlatform
        .map((p) => p.acr_platform.toLowerCase())
        .filter((p) => (platformSettings as any)[p]);
      setSelectedPlatforms(platforms);
      setPlatformsDisabled(true);
    }
  }, [currentPlatform]);

  // Handle metric changes
  const handleMetricChange = (
    platform: PlatformKey,
    metric: keyof PlatformMetrics[PlatformKey],
    value: string
  ) => {
    setPlatformMetrics((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [metric]: value,
      },
    }));
  };

  // Platform settings
  const platformSettings: PlatformSettings = {
    website: {
      displayName: "Website",
      metrics: ["reach"],
    },
    instagram: {
      displayName: "Instagram",
      metrics: ["reach", "like", "comment", "share", "save"],
    },
    twitter: {
      displayName: "Twitter",
      metrics: ["reach", "like", "comment", "share", "save"],
    },
    facebook: {
      displayName: "Facebook",
      metrics: ["reach", "like", "comment", "share", "save"],
    },
    youtube: {
      displayName: "Youtube",
      metrics: ["reach", "like", "comment", "share", "save"],
    },
    tiktok: {
      displayName: "TikTok",
      metrics: ["reach", "like", "comment", "share", "save"],
    },
  };

  // Handle platform change
  const handlePlatformChange = (platform: PlatformKey) => {
    if (!platformsDisabled) {
      setSelectedPlatforms((prev) => {
        const newPlatforms = prev.includes(platform)
          ? prev.filter((p) => p !== platform)
          : [...prev, platform];

        setValue("platforms", newPlatforms.join(","));
        return newPlatforms;
      });
    }
  };

  // Submit handler
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const validationResult = validatePlatformMetrics(
        selectedPlatforms,
        platformMetrics
      );

      if (!validationResult.success) {
        setPlatformErrors(validationResult.error);

        let timerInterval: any;
        Swal.fire({
          title: "Oops...!",
          text: "Silahkan isi semua field yang diperlukan",
          icon: "error",
          timer: 700,
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
          }
        });

        setLoading(false);
        return;
      }

      setPlatformErrors({});

      // Prepare data for backend
      const formData = {
        anc_tanggal: data.anc_tanggal,
        anc_hari: data.anc_hari,
        lup_id: data.lup_id,
        platforms: data.platforms,
        reach: {},
        like: {},
        comment: {},
        share: {},
        save: {},
      };

      // Add metrics for each selected platform
      selectedPlatforms.forEach((platform) => {
        const normalizedPlatform = platform.trim().toLowerCase();

        if ((platformMetrics as any)[normalizedPlatform].reach)
          (formData.reach as any)[normalizedPlatform] = (
            platformMetrics as any
          )[normalizedPlatform].reach;
        if ((platformMetrics as any)[normalizedPlatform].like)
          (formData.like as any)[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].like;
        if ((platformMetrics as any)[normalizedPlatform].comment)
          (formData.comment as any)[normalizedPlatform] = (
            platformMetrics as any
          )[normalizedPlatform].comment;
        if ((platformMetrics as any)[normalizedPlatform].share)
          (formData.share as any)[normalizedPlatform] = (
            platformMetrics as any
          )[normalizedPlatform].share;
        if ((platformMetrics as any)[normalizedPlatform].save)
          (formData.save as any)[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].save;
      });

      console.log("Updating data:", formData);

      // Send update request
      const response = await axios.put(
        `http://127.0.0.1:8000/api/analyticcontent/update/${id}`,
        formData
      );

      console.log("Response:", response.data);
      setSuccessMessage("Content successfully updated!");

      // Reload page to refresh data
      setTimeout(() => {
        setModalOpen(false);
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error("Error updating form:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to update content. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setModalOpen(true)}
      >
        <Pencil size={16} />
      </Button>

      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Update Analytic Data</AlertDialogTitle>
                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="anc_tanggal">
                        Tanggal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="anc_tanggal"
                        disabled={isSubmitting || loading}
                        {...register("anc_tanggal")}
                      />
                      {errors.anc_tanggal?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.anc_tanggal?.message}
                        </div>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="anc_hari">
                        Hari <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="anc_hari"
                        readOnly
                        className="cursor-not-allowed"
                        {...register("anc_hari")}
                      />
                      {errors.anc_hari?.message && (
                        <div className="text-red-500 text-xs">
                          {errors.anc_hari?.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="lup_id">
                      Topik Konten <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="text"
                      readOnly
                      value={currentLup}
                      className="cursor-not-allowed"
                    />
                  </div>

                  {/* Platform selection */}
                  <div className="grid items-center gap-1.5">
                    <Label htmlFor="platforms" className="mb-1">
                      Platform Media Sosial
                      <span className="text-red-600"> * </span>
                      {platformsDisabled && (
                        <span className="text-blue-500 text-xs w-full">
                          (Auto-selected from topic)
                        </span>
                      )}
                    </Label>

                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(platformSettings).map((platformKey) => {
                        const platform = (platformSettings as any)[platformKey];
                        const isSelected =
                          selectedPlatforms.includes(platformKey);

                        return (
                          <div key={platformKey} className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Checkbox
                                id={`platform-${platformKey}`}
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handlePlatformChange(platformKey as any)
                                }
                                disabled={platformsDisabled}
                                className={
                                  platformsDisabled ? "cursor-not-allowed" : ""
                                }
                              />
                              <label
                                htmlFor={`platform-${platformKey}`}
                                className="text-sm font-medium leading-none"
                              >
                                {platform.displayName}
                              </label>
                            </div>

                            {isSelected && (
                              <>
                                <div className="ml-6 flex flex-wrap gap-2">
                                  {platform.metrics.map((metric: any) => (
                                    <div
                                      key={`${platformKey}-${metric}`}
                                      className="flex items-center space-x-2"
                                    >
                                      <Label
                                        htmlFor={`${platformKey}-${metric}`}
                                        className="w-16 text-xs"
                                      >
                                        {metric.charAt(0).toUpperCase() +
                                          metric.slice(1)}
                                        {metric === "reach" && (
                                          <span className="text-red-500">
                                            {" "}
                                            *
                                          </span>
                                        )}
                                      </Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        id={`${platformKey}-${metric}`}
                                        className="h-8 w-24"
                                        placeholder="0"
                                        value={
                                          (platformMetrics as any)[platformKey][
                                            metric
                                          ]
                                        }
                                        onChange={(e) =>
                                          handleMetricChange(
                                            platformKey as any,
                                            metric,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                                <div className="ps-5 pt-1">
                                  {platformErrors &&
                                    platformErrors[platformKey] &&
                                    platformErrors[platformKey].reach && (
                                      <div className="text-red-500 text-xs ml-1">
                                        Reach wajib diisi untuk{" "}
                                        {platform.displayName}
                                      </div>
                                    )}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {errors.platforms?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.platforms?.message}
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
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  disabled={loading || isSubmitting}
                >
                  {isSubmitting
                    ? "Updating..."
                    : loading
                    ? "Loading..."
                    : "Update"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
