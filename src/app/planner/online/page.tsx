import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Check,
  X,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Music,
  LinkIcon,
  User,
  Clock,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaTiktok } from "react-icons/fa";

// Define the type for a content calendar entry
interface ContentCalendarEntry {
  no: number;
  tanggalUnggah: string;
  hari: string;
  topikKonten: string;
  admin: string;
  platforms: {
    instagram?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    youtube?: boolean;
    website?: boolean;
    tikTok?: boolean;
  };
  checkpoints: {
    jayaridho?: boolean;
    gilang?: boolean;
    chris?: boolean;
    winny?: boolean;
  };
  linkUpload: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
    tiktok?: string;
  };
  status?: "draft" | "review" | "scheduled" | "published";
}

// Sample data based on the Excel screenshot
const contentCalendarData: ContentCalendarEntry[] = [
  {
    no: 1,
    tanggalUnggah: "3 Februari 2025",
    hari: "Rabu",
    topikKonten: "Tahun Baru",
    admin: "Thio",
    platforms: {
      instagram: true,
      website: true,
      tikTok: true,
    },
    checkpoints: {
      gilang: true,
    },
    linkUpload: {
      instagram: "Link Upload",
    },
    status: "scheduled",
  },
  {
    no: 2,
    tanggalUnggah: "6 Februari 2025",
    hari: "Kamis",
    topikKonten: "UIB Goes To Pariaman-Singkawang",
    admin: "Winny",
    platforms: {
      facebook: true,
      instagram: true,
    },
    checkpoints: {
      chris: true,
    },
    linkUpload: {},
    status: "draft",
  },
  {
    no: 3,
    tanggalUnggah: "6 Februari 2025",
    hari: "Kamis",
    topikKonten: "UIB Goes To Pariaman-Singkawang",
    admin: "Winny",
    platforms: {
      facebook: true,
      instagram: true,
    },
    checkpoints: {
      chris: true,
    },
    linkUpload: {},
    status: "draft",
  },
  {
    no: 4,
    tanggalUnggah: "6 Februari 2025",
    hari: "Kamis",
    topikKonten: "UIB Goes To Pariaman-Singkawang",
    admin: "Winny",
    platforms: {
      facebook: true,
      instagram: true,
    },
    checkpoints: {
      chris: true,
    },
    linkUpload: {},
    status: "draft",
  },
  {
    no: 5,
    tanggalUnggah: "6 Februari 2025",
    hari: "Kamis",
    topikKonten: "UIB Goes To Pariaman-Singkawang",
    admin: "Nico",
    platforms: {
      facebook: true,
      instagram: true,
      twitter: true,
      youtube: true,
    },
    checkpoints: {
      chris: true,
    },
    linkUpload: {},
    status: "published",
  },
];

// Platform Icon component using Lucide icons
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
    tiktok: "bg-black bg-opacity-10 text-black border-gray-200",
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

// Status badge component
const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null;

  const statusConfig = {
    draft: {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <Clock size={14} className="mr-1" />,
    },
    review: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <Check size={14} className="mr-1" />,
    },
    scheduled: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: <CalendarDays size={14} className="mr-1" />,
    },
    published: {
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

// Checkpoint indicator component
const CheckpointIndicator = ({
  name,
  checked,
}: {
  name: string;
  checked: boolean;
}) => {
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1">
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
      {checked && <Check size={12} className="text-green-500" />}
    </div>
  );
};

export default function OnlineContentPlanner() {
  return (
    <Card className="shadow-md border-none">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Online Content Planner
            </CardTitle>
            <CardDescription>
              Mengelola dan melacak jadwal penerbitan konten
            </CardDescription>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Calendar className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="p-6">
              <div className="rounded-lg border overflow-auto w-[960px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[50px] font-semibold text-center">
                        No
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Content Details
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Admin
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Platforms
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Checkpoints
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Links
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentCalendarData.map((entry) => (
                      <TableRow
                        key={entry.no}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-center">
                          {entry.no}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 w-[300px]">
                            <div className="font-semibold text-gray-900">
                              {entry.topikKonten}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                              <Calendar className="h-3 w-3" />
                              {entry.tanggalUnggah} ({entry.hari})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[100px] font-medium">
                          <div className="flex items-center gap-2 w-[150px]">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {entry.admin.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{entry.admin}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 w-[300px]">
                            {Object.entries(entry.platforms).map(
                              ([platform, active]) =>
                                active ? (
                                  <PlatformIndicator
                                    key={platform}
                                    platform={platform}
                                    active={active}
                                  />
                                ) : null
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-between w-[200px]">
                            {["jayaridho", "gilang", "chris", "winny"].map(
                              (checkpoint) => (
                                <CheckpointIndicator
                                  key={checkpoint}
                                  name={checkpoint}
                                  checked={
                                    !!entry.checkpoints[
                                      checkpoint as keyof typeof entry.checkpoints
                                    ]
                                  }
                                />
                              )
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {Object.entries(entry.linkUpload || {}).some(
                            ([_, value]) => !!value
                          ) ? (
                            <div className="w-[200px]">
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs w-[150px]"
                                >
                                  <LinkIcon className="h-3 w-3 mr-1" />
                                  View Links
                                </Button>
                              </div>
                            </div>
                          ) : (
                              <p className="text-gray-400 text-sm w-[200px] text-center">
                                No links
                              </p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="w-[150px]">
                            <div className="w-fit mx-auto">
                              <StatusBadge status={entry.status} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="draft" className="m-0">
            {/* Draft content would be filtered here */}
            <div className="p-6 text-center text-gray-500">
              Showing draft content
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="m-0">
            {/* Scheduled content would be filtered here */}
            <div className="p-6 text-center text-gray-500">
              Showing scheduled content
            </div>
          </TabsContent>

          <TabsContent value="published" className="m-0">
            {/* Published content would be filtered here */}
            <div className="p-6 text-center text-gray-500">
              Showing published content
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
