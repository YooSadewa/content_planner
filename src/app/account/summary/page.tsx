import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Youtube, Globe } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
export default function SummaryAccPage() {
  const platformCards = [
    {
      name: "Website",
      icon: Globe,
      color: "from-green-500 to-emerald-700",
      textColor: "text-white",
      stats: [{ label: "Jumlah Konten", value: "1,357" }],
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "from-pink-500 to-purple-600",
      textColor: "text-white",
      stats: [
        { label: "Total Konten", value: "1,835" },
        { label: "Pengikut", value: "15,443" },
      ],
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "from-blue-400 to-blue-600",
      textColor: "text-white",
      stats: [
        { label: "Jumlah Tweet", value: "2,134" },
        { label: "Pengikut", value: "411" },
      ],
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "from-blue-600 to-blue-800",
      textColor: "text-white",
      stats: [
        { label: "Total Konten", value: "1,254" },
        { label: "Pengikut", value: "7,790" },
      ],
    },
    {
      name: "YouTube",
      icon: Youtube,
      color: "from-red-500 to-red-700",
      textColor: "text-white",
      stats: [
        { label: "Total Konten", value: "141" },
        { label: "Subscriber", value: "5,095" },
      ],
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      color: "from-gray-700 to-gray-900",
      textColor: "text-white",
      stats: [
        { label: "Total Konten", value: "49" },
        { label: "Pengikut", value: "2,139" },
      ],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platformCards.map((platform) => (
        <Card
          key={platform.name}
          className="overflow-hidden border-none shadow-lg"
        >
          <div className={`bg-gradient-to-r ${platform.color} p-4`}>
            <div className="flex justify-between items-center">
              <h3 className={`font-bold text-lg ${platform.textColor}`}>
                {platform.name}
              </h3>
              <platform.icon className={`w-6 h-6 ${platform.textColor}`} />
            </div>
          </div>
          <CardContent className="p-4 bg-white">
            {platform.stats.map((stat, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-bold text-gray-800">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
