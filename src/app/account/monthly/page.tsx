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
          <div className="p-6 grid grid-cols-6 gap-4">
            {data.map((item: any) =>
              platforms.map((platform) => (
                <div
                  key={`${item.dacc_id}-${platform}`}
                  className="flex flex-col items-center"
                >
                  <div className="text-gray-600 font-medium mb-5 capitalize">
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
                      <p className="text-[10px] mt-2">Total Konten</p>
                    </div>
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
                      <p className="text-[10px] mt-2">Pengikut</p>
                    </div>
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
