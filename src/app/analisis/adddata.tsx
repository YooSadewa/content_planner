import { useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

// Define types for our data structures
interface Topic {
  label: string;
  value: string;
  onpId: number;
  platforms: string;
  lupId: number | null;
}

interface Platform {
  anp_id: number;
  anp_name: string;
}

interface Field {
  anf_id: string | number;
  anp_id: number;
  anf_name: string;
  anf_required: number;
  created_at: string;
  updated_at: string | null;
  platforms?: Platform[];
  custom?: boolean;
}

interface PlatformMetrics {
  [platform: string]: {
    [field: string]: string;
  };
}

interface PlatformErrors {
  [platform: string]: {
    [field: string]: string;
  };
}

interface AddFieldForm {
  platform: string;
  name: string;
  required: boolean;
}

interface AnalyticContentInput {
  anc_tgl: string;
  anc_hari: string;
  lup_id: number;
  anf_id: string | number;
  value: number;
}

export default function CreateAnalytic(): JSX.Element {
  // Modal state
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Form data
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [topics, setTopics] = useState<Topic[]>([]);

  // Platform related states
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [platformFields, setPlatformFields] = useState<Field[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformsDisabled, setPlatformsDisabled] = useState<boolean>(false);

  // Metrics and errors
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({});
  const [platformErrors, setPlatformErrors] = useState<PlatformErrors>({});

  // New field form
  const [addFieldForm, setAddFieldForm] = useState<AddFieldForm | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update day of week when date changes
  useEffect(() => {
    if (selectedDate) {
      updateDayOfWeek(selectedDate);
      filterAvailableTopics(selectedDate);
    }
  }, [selectedDate]);

  // Update platforms when topic changes
  useEffect(() => {
    if (selectedTopicId && topics.length > 0) {
      const selectedTopic = topics.find(
        (topic) => topic.lupId?.toString() === selectedTopicId.toString()
      );

      if (selectedTopic && selectedTopic.platforms) {
        const platformList = selectedTopic.platforms
          .split(",")
          .map((p) => p.trim().toLowerCase());
        setSelectedPlatforms(platformList);
        setPlatformsDisabled(true);
      }
    } else {
      setPlatformsDisabled(false);
    }
  }, [selectedTopicId, topics]);

  // Fetch initial data (topics, platforms, fields)
  const fetchInitialData = async (): Promise<void> => {
    try {
      setLoading(true);

      // Fetch topics
      const topicsResponse = await axios.get(
        "http://127.0.0.1:8000/api/onlinecontentplanner"
      );
      if (topicsResponse.data?.data?.online_planners) {
        setTopics(
          topicsResponse.data.data.online_planners.map((item: any) => ({
            label: item.onp_topik_konten,
            value: item.onp_id,
            onpId: item.onp_id,
            platforms: item.onp_platform,
            lupId: item.platforms?.lup_id || null,
          }))
        );
      }

      // Fetch platforms
      const platformsResponse = await axios.get(
        "http://127.0.0.1:8000/api/analyticcontent/get/platform"
      );
      if (platformsResponse.data?.data?.analytic_platforms) {
        setAvailablePlatforms(platformsResponse.data.data.analytic_platforms);
      }

      // Fetch fields
      const fieldsResponse = await axios.get(
        "http://127.0.0.1:8000/api/analyticcontent/get/field"
      );
      if (fieldsResponse.data?.data?.fields) {
        setPlatformFields(fieldsResponse.data.data.fields);

        // Initialize metrics state
        const newMetrics: PlatformMetrics = {};
        platformsResponse.data.data.analytic_platforms.forEach(
          (platform: Platform) => {
            newMetrics[platform.anp_name] = {};

            const platformFieldList = fieldsResponse.data.data.fields.filter(
              (field: Field) => field.anp_id === platform.anp_id
            );

            platformFieldList.forEach((field: Field) => {
              newMetrics[platform.anp_name][field.anf_name] = "";
            });
          }
        );

        setPlatformMetrics(newMetrics);
      }

      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      updateDayOfWeek(today);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setErrorMessage("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to update day of week
  const updateDayOfWeek = (date: string): void => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const dayName = days[new Date(date).getDay()];
    setDayOfWeek(dayName);
  };

  // Filter available topics based on date
  const filterAvailableTopics = async (date: string): Promise<void> => {
    try {
      // Get analytics data for the selected date
      const response = await axios.get(
        "http://127.0.0.1:8000/api/analyticcontent"
      );
      const existingAnalytics = response.data?.data?.analytic_content || [];

      // Get list of topic IDs that already have analytics for this date
      const usedTopicIds = existingAnalytics
        .filter((item: any) => item.anc_tanggal === date)
        .map((item: any) => item.lup_id);

      // Filter out topics that already have analytics for this date
      const availableTopics = topics.filter(
        (topic) =>
          topic.lupId &&
          !usedTopicIds.includes(parseInt(topic.lupId.toString()))
      );

      setTopics(availableTopics);
    } catch (error) {
      console.error("Error filtering topics:", error);
    }
  };

  // Handle platform selection
  const handlePlatformChange = (platform: string): void => {
    if (platformsDisabled) return;

    const normalizedPlatform = platform.toLowerCase();

    setSelectedPlatforms((prev) => {
      if (prev.includes(normalizedPlatform)) {
        return prev.filter((p) => p !== normalizedPlatform);
      } else {
        return [...prev, normalizedPlatform];
      }
    });
  };

  // Handle metric value changes
  const handleMetricChange = (
    platform: string,
    field: string,
    value: string
  ): void => {
    setPlatformMetrics((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  // Show add field form
  const handleShowAddField = (platform: string): void => {
    setAddFieldForm({
      platform,
      name: "",
      required: false,
    });
  };

  // Save new field
  const handleSaveNewField = async (): Promise<void> => {
    if (!addFieldForm || !addFieldForm.name.trim()) return;

    const { platform, name, required } = addFieldForm;
    setLoading(true);

    try {
      const platformObj = availablePlatforms.find(
        (p) => p.anp_name === platform
      );
      if (!platformObj) {
        setErrorMessage("Platform not found");
        return;
      }

      // Create field name (lowercase, replace spaces with underscores)
      const fieldName = name.toLowerCase().replace(/\s+/g, "_");

      // Create a temporary field for immediate UI feedback
      const tempField: Field = {
        anf_id: `temp-${Date.now()}`,
        anp_id: platformObj.anp_id,
        anf_name: fieldName,
        anf_required: required ? 1 : 0,
        created_at: new Date().toISOString(),
        updated_at: null,
        platforms: [platformObj],
        custom: true,
      };

      // Update UI immediately
      setPlatformFields((prev) => [...prev, tempField]);
      setPlatformMetrics((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [fieldName]: "",
        },
      }));

      // Make API request to create field
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyticcontent/create/field",
        {
          anp_id: platformObj.anp_id,
          anf_name: fieldName,
          anf_required: required ? 1 : 0,
        }
      );

      if (response.data?.status && response.data?.data?.field) {
        // Replace temporary field with real one
        setPlatformFields((prev) =>
          prev.map((field) =>
            field.anf_id === tempField.anf_id
              ? {
                  ...response.data.data.field,
                  platforms: [platformObj],
                  custom: true,
                }
              : field
          )
        );

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Field "${name}" has been added successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding field:", error);
      setErrorMessage("Failed to add new field");

      // Remove temporary field if API call fails
      setPlatformFields((prev) =>
        prev.filter((field) => !String(field.anf_id).startsWith("temp-"))
      );

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add new field. Please try again.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setAddFieldForm(null);
      setLoading(false);
    }
  };

  // Get fields for a specific platform
  const getFieldsForPlatform = (platformName: string): Field[] => {
    const platform = availablePlatforms.find(
      (p) => p.anp_name === platformName
    );
    if (!platform) return [];

    return platformFields.filter((field) => {
      // Include custom fields for this platform
      if (field.custom && field.anp_id === platform.anp_id) {
        return true;
      }

      // Include standard fields
      return field.anp_id === platform.anp_id;
    });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: PlatformErrors = {};
    let isValid = true;

    // Validate date
    if (!selectedDate) {
      setErrorMessage("Please select a date");
      return false;
    }

    // Validate topic
    if (!selectedTopicId) {
      setErrorMessage("Please select a topic");
      return false;
    }

    // Validate platforms
    if (selectedPlatforms.length === 0) {
      setErrorMessage("Please select at least one platform");
      return false;
    }

    // Validate metrics for each platform
    selectedPlatforms.forEach((platform) => {
      if (!errors[platform]) errors[platform] = {};

      const fields = getFieldsForPlatform(platform);

      fields.forEach((field) => {
        if (field.anf_required === 1) {
          const value = platformMetrics[platform]?.[field.anf_name];
          if (!value || value.trim() === "") {
            errors[platform][
              field.anf_name
            ] = `${field.anf_name} is required for ${platform}`;
            isValid = false;
          }
        }
      });
    });

    setPlatformErrors(isValid ? {} : errors);
    return isValid;
  };

  // Submit form
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      // Validate form
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const dataToSubmit: AnalyticContentInput[] = [];

      // For each selected platform, collect field values
      for (const platform of selectedPlatforms) {
        const fields = getFieldsForPlatform(platform);
        const platformObj = availablePlatforms.find(
          (p) => p.anp_name === platform
        );
        if (!platformObj) continue;

        for (const field of fields) {
          const value = platformMetrics[platform]?.[field.anf_name];

          // Skip empty optional fields
          if (!value && field.anf_required === 0) continue;

          dataToSubmit.push({
            anc_tgl: selectedDate,
            anc_hari: dayOfWeek,
            lup_id: parseInt(selectedTopicId),
            anf_id: field.anf_id,
            value: parseInt(value || "0"),
          });
        }
      }

      // Submit data to API
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyticcontent/create",
        { inputs: dataToSubmit }
      );

      if (response.data?.status) {
        setSuccessMessage("Data saved successfully!");

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data has been saved successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        setModalOpen(false);
        window.location.reload();
      } else {
        setErrorMessage(
          "Failed to save data: " + (response.data?.message || "Unknown error")
        );

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save data. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      setErrorMessage("Failed to save data. Please try again.");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open modal
  const handleOpenModal = (): void => {
    setModalOpen(true);
    setSelectedPlatforms([]);
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedTopicId("");
    setPlatformsDisabled(false);

    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    updateDayOfWeek(today);

    // Reset platform metrics
    const newMetrics: PlatformMetrics = {};
    availablePlatforms.forEach((platform) => {
      newMetrics[platform.anp_name] = {};

      const fields = getFieldsForPlatform(platform.anp_name);
      fields.forEach((field) => {
        newMetrics[platform.anp_name][field.anf_name] = "";
      });
    });

    setPlatformMetrics(newMetrics);
  };

  // Close modal
  const handleCloseModal = (): void => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700"
        onClick={handleOpenModal}
      >
        <Calendar className="h-4 w-4 mr-2" />
        Add Data
      </Button>

      {isModalOpen && (
        <AlertDialog defaultOpen open>
          <AlertDialogContent>
            <form onSubmit={handleSubmit}>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Analytics Data</AlertDialogTitle>

                <div className="pt-1 pb-4 w-full flex flex-col gap-3">
                  {/* Date and Day Fields */}
                  <div className="flex gap-5">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="day">
                        Day <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="day"
                        value={dayOfWeek}
                        readOnly
                        className="cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Topic Selection */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="topic">
                      Content Topic <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => setSelectedTopicId(value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full text-black">
                        <SelectValue
                          placeholder={
                            loading ? "Loading..." : "Select Content Topic"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.length === 0 ? (
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
                  </div>

                  {/* Platform Selection */}
                  <div className="grid items-center gap-1.5">
                    <Label htmlFor="platforms" className="mb-1">
                      Social Media Platforms
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

                          const fields = getFieldsForPlatform(platformName);
                          const isAddingField =
                            addFieldForm &&
                            addFieldForm.platform === platformName;

                          return (
                            <div key={platform.anp_id} className="mb-2">
                              {/* Platform Checkbox */}
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

                              {/* Platform Fields */}
                              {isSelected && (
                                <div className="ml-6 space-y-1">
                                  {fields.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {fields.map((field) => (
                                        <div
                                          key={`${platformName}-${field.anf_name}-${field.anf_id}`}
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

                                  {/* Add New Field Form */}
                                  {isAddingField ? (
                                    <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div>
                                          <Label
                                            htmlFor="new-field-name"
                                            className="text-xs block mb-1"
                                          >
                                            Field Name
                                          </Label>
                                          <Input
                                            type="text"
                                            id="new-field-name"
                                            className="h-7 w-full"
                                            placeholder="Field name"
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
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          onClick={handleSaveNewField}
                                          className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                          Save
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
                                      Add New Field
                                    </button>
                                  )}

                                  {/* Field Errors */}
                                  {platformErrors[platformName] &&
                                    Object.keys(platformErrors[platformName])
                                      .length > 0 && (
                                      <div className="pt-1">
                                        {Object.keys(
                                          platformErrors[platformName]
                                        ).map((fieldName) => (
                                          <div
                                            key={`error-${platformName}-${fieldName}`}
                                            className="text-red-500 text-xs"
                                          >
                                            {fieldName} is required for{" "}
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
                  </div>
                </div>

                {/* Error and Success Messages */}
                {errorMessage && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-500">{successMessage}</div>
                )}
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel type="button" onClick={handleCloseModal}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Save"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
