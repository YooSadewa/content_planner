import { JSX } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Youtube, Globe } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { AllPlatformStats } from "../page";

// Props untuk SummaryAccPage
interface SummaryAccPageProps {
  data: AllPlatformStats;
}

export default function SummaryAccPage({
  data,
}: SummaryAccPageProps): JSX.Element {
  // Konfigurasi untuk setiap platform (static)
  const platforms = [
    {
      name: "Website",
      key: "website",
      icon: Globe,
      color: "from-green-500 to-emerald-700",
      textColor: "text-white",
      labels: ["Jumlah Konten"],
    },
    {
      name: "Instagram",
      key: "instagram",
      icon: Instagram,
      color: "from-pink-500 to-purple-600",
      textColor: "text-white",
      labels: ["Total Konten", "Pengikut"],
    },
    {
      name: "Twitter",
      key: "twitter",
      icon: Twitter,
      color: "from-blue-400 to-blue-600",
      textColor: "text-white",
      labels: ["Jumlah Tweet", "Pengikut"],
    },
    {
      name: "Facebook",
      key: "facebook",
      icon: Facebook,
      color: "from-blue-600 to-blue-800",
      textColor: "text-white",
      labels: ["Total Konten", "Pengikut"],
    },
    {
      name: "YouTube",
      key: "youtube",
      icon: Youtube,
      color: "from-red-500 to-red-700",
      textColor: "text-white",
      labels: ["Total Konten", "Subscriber"],
    },
    {
      name: "TikTok",
      key: "tiktok",
      icon: FaTiktok,
      color: "from-gray-700 to-gray-900",
      textColor: "text-white",
      labels: ["Total Konten", "Pengikut"],
    },
  ];

  // Fungsi untuk memformat angka dengan koma
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platforms.map((platform) => {
        // Destrukturisasi data untuk mudah diakses
        const stats = data[platform.key as keyof AllPlatformStats];
        const Icon = platform.icon;

        return (
          <Card
            key={platform.name}
            className="overflow-hidden border-none shadow-lg"
          >
            {/* Header card dengan warna gradient dan icon */}
            <div className={`bg-gradient-to-r ${platform.color} p-4`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-bold text-lg ${platform.textColor}`}>
                  {platform.name}
                </h3>
                <Icon className={`w-6 h-6 ${platform.textColor}`} />
              </div>
            </div>

            {/* Body card dengan statistik */}
            <CardContent className="p-4 bg-white">
              {/* Tampilkan jumlah konten */}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">{platform.labels[0]}</span>
                <span className="font-bold text-gray-800">
                  {formatNumber(stats.total_konten)}
                </span>
              </div>

              {/* Tampilkan jumlah pengikut (jika ada) */}
              {platform.labels.length > 1 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{platform.labels[1]}</span>
                  <span className="font-bold text-gray-800">
                    {formatNumber(stats.pengikut)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
