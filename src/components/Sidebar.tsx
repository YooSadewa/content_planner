"use client"
import {
    ChartNoAxesCombined,
    ChartPie,
    House,
    Lightbulb,
    MessageSquareQuote,
    Podcast,
  } from "lucide-react";
  import Image from "next/image";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  
  export default function Sidebar() {
    const pathname = usePathname(); // Mengambil URL saat ini
  
    const menuItems = [
      { name: "Beranda", href: "/", icon: House },
      { name: "Ide Konten", href: "/ide-konten", icon: Lightbulb },
      { name: "Analisis Konten", href: "/analisis-konten", icon: ChartPie },
      { name: "Statistik Medsos", href: "/statistik", icon: ChartNoAxesCombined },
      { name: "Podcast", href: "/podcast", icon: Podcast },
      { name: "Quotes", href: "/quotes", icon: MessageSquareQuote },
    ];
  
    return (
      <div className="h-screen w-[210px] bg-[#293854] py-8 ps-4 sticky top-0">
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
                  <item.icon className="w-8 h-8 my-auto" />
                  <p className="flex items-center font-semibold">{item.name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  