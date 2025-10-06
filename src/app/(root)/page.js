"use client";
import { useEffect } from "react";
import styles from "@/app/page.module.css";
import BookingSection from "@/app/component/(FirstPageComponents)/(BookingSection)/BookingSection/BookingSection";
import HeroSectionCard from "@/app/component/(FirstPageComponents)/HeroSectionCard/HeroSectionCard";
import Achievements from "@/app/component/(FirstPageComponents)/Achievements/Achievements";
import AutoSlider from "@/app/component/(FirstPageComponents)/Autoslider/AutoSlider";
import { Toaster } from "react-hot-toast";
export default function Home() {
   useEffect(() => {
    // --- Clear storages ---
    localStorage.clear();
    sessionStorage.clear();

    // --- Clear cookies accessible by JS ---
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }, []);
  return (
    <>
      <Toaster />
      <main className="overflow-hidden">
        {/* Booking Section */}
        <div
          className={`flex justify-center flex-col items-center w-full font-gotham`}
        >
          {/* bg-img */}
          <div className={`${styles.bg} w-full`}></div>
          <div className={`absolute w-full ${styles.bookingWrapper}`}>
            <BookingSection />
          </div>
        </div>

        {/* Autoslider */}
        <div className="autoSlider font-gotham">
          <AutoSlider />
        </div>
        {/* Hero section cards */}
        <div className="herosectioncardItems py-6 md:py-12 font-gotham">
          <HeroSectionCard />
        </div>
        {/* Achievements */}
        <div className="achieveme font-gotham hidden">
          <Achievements />
        </div>
      </main>
    </>
  );
}
