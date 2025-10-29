"use client";
import React from "react";

export function Button({ children, className = "", variant, ...props }) {
  const base = "inline-flex items-center justify-center rounded-md font-medium focus:outline-none";
  const variantClass =
    variant === "outline"
      ? "border border-[rgb(249,115,22)] text-[rgb(249,115,22)] bg-white hover:bg-[rgb(255,241,236)]"
      : "bg-[rgb(249,115,22)] text-white hover:bg-[rgb(234,88,12)]";
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
