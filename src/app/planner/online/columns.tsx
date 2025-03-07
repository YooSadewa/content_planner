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
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
  onp_link_upload?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
    tiktok?: string;
  };
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
    accessorKey: "onp_link_upload",
    header: () => (
      <div className="font-semibold text-center">
        <p>Links</p>
      </div>
    ),
    cell: ({ row }) => {
      const links = row.getValue("onp_link_upload") as
        | Record<string, string>
        | undefined;
      const hasLinks =
        links && Object.entries(links).some(([_, value]) => !!value);

      return (
        <div className="w-[200px]">
          {hasLinks ? (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="text-xs w-[150px]">
                <LinkIcon className="h-3 w-3 mr-1" />
                View Links
              </Button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center">No links</p>
          )}
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
      // Get the complete row data instead of just the platforms value
      const rowData = row.original;

      // Determine status based on platforms data
      let status = "scheduled"; // Default status

      // Check if platforms has data
      if (rowData.platforms) {
        // For debugging, you can log the type and value
        console.log("Platforms type:", typeof rowData.platforms);
        console.log("Platforms value:", rowData.platforms);

        // If it's an object with keys, mark as done
        if (
          typeof rowData.platforms === "object" &&
          !Array.isArray(rowData.platforms) &&
          Object.keys(rowData.platforms).length > 0
        ) {
          status = "done";
        }
      }

      const StatusBadge = ({ status }: { status: string }) => {
        const statusConfig = {
          scheduled: {
            color: "bg-purple-100 text-purple-700 border-purple-200",
            icon: <Calendar size={14} className="mr-1" />,
          },
          done: {
            color: "bg-green-100 text-green-700 border-green-200",
            icon: <Check size={14} className="mr-1" />,
          },
        };

        const config = statusConfig[status as keyof typeof statusConfig];

        return (
          <Badge
            className={`${config.color} flex items-center gap-1 font-normal`}
            variant="outline"
          >
            {config.icon}
            <span className="capitalize text-xs">{status}</span>
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
];
