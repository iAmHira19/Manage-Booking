"use client";
import React from "react";

export function Badge({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-gray-200 text-gray-900",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
