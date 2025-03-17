import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Check,
  Facebook,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  LinkIcon,
  RotateCw,
  Trash,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import FormUploadLink from "./upload";
import FormEditLink from "./update";
import FormUpdateOnline from "./update";
import ViewLinksModal from "./openlinks";

export type OnlineContent = {
  onp_id: number;
  onp_tanggal: string;
  onp_hari: string;
  onp_topik_konten: string;
  onp_admin: string;
  onp_platform: {
    instagram?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    youtube?: boolean;
    website?: boolean;
    tikTok?: boolean;
  };
  onp_checkpoint: {
    jayaridho?: boolean;
    gilang?: boolean;
    chris?: boolean;
    winny?: boolean;
  };
  lup_instagram?: string;
  lup_twitter?: string;
  lup_youtube?: string;
  lup_facebook?: string;
  lup_website?: string;
  lup_tiktok?: string;
  onp_status?: "draft" | "review" | "scheduled" | "published";
  platforms: any;
};

export const columns: ColumnDef<OnlineContent>[] = [
  {
    accessorKey: "onp_id",
    header: () => (
      <div className="font-semibold text-center">
        <p>No</p>
      </div>
    ),
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "onp_topik_konten",
    header: () => (
      <div className="font-semibold text-center">
        <p>Content Details</p>
      </div>
    ),
    cell: ({ row }) => {
      // Get the complete row data to access all fields
      const rowData = row.original;

      return (
        <div className="space-y-1 w-[300px]">
          <div className="font-semibold text-gray-900">
            {row.getValue("onp_topik_konten")}
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Calendar className="h-3 w-3" />
            {/* Access date and day from the original row data */}
            {rowData.onp_tanggal || rowData.onp_tanggal || "No date"} (
            {rowData.onp_hari || rowData.onp_hari || ""})
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "onp_admin",
    header: () => (
      <div className="font-semibold text-center">
        <p>Admin</p>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 w-[150px]">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {(row.getValue("onp_admin") as string)
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{row.getValue("onp_admin")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "onp_platform",
    header: () => (
      <div className="font-semibold text-center">
        <p>Platforms</p>
      </div>
    ),
    cell: ({ row }) => {
      const PlatformIndicator = ({
        platform,
        active,
      }: {
        platform: string;
        active: boolean;
      }) => {
        const getIcon = () => {
          switch (platform) {
            case "instagram":
              return <Instagram size={16} />;
            case "facebook":
              return <Facebook size={16} />;
            case "twitter":
              return <Twitter size={16} />;
            case "youtube":
              return <Youtube size={16} />;
            case "website":
              return <Globe size={16} />;
            case "tikTok":
              return <FaTiktok size={14} />;
            default:
              return null;
          }
        };

        if (!active) return null;

        const colorMap = {
          instagram: "bg-pink-100 text-pink-600 border-pink-200",
          facebook: "bg-blue-100 text-blue-600 border-blue-200",
          twitter: "bg-sky-100 text-sky-600 border-sky-200",
          youtube: "bg-red-100 text-red-600 border-red-200",
          website: "bg-indigo-100 text-indigo-600 border-indigo-200",
          tikTok: "bg-black bg-opacity-10 text-black border-gray-200",
        };

        return (
          <Badge
            className={`${
              colorMap[platform as keyof typeof colorMap]
            } flex items-center gap-1 font-normal`}
            variant="outline"
          >
            {getIcon()}
            <span className="capitalize text-xs">{platform}</span>
          </Badge>
        );
      };
      return (
        <div className="flex flex-wrap gap-1 w-[300px]">
          {Object.entries(
            row.getValue("onp_platform") as Record<string, boolean>
          ).map(([platform, active]) =>
            active ? (
              <PlatformIndicator
                key={platform}
                platform={platform}
                active={active}
              />
            ) : null
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "onp_checkpoint",
    header: () => (
      <div className="font-semibold text-center">
        <p>Checkpoints</p>
      </div>
    ),
    cell: ({ row }) => {
      const CheckpointIndicator = ({
        name,
        checked,
        checkpoint,
      }: {
        name: string;
        checked: boolean;
        checkpoint: string;
      }) => {
        const initials = name.substring(0, 2).toUpperCase();

        return (
          <div className="flex flex-col items-center">
            <Avatar
              className={`h-8 w-8 ${
                checked ? "border-2 border-green-500" : "border border-gray-200"
              }`}
            >
              <AvatarFallback
                className={`text-xs ${
                  checked
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-[10px] capitalize">{checkpoint}</p>
            {checked && <Check size={12} className="text-green-500" />}
          </div>
        );
      };
      const checkpoints = row.getValue("onp_checkpoint") as Record<
        string,
        boolean
      >;
      return (
        <div className="flex justify-between w-[200px]">
          {["jayaridho", "gilang", "chris", "winny"].map((checkpoint) => (
            <CheckpointIndicator
              key={checkpoint}
              name={checkpoint}
              checked={!!checkpoints[checkpoint]}
              checkpoint={checkpoint}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "link_platforms",
    header: () => (
      <div className="font-semibold text-center">
        <p>Links</p>
      </div>
    ),
    cell: ({ row }) => {
      const rowData = row.original;
      const platforms = rowData.platforms || {};
      const contentTitle = rowData.onp_topik_konten || "Content";

      return (
        <div className="w-[200px] flex justify-center">
          <ViewLinksModal links={platforms} contentTitle={contentTitle} />
        </div>
      );
    },
  },
  {
    accessorKey: "platforms",
    header: () => (
      <div className="font-semibold text-center">
        <p>Status</p>
      </div>
    ),
    cell: ({ row }) => {
      // Get the complete row data
      const rowData = row.original;

      // Initialize status as "scheduled" (default)
      let status: "scheduled" | "on-hold" | "done" = "scheduled";

      // Get the platforms that were selected from onp_platform object
      const selectedPlatforms: string[] = [];
      if (rowData.onp_platform && typeof rowData.onp_platform === "object") {
        // Add each platform that is true to the selectedPlatforms array
        Object.entries(rowData.onp_platform).forEach(
          ([platform, isSelected]) => {
            if (isSelected) {
              // Convert platform name to lowercase for consistency
              selectedPlatforms.push(platform.toLowerCase());
            }
          }
        );
      }

      // Check if platforms object exists and has any data
      if (
        rowData.platforms &&
        typeof rowData.platforms === "object" &&
        !Array.isArray(rowData.platforms) &&
        Object.keys(rowData.platforms).length > 0
      ) {
        // Get the platforms that have links
        const platformsWithLinks = Object.keys(rowData.platforms).map((key) =>
          key.toLowerCase()
        );

        // Check if all selected platforms have links
        const allPlatformsHaveLinks =
          selectedPlatforms.length > 0 &&
          selectedPlatforms.every((platform) =>
            platformsWithLinks.includes(platform)
          );

        // Check if some (but not all) selected platforms have links
        const somePlatformsHaveLinks = selectedPlatforms.some((platform) =>
          platformsWithLinks.includes(platform)
        );

        if (allPlatformsHaveLinks) {
          status = "done";
        } else if (somePlatformsHaveLinks) {
          status = "on-hold";
        }
      }

      const StatusBadge = ({
        status,
      }: {
        status: "scheduled" | "on-hold" | "done";
      }) => {
        const statusConfig = {
          scheduled: {
            color: "bg-purple-100 text-purple-700 border-purple-200",
            icon: <Calendar size={14} className="mr-1" />,
          },
          "on-hold": {
            color: "bg-yellow-100 text-yellow-700 border-yellow-200",
            icon: <RotateCw size={14} className="mr-1" />, // Using RotateCw as a stand-in for Clock
          },
          done: {
            color: "bg-green-100 text-green-700 border-green-200",
            icon: <Check size={14} className="mr-1" />,
          },
        };

        const config = statusConfig[status];
        return (
          <Badge
            className={`${config.color} flex items-center gap-1 font-normal`}
            variant="outline"
          >
            {config.icon}
            <span className="capitalize text-sm">
              {status.replace("-", " ")}
            </span>
          </Badge>
        );
      };

      return (
        <div className="w-[150px]">
          <div className="w-fit mx-auto">
            <StatusBadge status={status} />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "ikv_id",
    header: () => (
      <div className="font-semibold text-center">
        <p>Confirm Upload</p>
      </div>
    ),
    cell: ({ row, table }) => {
      return (
        <div className="w-[120px]">
          <FormUploadLink
            idONP={row.getValue("onp_id")}
            TopikKonten={row.getValue("onp_topik_konten")}
            Platform={row.getValue("onp_platform")}
          />
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
      return (
        <div className="w-[100px] flex gap-1">
          <FormUpdateOnline
            id={row.getValue("onp_id")}
            currentAdmin={row.getValue("onp_admin")}
            currentCheckpoint={row.getValue("onp_checkpoint")}
            currentDate={rowData.onp_tanggal}
            currentDay={rowData.onp_hari}
            currentName={row.getValue("onp_topik_konten")}
            currentPlatform={row.getValue("onp_platform")}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 h-8 w-full text-xs px-3 rounded-md"
            onClick={() => meta.handleDelete(row.getValue("onp_id"))}
          >
            <Trash size={16} />
          </Button>
        </div>
      );
    },
  },
];
