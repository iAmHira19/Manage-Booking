"use client";
import React from "react";
import { Headphones, Phone, Info } from "lucide-react";
import Link from "next/link";
import { useSignInContext } from "@/providers/SignInStateProvider";

function Page() {
  const { setModalType, setIsModalVisible } = useSignInContext();

  return (
    <>
      <div className="bg-blue-900 min-h-screen md:min-h-[33%]">
        <div className="text-white p-14 flex justify-between items-center flex-col-reverse md:flex-row w-full">
          <div className="flex flex-col gap-y-4 min-w-[35%]">
            <h1 className="text-3xl uppercase md:text-3xl font-bold font-gotham">
              Customer Support
            </h1>
            <div>
              <p className="text-base text-center md:text-start font-normal font-gotham">
                Customer Support in Seconds
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 ">
              <button className="bg-transparent text-white border-2 border-white font-semibold uppercase text-sm md:text-base md:px-4 rounded-md shadow font-gotham w-full py-2">
                <Link href="/">Search Flight</Link>
              </button>
              <button
                className="bg-white text-blue-900 font-semibold uppercase text-sm md:text-base md:px-4 rounded-md shadow font-gotham w-full py-2"
                onClick={() => {
                  setModalType("Sign In");
                  setIsModalVisible(true);
                }}
              >
                Sign In or Register
              </button>
            </div>
          </div>
          <div className="heroImg max-w-64">
            <img src="/img/customer-support.png" alt="Customer Support" />
          </div>
        </div>
      </div>

      <div className="bg-gray-200 rounded-t-[32px] md:p-10 relative md:-top-12 flex flex-col items-center">
        <div className="bg-white rounded-xl w-full md:w-11/12 px-5 sm:px-10">
          <h2 className="text-2xl font-bold py-5 text-blue-900 font-gotham">
            Service Chat
          </h2>
          <div className="flex gap-4 py-5">
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-md flex items-center gap-2 font-gotham"
              disabled
            >
              <span>✈️</span> Flights
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-md items-center gap-2 font-gotham hidden">
              <span>🏨</span> Hotels & Homes
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-md items-center gap-2 font-gotham hidden">
              <span>🚆</span> Trains
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded-md items-center gap-2 font-gotham hidden">
              <span>🚖</span> Airport Transfers
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 py-5">
            <Link href="/FAQ" className="bg-gray-100 hover:bg-gray-200">
              <button className="text-start px-4 py-3 rounded-md cursor-pointer font-gotham font-light">
                What is an Electronic Ticket (e-Ticket) ?
              </button>
            </Link>
            <Link href="/FAQ" className="bg-gray-100 hover:bg-gray-200">
              <button className="text-start px-4 py-3 rounded-md cursor-pointer font-gotham font-light">
                My search shows no results. What should I do ?
              </button>
            </Link>
            <Link href="/FAQ" className="bg-gray-100 hover:bg-gray-200">
              <button className="text-start px-4 py-3 rounded-md cursor-pointer font-gotham font-light">
                How can I book Ticket for Infant ?
              </button>
            </Link>
            <Link href="/FAQ" className="bg-gray-100 hover:bg-gray-200">
              <button className="text-start px-4 py-3 rounded-md cursor-pointer font-gotham font-light">
                Have a different question? Chat with us now.
              </button>
            </Link>
          </div>

          <div className="mt-6 pb-5 hidden">
            <h3 className="text-2xl font-gotham font-bold text-blue-900 mb-6">
              More Flights FAQ
            </h3>
            <div className="grid lg:grid-cols-4 CT:grid-cols-3 md:grid-cols-2 gap-4 sm:gap-6 flex-wrap items-center md:justify-center w-full">
              <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 font-gotham font-light">
                <Link href="/">Search Bookings</Link>
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 font-gotham font-light">
                <Link href="/">Sign In or Register</Link>
              </button>
              {/* <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 font-gotham font-light">
                <Link href="/FAQ">Search Bookings</Link>
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 font-gotham font-light">
                <Link href="/FAQ">Sign In or Register</Link>
              </button> */}
            </div>
          </div>
        </div>
        <div className="bg-white py-6 mt-5 md:mt-10 flex flex-row gap-y-6 justify-around rounded-xl items-center w-full md:w-11/12">
          <div className="text-blue-900 font-gotham cursor-pointer">
            <Link
              href="https://wa.me/923008408068?text=Hi%20CherryFlights"
              className="flex items-center gap-2"
            >
              <Headphones className="font-base font-gotham" />
              <span className="font-medium">Chat</span>
            </Link>
          </div>
          <div className="h-6 w-px bg-gray-300 hidden sm:inline-block" />
          <div className="flex items-center gap-2 text-blue-900 font-gotham">
            <Link href="tel:+923008408068" className="flex items-center gap-2">
              <Phone className="font-base font-gotham" />
              <span className="font-medium">Call Us</span>
            </Link>
          </div>
          <div className="h-6 w-px bg-gray-300 hidden sm:inline-block" />
          <div className="flex items-center gap-2 text-blue-900 font-gotham">
            <Link href="/FAQ" className="flex items-center gap-2">
              <Info className="font-base font-gotham" />
              <span className="font-medium">FAQ</span>
            </Link>
          </div>
        </div>
        <div className="bg-white px-5 md:px-9 py-5 flex justify-between rounded-xl items-center my-5 md:mt-7 w-full md:w-11/12">
          <div className="text-blue-900">
            <h2 className="sm:font-bold text-base md:text-2xl pb-3 font-gotham">
              Travel Worry-free With Our Reliable Support
            </h2>
            <p className="text-sm sm:text-base text-justify font-gotham font-light">
              Thanks to our extensive CherryFlight.com Service Guarantee, your
              booking is protected against unexpected issues which might come
              up.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
