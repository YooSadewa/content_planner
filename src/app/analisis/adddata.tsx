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
import { AnalyticSchema } from "@/validation/Validation";

interface Topic {
  label: string;
  onpId: string | null;
  lupId: string | null;
  value: string | null;
  platforms?: string;
}

export default function CreateAnalytic() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDisabled, setPlatformsDisabled] = useState(false);
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [existingAnalytics, setExistingAnalytics] = useState<any[]>([]);

  // Form metric states for each platform
  const [platformMetrics, setPlatformMetrics] = useState({
    website: { reach: "", like: "", comment: "", share: "", save: "" },
    instagram: { reach: "", like: "", comment: "", share: "", save: "" },
    twitter: { reach: "", like: "", comment: "", share: "", save: "" },
    facebook: { reach: "", like: "", comment: "", share: "", save: "" },
    youtube: { reach: "", like: "", comment: "", share: "", save: "" },
    tiktok: { reach: "", like: "", comment: "", share: "", save: "" },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(AnalyticSchema),
    defaultValues: {
      anc_tanggal: "",
      anc_hari: "",
      lup_id: "",
      platforms: "",
    },
  });

  const selectedDate = watch("anc_tanggal");
  const selectedTopicId = watch("lup_id");

  // Update day of week when date changes
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
      setValue("anc_hari", dayName);

      // Re-filter available topics when date changes
      filterAvailableTopics(selectedDate);
    }
  }, [selectedDate, setValue, existingAnalytics, topicsData]);

  // Filter available topics based on the selected date
  const filterAvailableTopics = (date: string) => {
    if (!date || !topicsData.length || !existingAnalytics.length) {
      return;
    }

    // Get list of lup_ids that already have analytics for the selected date
    const existingLupIds = existingAnalytics
      .filter((item) => item.anc_tanggal === date)
      .map((item) => item.lup_id);

    // Filter topics that don't have analytics for the selected date
    const availableTopics = topicsData
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        let lupId = null;
        if (
          item.platforms &&
          typeof item.platforms === "object" &&
          item.platforms.lup_id
        ) {
          lupId = item.platforms.lup_id;
        }

        return {
          label: item.onp_topik_konten,
          value: item.onp_id,
          onpId: item.onp_id,
          platforms: item.onp_platform,
          lupId: lupId,
        };
      })
      .filter(
        (topic) =>
          topic.lupId !== null &&
          !existingLupIds.includes(parseInt(topic.lupId))
      );

    setTopics(availableTopics);
  };

  // Handle topic selection change
  useEffect(() => {
    if (selectedTopicId && topicsData.length > 0) {
      // Cari topic berdasarkan lupId
      const selectedTopic = topics.find(
        (topic) => topic.lupId?.toString() === selectedTopicId.toString()
      );

      if (selectedTopic && selectedTopic.platforms) {
        // Parse platform list from string (e.g., "youtube,tiktok")
        const platformList = selectedTopic.platforms
          .split(",")
          .map((p) => p.trim().toLowerCase());

        setSelectedPlatforms(platformList);
        setValue("platforms", platformList.join(","));
        setPlatformsDisabled(true);
      }
    } else {
      setPlatformsDisabled(false);
    }
  }, [selectedTopicId, topics, setValue]);

  // Handle platform metric changes
  const handleMetricChange = (platform: any, metric: any, value: any) => {
    setPlatformMetrics((prev) => ({
      ...prev,
      [platform]: {
        ...(prev as any)[platform],
        [metric]: value,
      },
    }));
  };

  // Modified onSubmit to match backend expectations
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

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

      // Ensure we have reach values for each platform (required by backend)
      selectedPlatforms.forEach((platform) => {
        // Make sure platform name is normalized
        const normalizedPlatform = platform.trim().toLowerCase();

        // Add metrics - ensure reach is always provided
        (formData.reach as any)[normalizedPlatform] =
          (platformMetrics as any)[normalizedPlatform].reach || "0";

        // Only add other metrics if they have values
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

      console.log("Submitting data:", formData);

      // Make API call
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyticcontent/create",
        formData
      );

      console.log("Response:", response.data);
      setSuccessMessage("Content successfully added!");

      // Refresh the analytics data
      fetchAnalytics();

      setTimeout(() => {
        setModalOpen(false);
        reset();
        window.location.reload();
        setPlatformMetrics({
          website: { reach: "", like: "", comment: "", share: "", save: "" },
          instagram: { reach: "", like: "", comment: "", share: "", save: "" },
          twitter: { reach: "", like: "", comment: "", share: "", save: "" },
          facebook: { reach: "", like: "", comment: "", share: "", save: "" },
          youtube: { reach: "", like: "", comment: "", share: "", save: "" },
          tiktok: { reach: "", like: "", comment: "", share: "", save: "" },
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to add content. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformChange = (platform: any) => {
    // Only allow changes if platforms are not disabled
    if (!platformsDisabled) {
      const normalizedPlatform = platform.toLowerCase();

      setSelectedPlatforms((prev) => {
        const newPlatforms = prev.includes(normalizedPlatform)
          ? prev.filter((p) => p !== normalizedPlatform)
          : [...prev, normalizedPlatform];

        setValue("platforms", newPlatforms.join(","));
        return newPlatforms;
      });
    }
  };

  const onAdd = () => {
    setModalOpen(true);
    setSelectedPlatforms([]);
    setErrorMessage("");
    setSuccessMessage("");
    reset();
    setPlatformsDisabled(false);
    setPlatformMetrics({
      website: { reach: "", like: "", comment: "", share: "", save: "" },
      instagram: { reach: "", like: "", comment: "", share: "", save: "" },
      twitter: { reach: "", like: "", comment: "", share: "", save: "" },
      facebook: { reach: "", like: "", comment: "", share: "", save: "" },
      youtube: { reach: "", like: "", comment: "", share: "", save: "" },
      tiktok: { reach: "", like: "", comment: "", share: "", save: "" },
    });

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setValue("anc_tanggal", today);
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/analyticcontent"
      );

      if (
        response.data &&
        response.data.status &&
        response.data.data &&
        response.data.data.analytic_content
      ) {
        setExistingAnalytics(response.data.data.analytic_content);
      } else {
        console.error("Invalid analytics data format", response.data);
        setExistingAnalytics([]);
      }
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setExistingAnalytics([]);
    }
  };

  // Fetch topics and analytics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch topics
        const topicsResponse = await axios.get(
          "http://127.0.0.1:8000/api/onlinecontentplanner"
        );

        let dataArray = [];
        if (
          topicsResponse.data &&
          topicsResponse.data.data &&
          topicsResponse.data.data.online_planners
        ) {
          dataArray = topicsResponse.data.data.online_planners;
        }

        setTopicsData(dataArray);

        // Fetch analytics
        await fetchAnalytics();
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMessage("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Platform display settings
  const platformSettings = {
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

  return (
    <>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700"
        onClick={onAdd}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Add Data
      </Button>
      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambahkan Data</AlertDialogTitle>
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
                    <Select
                      onValueChange={(value) => setValue("lup_id", value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full text-black">
                        <SelectValue
                          placeholder={
                            loading ? "Loading..." : "Pilih Topik Konten"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {errorMessage ? (
                          <SelectItem value="error" disabled>
                            Error loading data
                          </SelectItem>
                        ) : loading ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : topics.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No topics available for this date
                          </SelectItem>
                        ) : (
                          <SelectGroup>
                            {topics.map((topic) => (
                              <SelectItem
                                key={topic.onpId}
                                value={topic.lupId?.toString() || ""}
                              >
                                {topic.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                      </SelectContent>
                    </Select>
                    {errors?.lup_id?.message && (
                      <div className="text-red-500 text-xs">
                        {errors.lup_id?.message}
                      </div>
                    )}
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
                                  handlePlatformChange(platformKey)
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
                                          platformKey,
                                          metric,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
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
                    ? "Submitting..."
                    : loading
                    ? "Loading..."
                    : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
