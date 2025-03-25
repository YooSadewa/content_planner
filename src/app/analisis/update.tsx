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

interface Topic {
  label: string;
  onpId: string | null;
  lupId: string | null;
  value: string | null;
  platforms?: string;
}

interface Platform {
  acr_id: number;
  acr_platform: string;
  acr_reach: string;
  acr_like: string | null;
  acr_comment: string | null;
  acr_share: string | null;
  acr_save: string | null;
}

type AnalyticProps = {
  id: number;
  currentDate: string;
  currentDay: string;
  currentLup: string | number; // Modified to accept string or number
  lupId: number;
  currentPlatform: string | Record<string, boolean> | Platform[];
};

export default function UpdateAnalytic({
  id,
  currentDate,
  currentDay,
  currentLup,
  lupId,
  currentPlatform,
}: AnalyticProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDisabled, setPlatformsDisabled] = useState(false);
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [existingAnalytics, setExistingAnalytics] = useState<any[]>([]);
  const [platformErrors, setPlatformErrors] = useState<any>({});
  const [currentAnalytic, setCurrentAnalytic] = useState<any>(null);
  const [currentTopicName, setCurrentTopicName] = useState<string>(""); // Store the current topic name

  console.log("cek current", currentAnalytic);

  // Form metric states for each platform
  const [platformMetrics, setPlatformMetrics] = useState({
    website: { reach: "", like: "", comment: "", share: "", save: "" },
    instagram: { reach: "", like: "", comment: "", share: "", save: "" },
    twitter: { reach: "", like: "", comment: "", share: "", save: "" },
    facebook: { reach: "", like: "", comment: "", share: "", save: "" },
    youtube: { reach: "", like: "", comment: "", share: "", save: "" },
    tiktok: { reach: "", like: "", comment: "", share: "", save: "" },
  });

  // Convert the input to the format needed by your form
  const platformValue =
    typeof currentPlatform === "string"
      ? currentPlatform
      : Array.isArray(currentPlatform)
      ? JSON.stringify(currentPlatform) // or some other appropriate transformation
      : JSON.stringify(currentPlatform);

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
      anc_tanggal: currentDate,
      anc_hari: currentDay,
      lup_id: lupId.toString(), // Use lupId instead of currentLup
      platforms: platformValue,
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

      // When updating, we don't need to filter topics based on date
      if (!isModalOpen) {
        filterAvailableTopics(selectedDate);
      }
    }
  }, [selectedDate, setValue, existingAnalytics, topicsData, isModalOpen]);

  const findTopicNameByLupId = (lupId: number | string): string => {
    if (!topicsData || topicsData.length === 0) return "";

    // Ensure lupId is treated as a number for comparison
    const lupIdNum = typeof lupId === "string" ? parseInt(lupId, 10) : lupId;

    const topic = topicsData.find(
      (item) =>
        item &&
        typeof item === "object" &&
        item.platforms &&
        item.platforms.lup_id === lupIdNum
    );

    return topic ? topic.onp_topik_konten : "";
  };

  // Filter available topics based on the selected date
  const filterAvailableTopics = (date: string) => {
    if (!date || !topicsData.length) {
      return;
    }

    // Get list of lup_ids that already have analytics for the selected date
    const existingLupIds =
      existingAnalytics.length > 0
        ? existingAnalytics
            .filter((item) => item.anc_tanggal === date && item.anc_id !== id) // Exclude current record
            .map((item) => item.lup_id)
        : [];

    // Filter topics that don't have analytics for the selected date or are the current topic
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
      .filter((topic) => {
        // Safely handle currentLup comparison by converting to numeric values
        const topicLupId =
          topic.lupId !== null ? parseInt(topic.lupId.toString(), 10) : null;
        const currentLupNum =
          currentLup !== undefined
            ? typeof currentLup === "string"
              ? parseInt(currentLup, 10)
              : currentLup
            : null;

        return (
          topic.lupId !== null &&
          (!existingLupIds.includes(topicLupId as number) ||
            topicLupId === currentLupNum)
        );
      });

    setTopics(availableTopics);
  };

  // Handle topic selection change
  useEffect(() => {
    if (selectedTopicId && topicsData.length > 0) {
      // Only change platforms if the selected topic has changed from the initial value
      if (!isModalOpen || selectedTopicId !== (currentLup?.toString() || "")) {
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
      }
    } else {
      setPlatformsDisabled(false);
    }
  }, [selectedTopicId, topics, setValue, isModalOpen, currentLup]);

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

  // Around line 373-374 where you set the default value for lup_id
  useEffect(() => {
    if (currentAnalytic) {
      // Set lup_id as a string to match with SelectItem values
      setValue("lup_id", currentAnalytic.lup_id?.toString() || "");
    }
  }, [currentAnalytic, setValue]);

  // Fetch specific analytic data by ID
  const fetchCurrentAnalytic = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/analyticcontent/${id}`
      );

      if (response.data?.status && response.data?.data?.analytic_content) {
        setCurrentAnalytic(response.data.data.analytic_content);
        return response.data.data.analytic_content;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch specific analytic data:", err);
      return null;
    }
  };

  // Modified onSubmit to match backend expectations for update
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
        anc_id: id,
        anc_tanggal: data.anc_tanggal,
        anc_hari: data.anc_hari,
        lup_id: parseInt(data.lup_id),
        platforms: data.platforms,
        reach: {} as Record<string, string>,
        like: {} as Record<string, string>,
        comment: {} as Record<string, string>,
        share: {} as Record<string, string>,
        save: {} as Record<string, string>,
      };

      // Ensure we have reach values for each platform (required by backend)
      selectedPlatforms.forEach((platform) => {
        // Make sure platform name is normalized
        const normalizedPlatform = platform.trim().toLowerCase();

        // Only add other metrics if they have values
        if ((platformMetrics as any)[normalizedPlatform]?.reach)
          formData.reach[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].reach;
        if ((platformMetrics as any)[normalizedPlatform]?.like)
          formData.like[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].like;
        if ((platformMetrics as any)[normalizedPlatform]?.comment)
          formData.comment[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].comment;
        if ((platformMetrics as any)[normalizedPlatform]?.share)
          formData.share[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].share;
        if ((platformMetrics as any)[normalizedPlatform]?.save)
          formData.save[normalizedPlatform] = (platformMetrics as any)[
            normalizedPlatform
          ].save;
      });

      console.log("Submitting update data:", formData);

      // Use PUT endpoint for updating
      const response = await axios.put(
        `http://127.0.0.1:8000/api/analyticcontent/update/${id}`,
        formData
      );

      console.log("Response:", response.data);
      setSuccessMessage("Content successfully updated!");

      // Refresh the analytics data
      fetchAnalytics();

      setTimeout(() => {
        setModalOpen(false);
        reset();
        window.location.reload();
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
        setErrorMessage("Failed to update content. Please try again.");
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

  const onAdd = async () => {
    setModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setLoading(true);

      // First ensure we have topic data
      if (topicsData.length === 0) {
        await fetchTopics();
      }

      // Fetch current analytic data
      const analyticData = await fetchCurrentAnalytic();

      if (analyticData) {
        // Set form values
        setValue("anc_tanggal", analyticData.anc_tanggal);
        setValue("anc_hari", analyticData.anc_hari);
        setValue("lup_id", analyticData.lup_id?.toString() || "");

        // Set current topic name from lup_id
        if (analyticData.lup_id) {
          setCurrentTopicName(findTopicNameByLupId(analyticData.lup_id));
        }

        // Set platform info
        let platforms: string[] = [];
        if (typeof analyticData.platforms === "string") {
          platforms = analyticData.platforms
            .split(",")
            .map((p: string) => p.trim().toLowerCase());
        } else if (
          analyticData.platforms &&
          typeof analyticData.platforms === "object" &&
          Array.isArray(analyticData.platforms)
        ) {
          // Handle array of platform objects
          platforms = analyticData.platforms.map((p: Platform) =>
            p.acr_platform.toLowerCase()
          );
        } else if (
          analyticData.platforms &&
          typeof analyticData.platforms === "object"
        ) {
          // Handle object with platform keys
          platforms = Object.keys(analyticData.platforms).filter(
            (key) => analyticData.platforms[key] === true
          );
        }

        setSelectedPlatforms(platforms);
        setValue("platforms", platforms.join(","));

        // Set metric values
        const newMetrics = { ...platformMetrics };

        // For array of platform objects
        if (Array.isArray(analyticData.platforms)) {
          analyticData.platforms.forEach((platform: Platform) => {
            const platformKey = platform.acr_platform.toLowerCase();
            if ((newMetrics as any)[platformKey]) {
              (newMetrics as any)[platformKey].reach = platform.acr_reach || "";
              (newMetrics as any)[platformKey].like = platform.acr_like || "";
              (newMetrics as any)[platformKey].comment =
                platform.acr_comment || "";
              (newMetrics as any)[platformKey].share = platform.acr_share || "";
              (newMetrics as any)[platformKey].save = platform.acr_save || "";
            }
          });
        } else {
          // Set reach values from old format if present
          if (analyticData.reach) {
            Object.keys(analyticData.reach).forEach((platform) => {
              if ((newMetrics as any)[platform]) {
                (newMetrics as any)[platform].reach =
                  analyticData.reach[platform].toString();
              }
            });
          }

          // Set like values
          if (analyticData.like) {
            Object.keys(analyticData.like).forEach((platform) => {
              if ((newMetrics as any)[platform]) {
                (newMetrics as any)[platform].like =
                  analyticData.like[platform].toString();
              }
            });
          }

          // Set comment values
          if (analyticData.comment) {
            Object.keys(analyticData.comment).forEach((platform) => {
              if ((newMetrics as any)[platform]) {
                (newMetrics as any)[platform].comment =
                  analyticData.comment[platform].toString();
              }
            });
          }

          // Set share values
          if (analyticData.share) {
            Object.keys(analyticData.share).forEach((platform) => {
              if ((newMetrics as any)[platform]) {
                (newMetrics as any)[platform].share =
                  analyticData.share[platform].toString();
              }
            });
          }

          // Set save values
          if (analyticData.save) {
            Object.keys(analyticData.save).forEach((platform) => {
              if ((newMetrics as any)[platform]) {
                (newMetrics as any)[platform].save =
                  analyticData.save[platform].toString();
              }
            });
          }
        }

        setPlatformMetrics(newMetrics);

        // Set platforms as disabled if from topic
        const selectedTopic = topicsData.find(
          (topic) =>
            topic?.platforms?.lup_id?.toString() ===
              analyticData.lup_id?.toString() || ""
        );

        setPlatformsDisabled(!!selectedTopic);
      }
    } catch (error) {
      console.error("Error preparing form for update:", error);
      setErrorMessage("Failed to load existing data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    reset();
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/analyticcontent/${id}`
      );

      // Check if response has the expected structure and contains data
      if (response.data?.status && response.data?.data?.analytic_content) {
        setExistingAnalytics(response.data.data.analytic_content);
      } else {
        console.log("No analytics data available");
        setExistingAnalytics([]);
      }
    } catch (err) {
      console.log("Failed to fetch analytics data");
      setExistingAnalytics([]);
      return 0;
    }
  };

  // Fetch topics
  const fetchTopics = async () => {
    try {
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

        // Set current topic name if currentLup is available
        if (currentLup !== undefined) {
          const topicName = findTopicNameByLupId(currentLup);
          setCurrentTopicName(topicName);
        }
      }

      setTopicsData(dataArray);
      return dataArray;
    } catch (err) {
      console.error("Error fetching topics:", err);
      return [];
    }
  };

  // Fetch topics and analytics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch topics
        await fetchTopics();

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
                                            platformKey,
                                            metric,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  ))}

                                  {/* Add error message for reach field */}
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
