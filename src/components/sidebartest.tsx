"use client";
import React, { useState } from "react";
import { Home, Users, Settings, HelpCircle, Menu } from "lucide-react";

const SidebarTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <Home />, label: "Beranda" },
    { icon: <Users />, label: "Pengguna" },
    { icon: <Settings />, label: "Pengaturan" },
    { icon: <HelpCircle />, label: "Bantuan" },
  ];

  return (
    <div
      className={`h-screen bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } p-4`}
    >
      <div className="flex items-center mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-gray-700 rounded-lg"
        >
          <Menu />
        </button>
      </div>

      <nav>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-lg cursor-pointer mb-2 transition-colors"
          >
            <div className="min-w-[24px]">{item.icon}</div>
            {isOpen && (
              <span className="whitespace-nowrap transition-opacity">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarTest;
