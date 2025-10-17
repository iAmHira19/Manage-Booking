"use client";
import React, { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Booking History");

  const menuItems = [
    "Booking History",
    "Split Itinerary",
    "Add Passengers",
    "Special Note",
    "Customer Support",
  ];

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-200 flex flex-col">
      <div className="p-5">
        {/* Title */}
        <h2 className="text-[14px] font-medium text-[#2E4A6B] mb-4 tracking-wide">
          Booking Info
        </h2>

        <div>
          <div className="text-[12px] text-gray-500 mb-3 uppercase tracking-wide">
            Your Plan
          </div>

          <div className="flex flex-col">
            {menuItems.map((item) => (
              <div
                key={item}
                onClick={() => setActiveItem(item)}
                className={`relative py-3 px-4 text-[15px] cursor-pointer transition-all duration-200 ${
                  activeItem === item
                    ? "bg-gray-100 text-[#2E4A6B]"
                    : "text-[#2E4A6B] hover:bg-gray-50"
                }`}
                style={{
                  fontFamily: "'Inter', 'Poppins', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.2px",
                }}
              >
                {item}
                {activeItem === item && (
                  <span className="absolute right-0 top-0 h-full w-[3px] bg-[#FF6B35] rounded-l-md transition-all"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
