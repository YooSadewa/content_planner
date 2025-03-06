"use client";
import {
  CalendarClock,
  ChartNoAxesCombined,
  ChartPie,
  House,
  Lightbulb,
  LogOut,
  MessageSquareQuote,
  Podcast,
  SquareUser,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { name: "Beranda", href: "/", icon: House },
    { name: "Rencana Konten", href: "/planner", icon: CalendarClock },
    { name: "Ringkasan Medsos", href: "/account", icon: SquareUser },
    { name: "Analisis Konten", href: "/analisis-konten", icon: ChartPie },
    { name: "Statistik Medsos", href: "/statistik", icon: ChartNoAxesCombined },
    { name: "Ide Konten", href: "/ide-konten", icon: Lightbulb },
    { name: "Podcast", href: "/podcast", icon: Podcast },
    { name: "Quotes", href: "/quotes", icon: MessageSquareQuote },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Log session data for debugging (can be removed in production)
  console.log("Current session data:", session);

  return (
    <div className="h-screen w-[210px] bg-[#293854] py-8 ps-4 sticky top-0 flex flex-col justify-between">
      <div>
        <Image
          src={"/assets/logowhite.png"}
          alt="LOGO UIB"
          width={100}
          height={100}
          className="w-36"
        />
        <div className="w-[90%] h-[1px] mt-3 mb-6 bg-[#f7b500]" />
        <ul className="gap-2 flex flex-col">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.name}
                className={`p-2 rounded-s-xl ${
                  isActive ? "bg-gray-100 text-black" : "text-white"
                }`}
              >
                <Link href={item.href} className="flex gap-3">
                  <item.icon className="w-7 h-7 my-auto" />
                  <p className="flex items-center text-sm font-semibold">
                    {item.name}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Profile Section */}
      {session?.user && (
        <div className="mb-4 mr-4 p-2 bg-[#1e2c45] rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/assets/avatar.png" alt="Profile" />
              <AvatarFallback className="text-xs">
                {session.user.name
                  ? session.user.name.substring(0, 2).toUpperCase()
                  : "UI"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">
                {session.user.name || "User"}
              </p>
              <p className="text-gray-400 text-xs truncate w-24">
                @{session.user.email || "user@example.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-[#364869] hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}