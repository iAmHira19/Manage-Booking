"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Navbar/Navbar";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 !z-[1000] bg-white shadow">
      <div className="container min-w-full flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              unoptimized
              src="/img/logo.png"
              alt="HFT-Logo"
              width={270}
              height={270}
              style={{ objectFit: "cover" }}
              className="object-contain w-32 sm:w-44 md:w-52 lg:w-60 xl:w-64"
            />
          </Link>
        </div>

        {/* Desktop Navbar (hide hamburger here) */}
        <nav className="hidden lg:block">
          <Navbar isMobile={false} />
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4">
            <Navbar isMobile={true} />
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
