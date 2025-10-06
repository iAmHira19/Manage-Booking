import React from "react";
import { Headphones, Phone, Info } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-blue-900 relative">
        <div className="text-white px-44 pt-12 pb-10">
          <h1 className="text-3xl font-bold mb-2 uppercase font-gotham">
            Customer Support.
          </h1>
          <div className="details">
            <div className="flex items-center mb-6">
              <p className="text-base font-semibold text-white font-gotham">
                Customer Support in Seconds
              </p>
            </div>
            <div className="flex gap-4">
              <button className="bg-transparent text-white font-normal border border-white py-2 px-4 rounded-md shadow font-gotham uppercase">
                Search Bookings
              </button>
              <button className="bg-white text-blue-900 font-semibold py-2 px-4 rounded-md shadow uppercase">
                Sign In or Register
              </button>
            </div>
          </div>

          <div className="absolute -top-5 right-8 hidden md:block">
            <img
              src="/img/customer-support.png"
              alt="Support Agent"
              className="w-72"
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-t-3xl p-44 py-5 absolute left-0 right-0 h-full shadow-lg">
          <div className="bg-white px-8 py-5 rounded-xl absolute left-36 right-36 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-[#082b48]">
              Service Chat
            </h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button className="bg-[#082b48] text-white px-4 py-2 rounded-md flex items-center gap-2">
                <span>✈️</span> Flights
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2">
                <span>🏨</span> Hotels & Homes
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2">
                <span>🚆</span> Trains
              </button>
              <button className="bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2">
                <span>🚖</span> Airport Transfers
              </button>
            </div>

            {/* FAQs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200">
                What is an Electronic Ticket (e-Ticket) ?
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200">
                My search shows no results. What should I do ?
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200">
                How can I book Ticket for Infant ?
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-200">
                Have a different question? Chat with us now.
              </div>
            </div>

            {/* More FAQ Tags */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#082b48] mb-3">
                More Flights FAQ
              </h3>
              <div className="flex flex-wrap gap-6">
                {[
                  "Hot Topics",
                  "Booking & Price",
                  "Ticketing & Payment",
                  "Booking Query",
                  "Passenger Information-related",
                ].map((tag, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-44 left-36 right-36 py-6 mt-10 flex absolute justify-between rounded-xl items-center shadow bottom-10">
          <div className="flex items-center gap-2 text-[#082b48]">
            <Headphones size={20} />
            <span className="font-medium">Chat</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2 text-[#082b48]">
            <Phone size={20} />
            <span className="font-medium">Call Us</span>
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2 text-[#082b48]">
            <Info size={20} />
            <span className="font-medium">FAQ</span>
          </div>
        </div>

        <div className="bg-white px-9 left-36 right-36 py-5 flex absolute justify-between rounded-xl items-center shadow -bottom-20">
          <div className="text-[#082b48]">
            <h2 className="font-bold text-2xl pb-3">
              Travel Worry-free With Our Reliable Support
            </h2>
            <p className="text-sm">
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
