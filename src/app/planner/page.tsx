"use client";
import Bread from "@/components/BreadCrumb";
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTableOnline from "./online/datatable";
import { columns } from "./online/columns"; // Import columns directly
import { OnlineContent } from "./online/columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateOnlinePlanner from "./online/adddata";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platform } from "os";

// Define API response type
interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    online_planners: ApiOnlinePlanner[];
  };
}

interface ApiOnlinePlanner {
  onp_id: number;
  onp_tanggal: string;
  onp_hari: string;
  onp_topik_konten: string;
  onp_admin: string;
  onp_platform: string;
  onp_checkpoint: string;
  created_at: string;
  updated_at: string;
  platforms:
    | {
        [key: string]: { link: string };
      }
    | [];
}

export default function ContentPlannerPage() {
  const [tableDataOnline, setTableDataOnline] = useState<OnlineContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOnlinePlanner = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://127.0.0.1:8000/api/onlinecontentplanner"
        );

        console.log("Raw API Response:", response.data);

        if (response.data.status) {
          const dataOnline = response.data.data.online_planners || [];
          console.log("Original data:", dataOnline);

          // Transform the data to match your component expectations
          const transformedData: OnlineContent[] = dataOnline.map((item) => {
            // Parse the platform string into an object
            const platformObj: OnlineContent["onp_platform"] = {
              instagram: false,
              facebook: false,
              twitter: false,
              youtube: false,
              website: false,
              tikTok: false,
            };

            // Handle comma-separated platform string
            if (item.onp_platform) {
              const platforms = item.onp_platform.split(",");
              platforms.forEach((platform) => {
                const trimmedPlatform = platform.trim();
                if (trimmedPlatform === "instagram")
                  platformObj.instagram = true;
                else if (trimmedPlatform === "facebook")
                  platformObj.facebook = true;
                else if (trimmedPlatform === "twitter")
                  platformObj.twitter = true;
                else if (trimmedPlatform === "youtube")
                  platformObj.youtube = true;
                else if (trimmedPlatform === "website")
                  platformObj.website = true;
                else if (
                  trimmedPlatform === "tiktok" ||
                  trimmedPlatform === "tikTok"
                )
                  platformObj.tikTok = true;
              });
            }

            // Create checkpoint object
            const checkpointObj: OnlineContent["onp_checkpoint"] = {
              jayaridho: item.onp_checkpoint === "jayaridho",
              gilang: item.onp_checkpoint === "gilang",
              chris: item.onp_checkpoint === "chris",
              winny: item.onp_checkpoint === "winny",
            };

            // Create link upload object
            const linkUploadObj: OnlineContent["onp_link_upload"] = {};

            // Check if platforms is an object (not an empty array)
            if (item.platforms && !Array.isArray(item.platforms)) {
              Object.entries(item.platforms).forEach(([platform, data]) => {
                if (platform && data && data.link) {
                  linkUploadObj[platform as keyof typeof linkUploadObj] =
                    data.link;
                }
              });
            }

            // Return transformed item
            const transformedItem: OnlineContent = {
              onp_id: item.onp_id,
              onp_tanggal: item.onp_tanggal,
              onp_hari: item.onp_hari,
              onp_topik_konten: item.onp_topik_konten,
              onp_admin: item.onp_admin,
              onp_platform: platformObj,
              onp_checkpoint: checkpointObj,
              onp_link_upload: linkUploadObj,
              platforms: item.platforms,
              onp_status: "published", // Default status
            };

            return transformedItem;
          });

          console.log("Transformed data:", transformedData);
          setTableDataOnline(transformedData);
        } else {
          console.log("API returned status false");
          setTableDataOnline([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchOnlinePlanner();
  }, []);

  return (
    <div className="w-[1050px]">
      <div className="px-5 pt-5 overflow-auto">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Bread>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink href="/ide-konten">Rencana Konten</BreadcrumbLink>
            </Bread>
          </div>
        </div>
      </div>
      <div className="mx-5">
        <h1 className="font-bold text-2xl mt-5 text-[#293854] me-auto mb-4 flex items-center">
          Perencanaan Konten
        </h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
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
                <CreateOnlinePlanner />
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
                  <DataTableOnline data={tableDataOnline} columns={columns} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
