"use client";
import React from "react";

export function Label({ children, className = "", htmlFor, ...props }) {
  return (
    <label
      className={`text-sm font-medium text-gray-700 ${className}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}

export default Label;
