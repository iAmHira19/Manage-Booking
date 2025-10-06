"use client";
import React, { useState } from "react";
const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="w-screen flex flex-col gap-y-5 lg:gap-y-20 items-center justify-center py-1 md:py-5">
      <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-gotham text-center py-5 md:py-6 text-orange-500">
        ABOUT US
      </h2>
      <div className="flex flex-col gap-y-5 CT:flex-row items-center gap-x-2">
        <div className="imageContainer w-full lg:min-h-[250px]">
          <img
            src={
              currentStep === 0
                ? "/img/about/who_we_are.jpg"
                : currentStep === 1
                ? "/img/about/what_we_do.jpg"
                : currentStep === 2 && "/img/about/how_we_do_it.JPG"
            }
            alt="Who we are image"
            className="w-full xl:max-w-[90%] min-h-full lg:h-full rounded-tr-full rounded-br-full object-contain shadow-2xl"
          />
        </div>
        <div className="flex flex-col w-full min-h-full gap-y-3 XS:gap-y-6 mr-3 px-5 lg:mr-0 lg:px-10">
          <div className="content lg:pr-10 flex flex-col gap-y-10">
            <ul className="head flex justify-between w-full">
              <li
                className={`text-xs XS:text-sm md:text-base lg:text-[18px] xl:text-[20px] font-gotham relative uppercase pb-2 cursor-pointer ${
                  currentStep == 0 ? "text-orange-500" : "text-blue-900"
                }`}
                onClick={() => setCurrentStep(0)}
              >
                Who we are
                <span
                  className={`absolute left-0 bottom-0 h-[1px] md:h-[2px] bg-blue-500 transition-all duration-300 ${
                    currentStep === 0 ? "w-full" : "w-0"
                  }`}
                ></span>
              </li>
              <li
                className={`text-xs XS:text-sm md:text-base lg:text-[18px] xl:text-[20px] font-gotham relative uppercase pb-2 cursor-pointer ${
                  currentStep == 1 ? "text-orange-500" : "text-blue-900"
                }`}
                onClick={() => setCurrentStep(1)}
              >
                What we do
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                    currentStep === 1 ? "w-full" : "w-0"
                  }`}
                ></span>
              </li>
              <li
                className={`text-xs XS:text-sm md:text-base lg:text-[17px] xl:text-[20px] font-gotham relative uppercase pb-2 cursor-pointer ${
                  currentStep == 2 ? "text-orange-500" : "text-blue-900"
                }`}
                onClick={() => setCurrentStep(2)}
              >
                How we do it
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                    currentStep === 2 ? "w-full" : "w-0"
                  }`}
                ></span>
              </li>
            </ul>
          </div>
          <div className="content lg:pr-10 w-full min-h-[300px]">
            <div
              className={`content1 w-full h-full ${
                currentStep === 0 ? "inline-block" : "hidden"
              }`}
            >
              <p className="text-xs XS:text-sm md:text-base text-justify font-gotham font-light">
                We are CherryFlight — your all-in-one travel partner. Since
                2012, we’ve been helping people book flights, cars, cruises, and
                unforgettable experiences with ease. During the COVID-19
                pandemic, when travel became uncertain, we took a bold step and
                moved everything online. This way, our customers could plan
                safely and comfortably from anywhere.
              </p>
              <p className="text-xs XS:text-sm md:text-base  text-justify font-gotham font-light">
                What makes us different? We don’t pass you to third parties. We
                manage everything ourselves — from start to finish. That means
                no middlemen, no confusion — just a smooth, reliable service you
                can trust.
              </p>
              <p className="text-xs XS:text-sm md:text-base  text-justify font-gotham font-light">
                We love travel, and we believe it has the power to bring people
                together, create memories, and open minds. That’s why we work
                hard to make every journey simple, safe, and special.
              </p>
            </div>
            <div
              className={`content1 w-full h-full ${
                currentStep === 1 ? "inline-block" : "hidden"
              }`}
            >
              <p className="text-xs XS:text-sm md:text-base text-justify font-gotham font-light">
                At CherryFlight, we bring all your travel needs into one easy
                platform. You can book flights with multiple options that match
                your schedule, budget, and preferences. We also help you find
                the right hotel and rent a car so your journey is smooth from
                start to finish. To make your trip even more special, our
                &quot;Things to Do&quot; service shows you the best activities
                and experiences in your destination. Whether you&apos;re
                traveling for business or adventure, we make it easy to plan and
                enjoy every moment.
              </p>
            </div>
            <div
              className={`content1 w-full h-full ${
                currentStep === 2 ? "inline-block" : "hidden"
              }`}
            >
              <p className="text-xs XS:text-sm md:text-base text-justify font-gotham font-light">
                At CherryFlight, our success comes from the perfect mix of
                technology and travel expertise. We have a skilled development
                team that builds a smooth, secure, and user-friendly platform to
                make booking easy for everyone. Alongside them, our experienced
                travel experts bring deep industry knowledge to shape services
                that truly meet travelers’ needs. From smart flight search tools
                to handpicked activities, every part of our platform is designed
                with care — to give you the best travel planning experience
                possible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
