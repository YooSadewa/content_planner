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
import {
  AnalyticSchema,
  validatePlatformMetrics,
} from "@/validation/Validation";
import Swal from "sweetalert2";

// Define TypeScript interfaces
interface Topic {
  label: string;
  onpId: string | null;
  lupId: string | null;
  value: string | null;
  platforms?: string;
}

interface PlatformData {
  anp_id: number;
  anp_name: string;
  created_at: string;
  updated_at: string;
}

interface PlatformField {
  anf_id: number | string;
  anp_id: number;
  anf_name: string;
  anf_required: number;
  created_at: string | null;
  updated_at: string | null;
  platforms: PlatformData[];
  custom?: boolean;
}

interface Platform {
  anp_id: number;
  anp_name: string;
  created_at: string;
  updated_at: string;
}

interface MetricsState {
  [platform: string]: {
    [field: string]: string;
  };
}

interface PlatformErrorsState {
  [platform: string]: {
    [field: string]: string;
  };
}

interface AnalyticData {
  anc_id: number;
  anc_tanggal: string;
  anc_hari: string;
  lup_id: number;
  // Additional properties as needed
}

interface FormData {
  anc_tanggal: string;
  anc_hari: string;
  lup_id: string;
  platforms: string;
  [key: string]: any; // For dynamic field values
}

interface AddFieldFormState {
  platform: string;
  name: string;
  required: boolean;
}

export default function CreateAnalytic() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDisabled, setPlatformsDisabled] = useState<boolean>(false);
  const [topicsData, setTopicsData] = useState<any[]>([]);
  const [existingAnalytics, setExistingAnalytics] = useState<AnalyticData[]>(
    []
  );
  const [platformErrors, setPlatformErrors] = useState<PlatformErrorsState>({});
  const [isAddingField, setIsAddingField] = useState<boolean>(false);

  // New state for dynamic platforms and fields
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [platformFields, setPlatformFields] = useState<PlatformField[]>([]);

  // Dynamic platform metrics state with TypeScript type
  const [platformMetrics, setPlatformMetrics] = useState<MetricsState>({});

  // State for add field form
  const [addFieldForm, setAddFieldForm] = useState<AddFieldFormState | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
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

  // Fetch platforms and fields data
  useEffect(() => {
    const fetchPlatformsAndFields = async (): Promise<void> => {
      try {
        setLoading(true);

        // Fetch platforms
        const platformsResponse = await axios.get<{
          status: boolean;
          message: string;
          data: {
            analytic_platforms: Platform[];
          };
        }>("http://127.0.0.1:8000/api/analyticcontent/get/platform");

        if (
          platformsResponse.data?.status &&
          platformsResponse.data?.data?.analytic_platforms
        ) {
          setAvailablePlatforms(platformsResponse.data.data.analytic_platforms);
        }

        // Fetch fields
        const fieldsResponse = await axios.get<{
          status: boolean;
          message: string;
          data: {
            fields: PlatformField[];
          };
        }>("http://127.0.0.1:8000/api/analyticcontent/get/field");

        if (fieldsResponse.data?.status && fieldsResponse.data?.data?.fields) {
          setPlatformFields(fieldsResponse.data.data.fields);

          // Initialize empty metrics state for each platform and field
          const newPlatformMetrics: MetricsState = {};

          // Group fields by platform
          const platforms = platformsResponse.data.data.analytic_platforms;
          platforms.forEach((platform: Platform) => {
            // Initialize fields for this platform
            newPlatformMetrics[platform.anp_name] = {};

            // Add all available fields for this platform
            const platformFieldList = fieldsResponse.data.data.fields.filter(
              (field: PlatformField) => field.anp_id === platform.anp_id
            );

            platformFieldList.forEach((field: PlatformField) => {
              newPlatformMetrics[platform.anp_name][field.anf_name] = "";
            });
          });

          setPlatformMetrics(newPlatformMetrics);
        }
      } catch (error) {
        console.error("Error fetching platforms and fields:", error);
        setErrorMessage("Failed to fetch platforms and fields data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformsAndFields();
  }, []);

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
  const filterAvailableTopics = (date: string): void => {
    if (!date || !topicsData.length) {
      return;
    }

    // Get list of lup_ids that already have analytics for the selected date
    const existingLupIds: number[] =
      existingAnalytics.length > 0
        ? existingAnalytics
            .filter((item) => item.anc_tanggal === date)
            .map((item) => item.lup_id)
        : []; // Empty array if no existing analytics

    // Filter topics that don't have analytics for the selected date
    const availableTopics = topicsData
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        let lupId: string | null = null;
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
          !existingLupIds.includes(parseInt(topic.lupId as string))
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
  const handleMetricChange = (
    platform: string,
    metric: string,
    value: string
  ): void => {
    setPlatformMetrics((prev) => ({
      ...prev,
      [platform]: {
        ...(prev as any)[platform],
        [metric]: value,
      },
    }));
  };

  // Custom validation for platform metrics
  const validateDynamicPlatformMetrics = (
    platforms: string[],
    metrics: MetricsState
  ): { success: boolean; error: PlatformErrorsState } => {
    const errors: PlatformErrorsState = {};
    let isValid = true;

    platforms.forEach((platform) => {
      if (!errors[platform]) errors[platform] = {};

      // Find all fields for this platform
      const platformFieldsList = getFieldsForPlatform(platform);

      // Check required fields
      platformFieldsList.forEach((field) => {
        if (field.anf_required === 1) {
          const value = metrics[platform]?.[field.anf_name];
          if (!value || value.trim() === "") {
            errors[platform][
              field.anf_name
            ] = `${field.anf_name} is required for ${platform}`;
            isValid = false;
          }
        }
      });
    });

    return {
      success: isValid,
      error: isValid ? {} : errors,
    };
  };

  // Create a new field via API
  const createFieldViaAPI = async (
    platformId: number,
    fieldName: string,
    required: boolean
  ): Promise<PlatformField | null> => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyticcontent/create/field",
        {
          anp_id: platformId,
          anf_name: fieldName.toLowerCase().replace(/\s+/g, "_"),
          anf_required: required ? 1 : 0,
        }
      );

      if (response.data?.status && response.data?.data?.field) {
        return response.data.data.field;
      }
      return null;
    } catch (error) {
      console.error("Error creating new field:", error);
      setErrorMessage("Failed to create new field");
      return null;
    }
  };

  // Handler to show the add field form
  const handleShowAddField = (platformName: string): void => {
    setAddFieldForm({
      platform: platformName,
      name: "",
      required: false,
    });
  };

  // Handler to save the new field
  const handleSaveNewField = async (): Promise<void> => {
    if (!addFieldForm || !addFieldForm.name.trim()) {
      // Validation: field name cannot be empty
      return;
    }

    const { platform, name, required } = addFieldForm;
    setIsAddingField(true);
    setLoading(true);

    try {
      const platformObj = availablePlatforms.find(
        (p) => p.anp_name === platform
      );
      if (!platformObj) {
        setErrorMessage("Platform not found");
        setIsAddingField(false);
        setLoading(false);
        return;
      }

      // Create a temporary field immediately for UI responsiveness
      // This gives immediate feedback before the API call completes
      const tempFieldName = name.toLowerCase().replace(/\s+/g, "_");
      const tempField: PlatformField = {
        anf_id: `temp-${Date.now()}`, // Temporary ID until we get the real one
        anp_id: platformObj.anp_id,
        anf_name: tempFieldName,
        anf_required: required ? 1 : 0,
        created_at: new Date().toISOString(),
        updated_at: null,
        platforms: [platformObj],
        custom: true,
      };

      // Update UI immediately with temporary field
      setPlatformFields((prevFields) => [...prevFields, tempField]);
      setPlatformMetrics((prev) => ({
        ...prev,
        [platform]: {
          ...(prev[platform] || {}),
          [tempFieldName]: "", // Initialize with empty value
        },
      }));

      console.log("Added temporary field:", tempField);
      console.log("Updated platformFields state:", [
        ...platformFields,
        tempField,
      ]);

      // Now make the API call
      const newField = await createFieldViaAPI(
        platformObj.anp_id,
        name,
        required
      );

      if (newField) {
        // Replace the temporary field with the real one from API
        setPlatformFields((prevFields) =>
          prevFields.map((field) =>
            field.anf_id === tempField.anf_id
              ? { ...newField, platforms: [platformObj], custom: true }
              : field
          )
        );

        console.log("Replaced temp field with real field from API:", newField);

        // Success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Field "${name}" has been added successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding new field:", error);
      setErrorMessage("Failed to add new field");

      // Remove the temporary field if API call fails
      setPlatformFields((prevFields) =>
        prevFields.filter((field) => !String(field.anf_id).startsWith("temp-"))
      );

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add new field. Please try again.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      // Reset the add field form, not the entire modal
      setAddFieldForm(null);
      setIsAddingField(false);
      setLoading(false);
    }
  };

  const handlePlatformChange = (platform: string): void => {
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

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      // Set loading state
      setLoading(true);
      setErrorMessage("");

      // Check if platforms selected
      if (!selectedPlatforms.length) {
        setErrorMessage("Silakan pilih minimal satu platform");
        setLoading(false);
        return;
      }

      // Validate platform metrics
      const validation = validateDynamicPlatformMetrics(
        selectedPlatforms,
        platformMetrics
      );

      if (!validation.success) {
        setPlatformErrors(validation.error);
        setLoading(false);
        return;
      }

      // Reset previous errors
      setPlatformErrors({});

      // Prepare data array with CORRECT FIELD NAMES
      const allDataToSubmit = [];

      // Loop through each selected platform
      for (const platform of selectedPlatforms) {
        const fields = getFieldsForPlatform(platform);
        const platformObj = availablePlatforms.find(
          (p) => p.anp_name === platform
        );
        if (!platformObj) continue;

        for (const field of fields) {
          const value = platformMetrics[platform]?.[field.anf_name];

          // Skip optional empty fields
          if (
            (value === "" || value === null || value === undefined) &&
            field.anf_required === 0
          ) {
            continue;
          }

          // IMPORTANT: Match the field names expected by backend
          allDataToSubmit.push({
            anc_tgl: data.anc_tanggal, // Changed from anc_tanggal to anc_tgl
            anc_hari: data.anc_hari,
            lup_id: parseInt(data.lup_id),
            anf_id: field.anf_id,
            value: parseInt(value || "0"),
          });
        }
      }

      // Make API request with correctly formatted data
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyticcontent/create",
        { inputs: allDataToSubmit }
      );

      if (response.data?.status) {
        // Success
        setSuccessMessage("Data berhasil disimpan!");

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Semua data telah berhasil disimpan.",
          timer: 1500,
          showConfirmButton: false,
        });
        
        await fetchAnalytics();
        setModalOpen(false);
        window.location.reload();
        reset();
      } else {
        // Failed
        setErrorMessage(
          "Gagal menyimpan data: " + (response.data?.message || "Unknown error")
        );

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menyimpan data. Silakan coba lagi.",
        });
      }
    } catch (error: any) {
      console.error("Error saat submit form:", error);

      // Add debugging to see the exact error
      if (error.response) {
        console.error("Error response:", error.response.data);
        setErrorMessage(
          `Gagal: ${error.response.data.message || "Unknown error"}`
        );
      } else {
        setErrorMessage("Gagal menyimpan data. Silakan coba lagi.");
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal menyimpan data. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onAdd = (): void => {
    setModalOpen(true);
    setSelectedPlatforms([]);
    setErrorMessage("");
    setSuccessMessage("");
    reset();
    setPlatformsDisabled(false);

    // Reset platform metrics
    const newPlatformMetrics: MetricsState = {};
    availablePlatforms.forEach((platform) => {
      newPlatformMetrics[platform.anp_name] = {};

      // Add fields for this platform
      const platformFieldsList = getFieldsForPlatform(platform.anp_name);

      platformFieldsList.forEach((field) => {
        newPlatformMetrics[platform.anp_name][field.anf_name] = "";
      });
    });

    setPlatformMetrics(newPlatformMetrics);

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setValue("anc_tanggal", today);
  };

  const handleCancel = (): void => {
    setModalOpen(false);
    reset();
  };

  // Fetch analytics data
  const fetchAnalytics = async (): Promise<number> => {
    try {
      const response = await axios.get<{
        status: boolean;
        message: string;
        data: {
          analytic_content: AnalyticData[];
        };
      }>("http://127.0.0.1:8000/api/analyticcontent");

      // Check if response has the expected structure and contains data
      if (response.data?.status && response.data?.data?.analytic_content) {
        setExistingAnalytics(response.data.data.analytic_content);
      } else {
        console.log("No analytics data available");
        setExistingAnalytics([]);
      }
      return 1;
    } catch (err) {
      console.log("Failed to fetch analytics data");
      setExistingAnalytics([]);
      return 0;
    }
  };

  // Fetch topics and analytics on component mount
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
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

  // Helper function to get fields for a specific platform
  // Helper function to get fields for a specific platform
  const getFieldsForPlatform = (platformName: string): PlatformField[] => {
    const platform = availablePlatforms.find(
      (p) => p.anp_name === platformName
    );

    if (!platform) return [];

    // Direct debugging to see what fields are available
    console.log(`Getting fields for platform ${platformName}:`, platformFields);

    return platformFields.filter((field) => {
      // Include custom fields created for this platform
      if (field.custom && field.anp_id === platform.anp_id) {
        console.log(`Found custom field for ${platformName}:`, field);
        return true;
      }

      // Include standard fields from API that match this platform
      if (Array.isArray(field.platforms)) {
        const matchingPlatform = field.platforms.find(
          (p) => p.anp_id === platform.anp_id
        );
        if (matchingPlatform) {
          return true;
        }
      } else if (field.anp_id === platform.anp_id) {
        return true;
      }

      return false;
    });
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

                  {/* Platform selection - Dynamic from API */}
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
                      {loading ? (
                        <div>Loading platforms...</div>
                      ) : availablePlatforms.length === 0 ? (
                        <div>No platforms available</div>
                      ) : (
                        availablePlatforms.map((platform) => {
                          const platformName = platform.anp_name;
                          const isSelected =
                            selectedPlatforms.includes(platformName);
                          const displayName =
                            platformName.charAt(0).toUpperCase() +
                            platformName.slice(1);

                          // Get fields for this platform
                          const fields = getFieldsForPlatform(platformName);

                          // Check if this platform has the add field form open
                          const isAddingField =
                            addFieldForm &&
                            addFieldForm.platform === platformName;

                          return (
                            <div key={platform.anp_id} className="mb-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <Checkbox
                                  id={`platform-${platformName}`}
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    handlePlatformChange(platformName)
                                  }
                                  disabled={platformsDisabled}
                                  className={
                                    platformsDisabled
                                      ? "cursor-not-allowed"
                                      : ""
                                  }
                                />
                                <label
                                  htmlFor={`platform-${platformName}`}
                                  className="text-sm font-medium leading-none"
                                >
                                  {displayName}
                                </label>
                              </div>

                              {isSelected && (
                                <div className="ml-6 space-y-1">
                                  {fields.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {fields.map((field) => (
                                        <div
                                          key={`${platformName}-${field.anf_name}-${field.anf_id}`} // Add anf_id to key for better tracking
                                          className="flex items-center space-x-2"
                                        >
                                          <Label
                                            htmlFor={`${platformName}-${field.anf_name}`}
                                            className="w-16 text-xs"
                                          >
                                            {field.anf_name
                                              .charAt(0)
                                              .toUpperCase() +
                                              field.anf_name.slice(1)}
                                            {field.anf_required === 1 && (
                                              <span className="text-red-500">
                                                {" "}
                                                *
                                              </span>
                                            )}
                                          </Label>
                                          <Input
                                            type="number"
                                            min="0"
                                            id={`${platformName}-${field.anf_name}`}
                                            className="h-7 w-24"
                                            placeholder="0"
                                            value={
                                              platformMetrics[platformName]?.[
                                                field.anf_name
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              handleMetricChange(
                                                platformName,
                                                field.anf_name,
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Add Field Form */}
                                  {isAddingField ? (
                                    <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div>
                                          <Label
                                            htmlFor="new-field-name"
                                            className="text-xs block mb-1"
                                          >
                                            Nama Field
                                          </Label>
                                          <Input
                                            type="text"
                                            id="new-field-name"
                                            className="h-7 w-full"
                                            placeholder="Nama field"
                                            value={addFieldForm.name}
                                            onChange={(e) =>
                                              setAddFieldForm({
                                                ...addFieldForm,
                                                name: e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="flex-shrink-0 mt-5">
                                          <div className="flex items-center gap-2">
                                            <Checkbox
                                              id="new-field-required"
                                              checked={addFieldForm.required}
                                              onCheckedChange={(checked) =>
                                                setAddFieldForm({
                                                  ...addFieldForm,
                                                  required: checked === true,
                                                })
                                              }
                                            />
                                            <Label
                                              htmlFor="new-field-required"
                                              className="text-xs cursor-pointer"
                                            >
                                              Required
                                            </Label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setAddFieldForm(null)}
                                          className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
                                        >
                                          Batal
                                        </button>
                                        <button
                                          type="button"
                                          onClick={handleSaveNewField}
                                          className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                          Simpan
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleShowAddField(platformName)
                                      }
                                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      Tambah Input Field Baru
                                    </button>
                                  )}

                                  {/* Show error messages with reduced spacing */}
                                  {platformErrors &&
                                    platformErrors[platformName] &&
                                    Object.keys(platformErrors[platformName])
                                      .length > 0 && (
                                      <div className="pt-1">
                                        {Object.keys(
                                          platformErrors[platformName]
                                        ).map((fieldName) => (
                                          <div
                                            key={`error-${platformName}-${fieldName}`}
                                            className="text-red-500 text-xs sentence-case"
                                          >
                                            {fieldName} wajib diisi untuk{" "}
                                            {displayName}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
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
