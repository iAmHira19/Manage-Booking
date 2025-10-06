"use client";
import Image from "next/image";
import React from "react";

const Card = (props) => {
  return (
    <div className="relative flex flex-col my-4 bg-slate-100  border border-slate-200 rounded-lg font-gotham shadow-md">
      {/* Image Section */}
      <div className="relative min-h-48 md:min-h-48 overflow-hidden text-white rounded-t-lg">
        <Image
          unoptimized
          src={props.Image}
          alt={props.Title}
          fill
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h6 className="mb-2 text-orange-500 text-base md:text-xl sm:text-xl font-light font-gotham min-h-16 sm:min-h-32 md:min-h-20">
          {props.Title}
        </h6>
        <hr />
        <p className="text-blue-950 leading-normal my-4 text-base md:text-lg sm:text-xl font-gotham font-normal">
          {props.Fare}
        </p>
      </div>
    </div>
  );
};

export default Card;
