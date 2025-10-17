"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Select({ children, value, onValueChange, defaultValue, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <span className={selectedValue ? "text-gray-900" : "text-gray-500"}>
          {selectedValue || "Select an option"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  return (
    <div
      className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  );
}

export function SelectValue({ placeholder = "Select an option" }) {
  return <span className="text-gray-500">{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ children, value, onSelect, ...props }) {
  const handleClick = () => {
    onSelect?.(value);
  };

  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Select;
