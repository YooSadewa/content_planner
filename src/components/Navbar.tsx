"use client";
import Image from "next/image";
import ContactBar from "./ContactBar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Perencanaan Konten", path: "/perencanaan" },
    { name: "Analisis Konten", path: "/analisis" },
    { name: "Statistik Medsos", path: "/statistik" },
    { name: "Podcast", path: "/podcast" },
    { name: "Ide Konten", path: "/idekonten" },
  ];

  const isActive = (menuPath : any) => {
    return pathname === menuPath || pathname.startsWith(`${menuPath}/`);
  };

  return (
    <>
      <ContactBar />
      <nav className="py-2 px-[10px] flex justify-between sticky">
        <Image
          src={"/assets/logouib.png"}
          alt="logo UIB"
          width={110}
          height={100}
          className="h-fit"
        />
        <ul className="flex text-sm font-semibold gap-1 pe-3 items-center">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path}>
                <p
                  className={`${
                    isActive(item.path)
                      ? "bg-[#293854] text-white px-4 py-1 rounded"
                      : "hover:bg-gray-200 px-3 py-1 rounded"
                  }`}
                >
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
