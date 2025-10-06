"use client";
import React from "react";
import Card from "./Card";

const HeroSectionCard = () => {
  return (
    <>
      <div className="flex flex-col items-center font-gotham">
        <h2 className="text-xl md:text-3xl text-center sm:text-left mx-4 sm:mx-12 mt-6 uppercase text-orange-500 font-gotham font-bold">
          Start Planning your next trip
        </h2>
        <p className="text-base md:text-lg sm:text-xl text-center sm:text-left mx-4 sm:mx-12 mt-4 font-gotham font-light">
          Thinking of travelling somewhere soon? Here are some options to help
          you get started
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 w-full px-4 sm:px-8 mt-4 md:mt-8">
          <Card
            Title="The Maldives welcomes you with sunshine, peace, and ocean dreams."
            Fare="Where calm meets clear waters"
            Image="/img/FirstImg.jpg"
          />
          <Card
            Title="Where East meets West in color, flavor, and architecture"
            Fare="Step into Living History in Turkey"
            Image="/img/SecondImg.jpg"
          />
          <Card
            Title="A destination where innovation and nature coexist in perfect harmony."
            Fare="See Tomorrow in Singapore Today"
            Image="/img/Singapore.jpg"
          />
          <Card
            Title="Let the world’s tallest buildings and golden dunes reshape your idea of travel."
            Fare="Discover the Future in Dubai's Skyline"
            Image="/img/fourthImg.jpg"
          />
          <Card
            Title="Nature’s perfection meets peaceful luxury in every corner."
            Fare="Breathe in the Beauty of Switzerland"
            Image="/img/fifthImg.jpg"
          />
          <Card
            Title="Experience the spiritual heart of Islam in the holy city of Makkah."
            Fare="A Journey of Faith and Reflection"
            Image="/img/sixthImg.jpg"
          />
        </div>
      </div>
    </>
  );
};

export default HeroSectionCard;
