"use client";
import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`rounded-lg bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={`border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-medium ${className}`}>{children}</h3>;
}

export default Card;
