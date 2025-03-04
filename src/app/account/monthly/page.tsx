import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function MonthlyPostPage({ data }: any) {
  const platforms = [
    "website",
    "instagram",
    "twitter",
    "facebook",
    "youtube",
    "tiktok",
  ];
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="flex justify-between w-full p-5 gap-4 w-fit">
            {data.map((item: any) =>
              platforms.map((platform) => (
                <div
                  key={`${item.dacc_id}-${platform}`}
                  className="flex flex-col items-center"
                >
                  <div className="text-black font-semibold mb-5 capitalize">
                    {platform}
                  </div>
                  <div className="flex gap-2">
                    <div className="text-center">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl",
                          item[platform]?.dpl_total_konten > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {item[platform]?.dpl_total_konten || 0}
                      </div>
                      <p className="text-[10px] mt-2">
                        Total {platform === "twitter" ? "Tweet" : "Konten"}
                      </p>
                    </div>
                    {platform !== "website" && (
                      <div className="text-center">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl",
                            item[platform]?.dpl_pengikut > 0
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {item[platform]?.dpl_pengikut || 0}
                        </div>
                        <p className="text-[10px] mt-2">
                          {platform === "youtube" ? "Subscriber" : "Pengikut"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
