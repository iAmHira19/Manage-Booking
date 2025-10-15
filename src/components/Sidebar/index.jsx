"use client";
import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <nav className="w-full">
      <ul className="flex flex-col gap-2 text-sm">
        <li>
          <Link href="/manage_booking" className="block px-3 py-2 rounded hover:bg-slate-100">
            My Bookings
          </Link>
        </li>
        <li>
          <Link href="/manage_booking/booking_details" className="block px-3 py-2 rounded bg-sky-50 text-sky-700">
            Booking Details
          </Link>
        </li>
        <li>
          <Link href="/" className="block px-3 py-2 rounded hover:bg-slate-100">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
}
