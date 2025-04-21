import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Hash,
  Book,
  PenSquare,
  BarChart4,
  Trash,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import UpdateAnalytic from "./update";

// Define the types to match the API response
export type AnalyticField = {
  name: string;
  required: boolean;
};

export type AnalyticPlatform = {
  name: string;
};

export type AnalyticContent = {
  anc_id: number;
  anc_tanggal: string;
  anc_hari: string;
  lup_id: number;
  topik_konten: string;
  platform: AnalyticPlatform;
  field: AnalyticField;
  value: number | string;
  created_at: string;
  updated_at: string;
};

// Define a consolidated type for the processed data
export type Analytic = {
  anc_id: number;
  anc_tanggal: string;
  anc_hari: string;
  date: string;
  day: string;
  lup_id: number;
  topik_konten: string;
  platforms: {
    [platform: string]: {
      [field: string]: string | number;
    };
  };
  created_at: string;
  updated_at: string;
  value: any;
};

// API response types
interface Platform {
  anp_id: number;
  anp_name: string;
  created_at: string;
  updated_at: string;
}

interface Field {
  anf_id: number;
  anp_id: number;
  anf_name: string;
  anf_required: number;
  created_at: string | null;
  updated_at: string | null;
  platforms: Platform[];
}

// Helper function to process raw API data into the format we need
export const processAnalyticData = (data: AnalyticContent[]): Analytic[] => {
  // Group by date and lup_id
  const groupedData: { [key: string]: Analytic } = {};

  data.forEach((item) => {
    const key = `${item.anc_tanggal}_${item.lup_id}`;

    // Create or update the entry
    if (!groupedData[key]) {
      groupedData[key] = {
        anc_id: item.anc_id, // Using the first anc_id for this group
        anc_tanggal: item.anc_tanggal,
        anc_hari: item.anc_hari,
        date: item.anc_tanggal,
        day: item.anc_hari,
        lup_id: item.lup_id,
        topik_konten: item.topik_konten,
        platforms: {},
        created_at: item.created_at,
        updated_at: item.updated_at,
        value: item.value,
      };
    }

    // Initialize platform if not exists
    if (!groupedData[key].platforms[item.platform.name]) {
      groupedData[key].platforms[item.platform.name] = {};
    }

    // Add field value to platform
    const fieldKey = `acr_${item.field.name}`;
    groupedData[key].platforms[item.platform.name][fieldKey] = item.value;
  });

  // Convert the object to array
  return Object.values(groupedData);
};

// Komponen statistik untuk memvisualisasikan nilai
const StatItem = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => {
  // Konversi nilai numerik untuk ditampilkan dengan lebih baik
  const formattedValue =
    value === "-" || value === undefined || value === null
      ? "-"
      : parseInt(value.toString()) > 1000
      ? `${(parseInt(value.toString()) / 1000).toFixed(1)}K`
      : value;

  // Color mapping berdasarkan metric
  const getColorClass = () => {
    switch (label) {
      case "Reach":
      case "Views":
        return "text-blue-600";
      case "Like":
        return "text-red-500";
      case "Comment":
        return "text-amber-500";
      case "Shares":
      case "Retweet":
        return "text-green-500";
      case "Saves":
        return "text-purple-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex justify-center p-1 ${
              value !== "-" && value !== undefined && value !== null
                ? getColorClass()
                : "text-gray-400"
            }`}
          >
            <span className="font-medium">{formattedValue}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {value}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Platform Header Component
const PlatformHeader = ({
  platform,
  metrics,
  width,
}: {
  platform: string;
  metrics: { label: string }[];
  width: string;
}) => {
  return (
    <div className={width} style={{ width }}>
      <div className="border-y py-2 bg-gray-50 flex items-center justify-center font-medium text-sm">
        <span>{platform}</span>
      </div>
      <div className="flex w-full">
        {metrics.length > 0 ? (
          metrics.map((metric, idx) => (
            <div
              key={idx}
              className="flex-1 py-1 text-center text-xs flex items-center justify-center"
            >
              {metric.label}
            </div>
          ))
        ) : (
          <div className="w-full py-1 text-center text-xs text-gray-500 italic">
            Tidak ada field
          </div>
        )}
      </div>
    </div>
  );
};

// Platform Metrics Component
const PlatformMetrics = ({
  platformName,
  platformData,
  metrics,
  width,
}: {
  platformName: string;
  platformData: any;
  metrics: { field: string; label: string }[];
  width: string;
}) => {
  const getPlatformValue = (field: string) => {
    if (!platformData || !platformData[platformName.toLowerCase()]) return "-";
    return platformData[platformName.toLowerCase()][field] || "-";
  };

  // Check if we have any data for this platform
  const hasPlatformData =
    platformData && platformData[platformName.toLowerCase()];

  if (metrics.length === 0) {
    return (
      <div className={width} style={{ width }}>
        <div className="w-full py-2 text-center text-xs text-gray-500 italic">
          -
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${width}`} style={{ width }}>
      {metrics.map((metric, idx) => (
        <div key={idx} className="flex-1">
          <StatItem
            value={getPlatformValue(metric.field)}
            label={metric.label}
          />
        </div>
      ))}
    </div>
  );
};

// Custom hook to fetch platform and field data
export const usePlatformData = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformsResponse, fieldsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/platform"),
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/field"),
        ]);

        setPlatforms(platformsResponse.data.data.analytic_platforms);
        setFields(fieldsResponse.data.data.fields);
      } catch (error) {
        console.error("Error fetching platform data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { platforms, fields, loading };
};

// Platform width configuration
const getPlatformWidth = (platformName: string, metricCount: number) => {
  // Standardized width for each platform based on metric count
  return metricCount === 0 ? "120px" : `${metricCount * 80}px`;
};

export const createColumns = (onlinePlanners: any[]): ColumnDef<Analytic>[] => {
  // Using the custom hook to get platform data
  const { platforms, fields, loading } = usePlatformData();

  // Group fields by platform
  const getFieldsByPlatform = (platformId: number) => {
    return fields.filter((field) => field.anp_id === platformId);
  };

  return [
    {
      accessorKey: "anc_id",
      header: () => (
        <div className="font-semibold text-center p-3">
          <div className="flex items-center justify-center gap-1">
            <p>No</p>
          </div>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
            {row.index + 1}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: () => (
        <div className="font-semibold text-center">
          <div className="flex items-center justify-center gap-1">
            <Calendar size={16} />
            <p>Tanggal</p>
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const days = {
          senin: "monday",
          selasa: "tuesday",
          rabu: "wednesday",
          kamis: "thursday",
          jumat: "friday",
          sabtu: "saturday",
          minggu: "sunday",
        };

        const dayKey = row.original.day.toLowerCase() as keyof typeof days;
        const dayClass =
          dayKey === "sabtu" || dayKey === "minggu"
            ? "bg-orange-100 text-orange-800"
            : "bg-blue-100 text-blue-800";

        // Format tanggal dari string menjadi format "DD MMMM YYYY"
        const formatDate = (dateString: string) => {
          try {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
              day: "numeric",
              month: "long",
              year: "numeric",
            };
            return date.toLocaleDateString("id-ID", options);
          } catch (error) {
            return dateString; // Jika format tidak valid, kembalikan string aslinya
          }
        };

        return (
          <div className="w-[180px]">
            <p className="text-center font-medium capitalize">
              {row.original.day}, {formatDate(row.original.date)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "topik_konten",
      header: () => (
        <div className="font-semibold text-center">
          <div className="flex items-center justify-center gap-1">
            <Book size={16} />
            <p>Topik Konten</p>
          </div>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="w-[300px] p-1">
            <div className="flex items-center">
              <PenSquare
                size={16}
                className="mr-2 flex-shrink-0 text-gray-500"
              />
              <p className="text-left truncate">
                {row.original.topik_konten || "-"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "platforms",
      header: () => {
        if (loading) {
          return <div>Loading platforms...</div>;
        }

        return (
          <div className="font-semibold text-center border-b border-gray-200 w-full">
            <div className="flex items-center justify-center gap-1 my-2">
              <BarChart4 size={18} />
              <p>Social Media Analytics Report</p>
            </div>
            <div className="flex w-full">
              {platforms.map((platform) => {
                // Get all fields for this platform
                const platformFields = getFieldsByPlatform(platform.anp_id);

                // If it's website, handle specially
                if (platform.anp_name === "website") {
                  return (
                    <div
                      key={platform.anp_id}
                      className="flex-shrink-0"
                      style={{ width: "100px" }}
                    >
                      <div className="border-y py-2 text-center bg-gray-50 flex items-center justify-center font-medium w-full">
                        <span>Website</span>
                      </div>
                      <div className="w-full">
                        <div className="py-1 text-center text-xs w-full flex items-center justify-center">
                          Reach
                        </div>
                      </div>
                    </div>
                  );
                }

                // Create metrics for this platform
                const metrics = platformFields.map((field) => ({
                  label:
                    field.anf_name.charAt(0).toUpperCase() +
                    field.anf_name.slice(1),
                }));

                const platformName =
                  platform.anp_name.charAt(0).toUpperCase() +
                  platform.anp_name.slice(1);

                const width = getPlatformWidth(
                  platform.anp_name,
                  metrics.length
                );

                return (
                  <div
                    key={platform.anp_id}
                    className="flex-shrink-0"
                    style={{ width }}
                  >
                    <PlatformHeader
                      platform={platformName}
                      metrics={metrics}
                      width={width}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const platformsData = row.original.platforms || {};

        if (loading) {
          return <div>Loading...</div>;
        }

        return (
          <div className="flex w-full divide-x divide-gray-200 hover:bg-gray-50 transition-colors">
            {platforms.map((platform) => {
              // If it's website, handle specially
              if (platform.anp_name === "website") {
                const hasWebsiteData =
                  platformsData.website && platformsData.website.acr_reach;

                return (
                  <div
                    key={platform.anp_id}
                    className="flex-shrink-0"
                    style={{ width: "100px" }}
                  >
                    {hasWebsiteData ? (
                      <div className="flex items-center justify-center h-full">
                        <StatItem
                          value={platformsData.website?.acr_reach || "-"}
                          label="Reach"
                        />
                      </div>
                    ) : (
                      <div className="py-2 text-center text-xs text-gray-500 italic">
                        -
                      </div>
                    )}
                  </div>
                );
              }

              // Get all fields for this platform
              const platformFields = getFieldsByPlatform(platform.anp_id);

              // Create metrics for this platform
              const metrics = platformFields.map((field) => ({
                field: `acr_${field.anf_name}`,
                label:
                  field.anf_name.charAt(0).toUpperCase() +
                  field.anf_name.slice(1),
              }));

              const width = getPlatformWidth(platform.anp_name, metrics.length);

              return (
                <div
                  key={platform.anp_id}
                  className="flex-shrink-0"
                  style={{ width }}
                >
                  <PlatformMetrics
                    platformName={platform.anp_name}
                    platformData={platformsData}
                    metrics={metrics}
                    width={width}
                  />
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "Actions",
      header: () => (
        <div className="font-semibold text-center">
          <p>Aksi</p>
        </div>
      ),
      cell: ({ row, table }) => {
        const meta = table.options.meta as {
          handleDelete: (id: number) => void;
          setSelectedItem: (id: number) => void;
        };
        const rowData = row.original;
        console.log("checking row", rowData);

        // Extract required data for UpdateAnalytic
        return (
          <div className="w-[80px] flex justify-center gap-1">
            <UpdateAnalytic
              id={rowData.anc_id}
              currentDate={rowData.date}
              currentDay={rowData.day}
              currentTopic={rowData.lup_id?.toString() || ""}
              currentPlatform={rowData.platforms} // Make sure this matches the prop name
            />
            <Button
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 h-8 w-10 text-xs px-3 rounded-md"
              onClick={() => meta.handleDelete(rowData.anc_id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        );
      },
    },
  ];
};
