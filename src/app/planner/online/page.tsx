import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Calendar, Globe, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    tiktok?: boolean;
  };
  checkpoints: {
    jayaridho?: boolean;
    gilang?: boolean;
    chris?: boolean;
    winny?: boolean;
  };
  linkUpload?: string;
}

// Sample data based on the Excel screenshot
const contentCalendarData: ContentCalendarEntry[] = [
  {
    no: 1,
    tanggalUnggah: "1/2025",
    hari: "Rabu",
    topikKonten: "Tahun Baru",
    admin: "Tho",
    platforms: {
      instagram: true,
      website: true,
      tiktok: true,
    },
    checkpoints: {},
    linkUpload: "Link Upload",
  },
  {
    no: 2,
    tanggalUnggah: "1/2025",
    hari: "Kamis",
    topikKonten: "UB Goes To Pariaman-Singkawang",
    platforms: {},
    checkpoints: {},
    admin: "",
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconMap = {
    instagram: "https://www.instagram.com/favicon.ico",
    facebook: "https://www.facebook.com/favicon.ico",
    twitter: "https://abs.twimg.com/favicons/twitter.ico",
    youtube: "https://www.youtube.com/favicon.ico",
    tiktok: "https://sf-tk-sg.ibytedtos.com/goofy/tiktok/web/favicon.ico",
    website: <Globe className="h-4 w-4 text-blue-500" />,
    jayaridho: <Globe className="h-4 w-4 text-green-500" />,
  };

  const icon = iconMap[platform as keyof typeof iconMap];

  return icon ? (
    typeof icon === "string" ? (
      <img src={icon} alt={platform} className="h-4 w-4 mx-auto" />
    ) : (
      icon
    )
  ) : null;
};

export default function OnlineContentPlanner() {
  return (
    <Table>
      <TableHeader className="bg-gray-100">
        <TableRow className="hover:bg-gray-100">
          <TableHead className="w-[50px] text-center">No</TableHead>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="w-[80px]">Day</TableHead>
          <TableHead className="w-[250px]">Content Topic</TableHead>
          <TableHead className="w-[100px]">Admin</TableHead>
          <TableHead className="text-center" colSpan={7}>
            Platforms
          </TableHead>
          <TableHead className="text-center" colSpan={3}>
            Checkpoints
          </TableHead>
          <TableHead className="w-[100px]">
            <div className="flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contentCalendarData.map((entry) => (
          <TableRow
            key={entry.no}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <TableCell className="text-center font-medium">
              {entry.no}
            </TableCell>
            <TableCell className="text-gray-600 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{entry.tanggalUnggah}</span>
            </TableCell>
            <TableCell className="font-medium text-gray-700">
              {entry.hari}
            </TableCell>
            <TableCell className="text-blue-600 font-semibold">
              {entry.topikKonten}
            </TableCell>
            <TableCell className="text-gray-500">{entry.admin}</TableCell>

            {/* Platforms */}
            {[
              "instagram",
              "facebook",
              "twitter",
              "youtube",
              "website",
              "tiktok",
            ].map((platform) => (
              <TableCell key={platform} className="text-center">
                {entry.platforms[platform as keyof typeof entry.platforms] && (
                  <PlatformIcon platform={platform} />
                )}
              </TableCell>
            ))}

            {/* Checkpoints */}
            {["jayaridho", "gilang", "chris", "winny"].map((checkpoint) => (
              <TableCell key={checkpoint} className="text-center">
                {entry.checkpoints[
                  checkpoint as keyof typeof entry.checkpoints
                ] && <Check className="h-4 w-4 text-green-500 mx-auto" />}
              </TableCell>
            ))}

            <TableCell>
              {entry.linkUpload && (
                <a
                  href="#"
                  className="text-blue-500 hover:underline flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {entry.linkUpload}
                </a>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};