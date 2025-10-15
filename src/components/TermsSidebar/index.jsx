"use client";
import React from "react";

export default function TermsSidebar({ active, onClick, items, className = "" }) {
  // Fallback default items for pages that don't pass a custom list
  const defaultItems = [
    "Agreement between you and CherryFlight",
    "Modifications of Terms",
    "Entire Agreement",
    "Indemnity",
    "Intellectual Property Rights",
    "Use of Credit Card",
    "Security",
    "Passport",
    "Health Insurance / Requirements",
    "Website Content",
  ];

  const list = Array.isArray(items) && items.length ? items : defaultItems;

  // Use the exact container classes from the Refund page; increase active border for stronger accent
  // Match the Refund/Cherry Return sidebar container so spacing and alignment are identical
  // If a custom className is provided, use it to allow pages to control exact width/spacing
  const containerClass = className && className.length
    ? className
    : "w-auto min-w[10%] xl:min-w-[20%] hidden lg:flex flex-col bg-white h-fit relative top-8 left-5 xl:left-20 gap-y-2 py-4";

  return (
    <div className={containerClass}>
      {list.map((item) => (
        <button
          key={item}
          onClick={() => onClick && onClick(item)}
          className={`p-3 text-left cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-8 hover:border-orange-500 ${
            active === item ? "border-r-8 border-orange-500 bg-slate-100" : "bg-white border-r-0"
          } text-xl`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
