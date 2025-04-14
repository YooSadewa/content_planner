import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Book,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BarChart4,
  Globe,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

// Define types for API responses
type Platform = {
  anp_id: number;
  anp_name: string;
  created_at: string;
  updated_at: string;
};

type Field = {
  anf_id: number;
  anp_id: number;
  anf_name: string;
  anf_required: number;
  created_at: string | null;
  updated_at: string | null;
  platforms: Platform[];
};

// Map platform names to their respective icons
const platformIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: FaTiktok,
  website: Globe,
};

// Map field names to their respective icons
const fieldIcons: Record<string, any> = {
  reach: Eye,
  like: Heart,
  comment: MessageCircle,
  share: Share2,
  save: Bookmark,
};

// Platform Header Component
const PlatformHeader = ({
  platform,
  fields,
}: {
  platform: Platform;
  fields: Field[];
}) => {
  const PlatformIcon = platformIcons[platform.anp_name.toLowerCase()] || Globe;

  // Get fields that belong to this platform
  const platformFields = fields.filter(
    (field) => field.anp_id === platform.anp_id
  );

  return (
    <div className="w-full">
      <div className="border-y border-e p-2 bg-gray-50 flex items-center justify-center gap-2 font-medium">
        <PlatformIcon size={18} />
        <span className="capitalize">{platform.anp_name}</span>
      </div>
      <div className="flex w-full">
        {platformFields.length > 0 ? (
          platformFields.map((field) => {
            const FieldIcon = fieldIcons[field.anf_name.toLowerCase()] || Eye;
            return (
              <div
                key={field.anf_id}
                className="p-1 text-center text-xs border-e flex flex-col items-center justify-center"
                style={{
                  width:
                    platformFields.length > 0
                      ? `${100 / platformFields.length}%`
                      : "100%",
                }}
              >
                <FieldIcon size={12} className="mb-1" />
                <span className="capitalize">{field.anf_name}</span>
              </div>
            );
          })
        ) : (
          <div className="p-1 w-full text-center text-xs border-e flex flex-col items-center justify-center">
            <Eye size={12} className="mb-1" />
            Reach
          </div>
        )}
      </div>
    </div>
  );
};

// Platform Metrics Component for displaying actual data
const PlatformMetrics = ({
  platformName,
  platformData,
  fields,
}: {
  platformName: string;
  platformData: any;
  fields: Field[];
}) => {
  // Get fields for this specific platform
  const platformFields = fields.filter(
    (field) =>
      field.platforms[0]?.anp_name.toLowerCase() === platformName.toLowerCase()
  );

  const getPlatformValue = (field: string) => {
    if (!platformData || !platformData[platformName.toLowerCase()]) return "-";
    return platformData[platformName.toLowerCase()][`acr_${field}`] || "-";
  };

  return (
    <div className="flex w-full divide-x divide-gray-200">
      {platformFields.length > 0 ? (
        platformFields.map((field) => {
          const FieldIcon = fieldIcons[field.anf_name.toLowerCase()] || Eye;
          return (
            <div
              key={field.anf_id}
              className="flex flex-col items-center justify-center p-2"
              style={{
                width:
                  platformFields.length > 0
                    ? `${100 / platformFields.length}%`
                    : "100%",
              }}
            >
              <FieldIcon size={16} className="mb-1" />
              <span className="font-medium">
                {getPlatformValue(field.anf_name)}
              </span>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center p-2 w-full">
          <Eye size={16} className="mb-1" />
          <span className="font-medium">{getPlatformValue("reach")}</span>
        </div>
      )}
    </div>
  );
};

// Dynamic Header Component
export const DynamicHeader = ({ data }: { data: any[] }) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch platforms and fields
    const fetchData = async () => {
      try {
        setLoading(true);

        const [platformsResponse, fieldsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/platform"),
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/field"),
        ]);

        if (platformsResponse.data.status) {
          setPlatforms(platformsResponse.data.data.analytic_platforms);
        }

        if (fieldsResponse.data.status) {
          setFields(fieldsResponse.data.data.fields);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load platforms and fields");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="font-semibold text-center border-b border-gray-200 p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
          <p>Loading platforms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-semibold text-center border-b border-gray-200 p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Calculate total width based on number of platforms
  const totalWidth = platforms.length * 200; // 200px per platform

  return (
    <div
      className="font-semibold text-center border-b border-gray-200"
      style={{ width: `${totalWidth}px` }}
    >
      <div className="flex items-center justify-center gap-1 my-2">
        <BarChart4 size={18} />
        <p>Social Media Analytics Report</p>
      </div>
      <div className="flex w-full">
        {platforms.map((platform) => (
          <div key={platform.anp_id} className="w-[200px]">
            <PlatformHeader platform={platform} fields={fields} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Export a function to create table columns with dynamic platforms
export const createDynamicColumn = (platforms: Platform[], fields: Field[]) => {
  return {
    accessorKey: "platforms",
    header: () => <DynamicHeader data={[]} />,
    cell: ({ row } : any) => {
      const platformsData = row.original.platforms || {};

      return (
        <div
          className="flex w-full divide-x divide-gray-200 hover:bg-gray-50 transition-colors"
          style={{ width: `${platforms.length * 200}px` }}
        >
          {platforms.map((platform) => (
            <div key={platform.anp_id} className="w-[200px]">
              <PlatformMetrics
                platformName={platform.anp_name}
                platformData={platformsData}
                fields={fields}
              />
            </div>
          ))}
        </div>
      );
    },
  };
};

// Main component to fetch data and render the column
export const DynamicPlatformColumn = ({
  onDataLoaded,
}: {
  onDataLoaded?: (data: any) => void;
}) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch platforms and fields
    const fetchData = async () => {
      try {
        setLoading(true);

        const [platformsResponse, fieldsResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/platform"),
          axios.get("http://127.0.0.1:8000/api/analyticcontent/get/field"),
        ]);

        if (platformsResponse.data.status) {
          setPlatforms(platformsResponse.data.data.analytic_platforms);
        }

        if (fieldsResponse.data.status) {
          setFields(fieldsResponse.data.data.fields);
        }

        if (onDataLoaded) {
          onDataLoaded({
            platforms: platformsResponse.data.data.analytic_platforms,
            fields: fieldsResponse.data.data.fields,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onDataLoaded]);

  // This component doesn't render anything itself - it just fetches data
  // and calls the onDataLoaded callback
  return null;
};
