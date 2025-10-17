"use client";
import React, { useState } from "react";

export function Tabs({ children, defaultValue, className = "", ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = "", activeTab, setActiveTab, ...props }) {
  return (
    <div className={`flex ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ children, value, className = "", activeTab, setActiveTab, ...props }) {
  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-gray-700"
      } ${className}`}
      onClick={() => setActiveTab?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = "", activeTab, ...props }) {
  if (activeTab !== value) return null;

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export default Tabs;
