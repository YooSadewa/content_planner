import { Card } from "@/components/ui/card";
import { Instagram, Twitter, Facebook, Youtube, Globe, Clock, Users, MapPin, Globe2 } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
export default function DetailAccPage() {
  const analyticsData = [
    {
      platform: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      activeTime: "15.00 & 18.00",
      profileVisits: "12,169",
      gender: { male: 44, female: 56 },
      topCities: ["Batam", "Tanjungpinang", "Jakarta"],
      topCountries: ["Indonesia", "Filipina", "Singapura"],
    },
    {
      platform: "TikTok",
      icon: FaTiktok,
      color: "text-gray-700",
      activeTime: "21.00 & 22.00",
      profileVisits: "169",
      gender: { male: 38, female: 62 },
      topCities: ["Batam", "Jakarta", "Denpasar"],
      topCountries: ["Indonesia", "Singapura", "Malaysia"],
    },
  ];
  return (
    <div className="space-y-6">
      {analyticsData.map((platform) => (
        <Card
          key={platform.platform}
          className="border-none shadow-lg overflow-hidden"
        >
          <div className="bg-white p-6">
            <div className="flex items-center mb-6">
              <platform.icon className={`h-8 w-8 mr-3 ${platform.color}`} />
              <h3 className="text-xl font-bold text-gray-800">
                {platform.platform}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Active Time */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Waktu Aktif</div>
                  <div className="font-medium">{platform.activeTime}</div>
                </div>
              </div>

              {/* Profile Visits */}
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Kunjungan Profil
                  </div>
                  <div className="font-medium">{platform.profileVisits}</div>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Gender</div>
                  <div className="flex items-center">
                    <div
                      className="h-2 bg-blue-500 rounded-l"
                      style={{ width: `${platform.gender.male}px` }}
                    ></div>
                    <div
                      className="h-2 bg-pink-500 rounded-r"
                      style={{ width: `${platform.gender.female}px` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 gap-1">
                    <span>{platform.gender.male}% Pria</span>
                    <span>{platform.gender.female}% Perempuan</span>
                  </div>
                </div>
              </div>

              {/* Top Cities */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">Kota Teratas</div>
                  <div className="font-medium">
                    {platform.topCities.join(", ")}
                  </div>
                </div>
              </div>

              {/* Top Countries */}
              <div className="flex items-start space-x-3">
                <Globe2 className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Negara Teratas
                  </div>
                  <div className="font-medium">
                    {platform.topCountries.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
