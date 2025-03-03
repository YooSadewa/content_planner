import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
export default function MonthlyPostPage() {
  const monthlyPostings = [
    { platform: "Website", posts: 14 },
    { platform: "Instagram", posts: 14 },
    { platform: "Twitter", posts: 140 },
    { platform: "Facebook", posts: 14 },
    { platform: "Youtube", posts: 0 },
    { platform: "Tiktok", posts: 0 },
  ];
  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="p-6 grid grid-cols-6 gap-4">
            {monthlyPostings.map((item) => (
              <div key={item.platform} className="flex flex-col items-center">
                <div className="text-gray-600 font-medium mb-5">
                  {item.platform}
                </div>
                <div className="flex gap-2">
                  <div className="text-center">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl",
                        item.posts > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {item.posts}
                    </div>
                    <p className="text-[10px] mt-2">Total Konten</p>
                  </div>
                  <div className="text-center">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl",
                        item.posts > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {item.posts}
                    </div>
                    <p className="text-[10px] mt-2">Pengikut</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
