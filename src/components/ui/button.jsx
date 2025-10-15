"use client";
import React from "react";

export function Button({ children, className = "", variant, ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none";
  const variantClass =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700"
      : "bg-sky-600 text-white hover:bg-sky-700";
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
