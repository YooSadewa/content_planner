import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardPodcastPage() {
  return (
    <Card className="w-[650px] bg-white hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Podcast
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
      </CardContent>
    </Card>
  );
}
