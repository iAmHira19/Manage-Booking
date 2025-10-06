"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";

function AutoSlider() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 1000,
    cssEase: "linear",
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1540,
        settings: {
          slidesToShow: 7,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  const logoImages = [
    "/img/1.png",
    "/img/2.png",
    "/img/3.png",
    "/img/4.png",
    "/img/5.png",
    "/img/6.png",
    "/img/8.png",
    "/img/9.png",
    "/img/10.png",
    "/img/11.png",
    "/img/21.gif",
    "/img/16.png",
  ];

  return (
    <div className="flex items-center justify-center px-4 sm:px-8 md:px-16 w-full font-gotham">
      {/* Slider Section */}
      <div className="w-full overflow-x-hidden">
        <Slider {...settings}>
          {/* {logoImages.map((source, index) => (
            <div key={index} className="p-1 sm:p-2">
              <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
                <Image
                  unoptimized="true"
                  alt={`Logo ${index + 1}`}
                  src={source}
                  fill
                  style={{ objectFit: "fill" }}
                  className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
                />
              </div>
            </div>
          ))} */}
          {/* <div className="p-1 sm:p-2">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/1.png"
                fill
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div> */}
          <div className="p-1 sm:p-2 !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/2.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div>
          <div className="p-1 sm:p-2 !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/3.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div>
          <div className="p-1 sm:p-2 !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/4.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div>
          {/* <div className="p-1 sm:p-2">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/6.png"
                fill
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div> 
          <div className="p-1 sm:p-2">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/8.png"
                fill
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div>
          <div className="p-1 sm:p-2">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/9.png"
                fill
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div> */}
          <div className="p-1 sm:p-2 !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[134px] overflow-hidden flex !items-center !justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/10.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[134px]"
              />
            </div>
          </div>
          <div className="p-1 !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:w-[200px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/11.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[120px] md:!w-[200px]"
              />
            </div>
          </div>
          <div className="p-1 sm:p-2  !flex !items-center !justify-center w-full">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:w-[240px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/5.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[120px] md:!w-[170px]"
              />
            </div>
          </div>
          {/* <div className="p-1 sm:p-2">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[100px] md:w-[140px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/16.png"
                fill
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[100px] md:!w-[140px]"
              />
            </div>
          </div> */}
          <div className="p-1 sm:p-2 w-full !flex !items-center !justify-center">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:w-[170px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/21.gif"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[120px] md:!w-[170px]"
              />
            </div>
          </div>
          <div className="p-1 sm:p-2 w-full !flex !items-center !justify-center">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:!w-[190px] overflow-hidden flex items-center justify-center">
              <Image
                unoptimized="true"
                alt={`Logo`}
                src="/img/22.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[120px] md:!w-[190px]"
              />
            </div>
          </div>
          <div className="p-1 sm:py-2 w-full !flex !items-center !justify-center md:h-[130px]">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:w-[140px] overflow-hidden !flex !items-center !justify-center">
              <img
                unoptimized="true"
                alt={`Logo`}
                src="/img/23.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[60px] md:!w-[140px]"
              />
            </div>
          </div>
          <div className="p-1 sm:py-2 w-full !flex !items-center !justify-center md:h-[130px]">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:w-[200px] overflow-hidden !flex !items-center !justify-center">
              <img
                unoptimized="true"
                alt={`Logo`}
                src="/img/24.png"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[50px] md:!w-[200px]"
              />
            </div>
          </div>
          <div className="p-1 sm:py-2 w-full !flex !items-center !justify-center md:h-[130px]">
            <div className="relative min-w-[60px] min-h-[40px] sm:w-[120px] sm:h-[120px] md:!w-[200px] overflow-hidden !flex !items-center !justify-center">
              <img
                unoptimized="true"
                alt={`Logo`}
                src="/img/25.svg"
                fill="true"
                style={{ objectFit: "fill" }}
                className="rounded !w-[60px] !h-[40px] sm:!w-[120px] sm:!h-[50px] md:!w-[200px]"
              />
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}

// Removed layout="fill" from Image to fix issue of legacy prop
export default AutoSlider;
