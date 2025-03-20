import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Hash,
  Book,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  PenSquare,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BarChart4,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { FaTiktok } from "react-icons/fa";

type Platform = {
  acr_id: number;
  acr_platform: string;
  acr_reach: string;
  acr_like: string | null;
  acr_comment: string | null;
  acr_share: string | null;
  acr_save: string | null;
};

export type Analytic = {
  anc_id: number;
  anc_tanggal: string;
  anc_hari: string;
  lup_id: number;
  created_at: string;
  updated_at: string;
  platforms: Platform[];
  date: string;
  day: string;
};

// Komponen statistik untuk memvisualisasikan nilai
const StatItem = ({
  value,
  icon: Icon,
  label,
}: {
  value: string;
  icon: any;
  label: string;
}) => {
  // Konversi nilai numerik untuk ditampilkan dengan lebih baik
  const formattedValue =
    value === "-"
      ? "-"
      : parseInt(value) > 1000
      ? `${(parseInt(value) / 1000).toFixed(1)}K`
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
            className={`flex flex-col items-center justify-center p-2 ${
              value !== "-" ? getColorClass() : "text-gray-400"
            }`}
          >
            <Icon size={16} className="mb-1" />
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
  icon: Icon,
  metrics,
}: {
  platform: string;
  icon: any;
  metrics: { label: string; icon: any }[];
}) => {
  return (
    <div className="w-full">
      <div className="border-y border-e p-2 bg-gray-50 flex items-center justify-center gap-2 font-medium">
        <Icon size={18} />
        <span>{platform}</span>
      </div>
      <div className="flex w-full">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-1 w-[400px] text-center text-xs border-e flex flex-col items-center justify-center"
          >
            <metric.icon size={12} className="mb-1" />
            {metric.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Platform Metrics Component
const PlatformMetrics = ({
  platformName,
  platformData,
  metrics,
}: {
  platformName: string;
  platformData: Platform[] | undefined;
  metrics: { field: string; label: string; icon: any }[];
}) => {
  const getPlatformValue = (field: string) => {
    if (!platformData) return "-";
    const data = platformData.find(
      (p) => p.acr_platform === platformName.toLowerCase()
    );
    if (!data) return "-";
    return (data as any)[field] || "-";
  };

  return (
    <div className="grid grid-cols-5 divide-x divide-gray-200">
      {metrics.map((metric, idx) => (
        <StatItem
          key={idx}
          value={getPlatformValue(metric.field)}
          icon={metric.icon}
          label={metric.label}
        />
      ))}
    </div>
  );
};

export const createColumns = (onlinePlanners: any[]): ColumnDef<Analytic>[] => {
  // Fungsi untuk mendapatkan topik konten berdasarkan lup_id
  const getTopikKontenByLupId = (lupId: number): string => {
    if (!lupId || !onlinePlanners || onlinePlanners.length === 0) return "-";

    // Mencari planner yang memiliki lup_id yang sesuai
    const matchingPlanner = onlinePlanners.find(
      (planner) => planner.platforms && planner.platforms.lup_id === lupId
    );

    return matchingPlanner ? matchingPlanner.onp_topik_konten : "-";
  };

  // Definisi metrics untuk setiap platform
  const standardMetrics = [
    { field: "acr_reach", label: "Reach", icon: Eye },
    { field: "acr_like", label: "Like", icon: Heart },
    { field: "acr_comment", label: "Comment", icon: MessageCircle },
    { field: "acr_share", label: "Shares", icon: Share2 },
    { field: "acr_save", label: "Saves", icon: Bookmark },
  ];

  const twitterMetrics = [
    { field: "acr_reach", label: "Reach", icon: Eye },
    { field: "acr_like", label: "Like", icon: Heart },
    { field: "acr_comment", label: "Comment", icon: MessageCircle },
    { field: "acr_share", label: "Retweet", icon: Share2 },
    { field: "acr_save", label: "Saves", icon: Bookmark },
  ];

  const youtubeMetrics = [
    { field: "acr_reach", label: "Views", icon: Eye },
    { field: "acr_like", label: "Like", icon: Heart },
    { field: "acr_comment", label: "Comment", icon: MessageCircle },
    { field: "acr_share", label: "Shares", icon: Share2 },
    { field: "acr_save", label: "Saves", icon: Bookmark },
  ];

  const tiktokMetrics = [
    { field: "acr_reach", label: "Views", icon: Eye },
    { field: "acr_like", label: "Like", icon: Heart },
    { field: "acr_comment", label: "Comment", icon: MessageCircle },
    { field: "acr_share", label: "Shares", icon: Share2 },
    { field: "acr_save", label: "Saves", icon: Bookmark },
  ];

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
      accessorKey: "lup_id",
      header: () => (
        <div className="font-semibold text-center">
          <div className="flex items-center justify-center gap-1">
            <Book size={16} />
            <p>Topik Konten</p>
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const lupId = row.getValue("lup_id") as number;
        const topikKonten = getTopikKontenByLupId(lupId);

        return (
          <div className="w-[300px] p-1">
            <div className="flex items-center">
              <PenSquare
                size={16}
                className="mr-2 flex-shrink-0 text-gray-500"
              />
              <p className="text-left truncate">{topikKonten}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "platforms",
      header: () => (
        <div className="font-semibold text-center border-b border-gray-200 w-[2100px]">
          <div className="flex items-center justify-center gap-1 my-2">
            <BarChart4 size={18} />
            <p>Social Media Analytics Report</p>
          </div>
          <div className="flex w-full">
            {/* Instagram header */}
            <div className="col-span-1 w-[400px]">
              <PlatformHeader
                platform="Instagram"
                icon={Instagram}
                metrics={standardMetrics.map((m) => ({
                  label: m.label,
                  icon: m.icon,
                }))}
              />
            </div>

            {/* Facebook header */}
            <div className="col-span-1 w-[400px]">
              <PlatformHeader
                platform="Facebook"
                icon={Facebook}
                metrics={standardMetrics.map((m) => ({
                  label: m.label,
                  icon: m.icon,
                }))}
              />
            </div>

            {/* Twitter header */}
            <div className="col-span-1 w-[400px]">
              <PlatformHeader
                platform="Twitter"
                icon={Twitter}
                metrics={twitterMetrics.map((m) => ({
                  label: m.label,
                  icon: m.icon,
                }))}
              />
            </div>

            {/* YouTube header */}
            <div className="col-span-1 w-[400px]">
              <PlatformHeader
                platform="YouTube"
                icon={Youtube}
                metrics={youtubeMetrics.map((m) => ({
                  label: m.label,
                  icon: m.icon,
                }))}
              />
            </div>

            {/* TikTok header */}
            <div className="col-span-1 w-[400px]">
              <PlatformHeader
                platform="TikTok"
                icon={FaTiktok}
                metrics={tiktokMetrics.map((m) => ({
                  label: m.label,
                  icon: m.icon,
                }))}
              />
            </div>

            {/* Website header */}
            <div className="col-span-1 w-full">
              <div className="border-y p-2 text-center bg-gray-50 flex items-center justify-center gap-1 font-medium w-full">
                <Globe size={16} />
                <span>Website</span>
              </div>
              <div className="grid grid-cols-1 w-full">
                <div className="p-1 text-center text-xs w-full flex flex-col items-center justify-center">
                  <Eye size={12} className="mb-1" />
                  Reach
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const platformsData = row.original.platforms || [];

        return (
          <div className="flex w-full divide-x divide-gray-200 hover:bg-gray-50 transition-colors w-[2100px]">
            {/* Instagram cells */}
            <div className="col-span-1 w-[400px]">
              <PlatformMetrics
                platformName="instagram"
                platformData={platformsData}
                metrics={standardMetrics}
              />
            </div>

            {/* Facebook cells */}
            <div className="col-span-1 w-[400px]">
              <PlatformMetrics
                platformName="facebook"
                platformData={platformsData}
                metrics={standardMetrics}
              />
            </div>

            {/* Twitter cells */}
            <div className="col-span-1 w-[400px]">
              <PlatformMetrics
                platformName="twitter"
                platformData={platformsData}
                metrics={twitterMetrics}
              />
            </div>

            {/* YouTube cells */}
            <div className="col-span-1 w-[400px]">
              <PlatformMetrics
                platformName="youtube"
                platformData={platformsData}
                metrics={youtubeMetrics}
              />
            </div>

            {/* TikTok cells */}
            <div className="col-span-1 w-[400px]">
              <PlatformMetrics
                platformName="tiktok"
                platformData={platformsData}
                metrics={tiktokMetrics}
              />
            </div>

            {/* Website cell */}
            <div className="w-[100px]">
              <div className="flex items-center justify-center h-full border-e">
                <StatItem
                  value={(() => {
                    const data = platformsData.find(
                      (p) => p.acr_platform === "website"
                    );
                    return data ? data.acr_reach || "-" : "-";
                  })()}
                  icon={Eye}
                  label="Reach"
                />
              </div>
            </div>
          </div>
        );
      },
    },
  ];
};
