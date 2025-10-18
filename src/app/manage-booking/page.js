"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Upload, ChevronDown, ChevronUp, X, Mail, Phone, FileText, MapPin, Eye, Printer } from "lucide-react";
import ImageWithFallback from "@/components/figma/ImageWithFallback";
import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Booking data for the booking history table
const bookingHistoryData = [
  {
    id: 1,
    bookingRef: "CHF321",
    dateIssue: "Sat 14, Dec",
    flightNumber: "EK 521 (Aircraft: 388)",
    tripType: "One Way (Non-refundable)",
  },
  {
    id: 2,
    bookingRef: "CHF322",
    dateIssue: "Fri 13, Dec",
    flightNumber: "QF 491 (Aircraft: 73H)",
    tripType: "Round Trip (Refundable)",
  },
  {
    id: 3,
    bookingRef: "CHF456",
    dateIssue: "Sat 14, Dec",
    flightNumber: "EK 521 (Aircraft: 388)",
    tripType: "One Way (Non-refundable)",
  },
  {
    id: 4,
    bookingRef: "CHF321",
    dateIssue: "Fri 13, Dec",
    flightNumber: "QF 491 (Aircraft: 73H)",
    tripType: "Round Trip (Refundable)",
  },
  {
    id: 5,
    bookingRef: "CHF646",
    dateIssue: "Sat 14, Dec",
    flightNumber: "EK 521 (Aircraft: 388)",
    tripType: "One Way (Non-refundable)",
  },
];

export default function ManageBooking() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [logoUrl, setLogoUrl] = useState("/img/logo.png");
  const [activeMenuItem, setActiveMenuItem] = useState("Booking History");
  const [selectedPlanRow, setSelectedPlanRow] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const fileInputRef = useRef(null);
  // Ticket responses keyed by booking id. When hasTicket is true the three actions are shown.
  const [ticketResponses, setTicketResponses] = useState({
    // Example: booking id 1 has a ticket. Real responses should be set from API.
    1: { hasTicket: true, ticketUrl: "/mock/ticket_CHF321.pdf" },
  });

  const sampleTripData = [
    {
      srNo: 1,
      passengerName: "Muhammad Ali Abbas",
      airlineBookingRef: "CHF321",
      flyingFrom: "Lahore",
      deptTime: "14:30",
      flyingTo: "Karachi",
      arrivalTime: "16:45",
      baggage: "20kg",
      class: "Economy",
      status: "Used",
    },
    {
      srNo: 2,
      passengerName: "Sarah Ahmed Khan",
      airlineBookingRef: "CHF322",
      flyingFrom: "Karachi",
      deptTime: "18:15",
      flyingTo: "Lahore",
      arrivalTime: "20:30",
      baggage: "25kg",
      class: "Business",
      status: "Not Use",
    },
    {
      srNo: 3,
      passengerName: "Ahmed Hassan Ali",
      airlineBookingRef: "CHF323",
      flyingFrom: "Lahore",
      deptTime: "09:45",
      flyingTo: "Dubai",
      arrivalTime: "12:00",
      baggage: "30kg",
      class: "Economy",
      status: "Not Use",
    },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoUrl(imageUrl);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleRowClick = (rowId) => {
    setSelectedPlanRow(
      selectedPlanRow === rowId ? null : rowId,
    );
  };

  const handleEditInfo = (passenger) => {
    setEditingPassenger({
      ...passenger,
      email: "passenger@email.com",
      phone: "+92 300 1234567",
      street: "123 Main Street",
      city: "Lahore",
      state: "Punjab",
      postalCode: "54000",
      country: "Pakistan",
      firstName: passenger.passengerName.split(" ")[0],
      lastName: passenger.passengerName.split(" ").slice(-1)[0],
      passportNumber: "AB1234567",
      passportExpiry: "2025-12-31",
      dateOfBirth: "1990-01-01",
      nationality: "Pakistani",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    // Handle save logic here
    setIsEditModalOpen(false);
    setEditingPassenger(null);
  };

  const handleResendTicket = (bookingId) => {
    // TODO: Replace with real API call to resend ticket email
    console.log("Resend ticket requested for", bookingId);
    // Provide immediate UI feedback (could be toast)
    alert(`Resend ticket email requested for booking ${bookingId}`);
  };

  const handleViewTicket = (bookingId) => {
    const resp = ticketResponses[bookingId];
    if (resp && resp.hasTicket && resp.ticketUrl) {
      window.open(resp.ticketUrl, "_blank");
    } else {
      alert("No ticket available to view for this booking.");
    }
  };

  const handlePrintTicket = (bookingId) => {
    const resp = ticketResponses[bookingId];
    if (resp && resp.hasTicket && resp.ticketUrl) {
      const w = window.open(resp.ticketUrl, "_blank");
      // Attempt to print after opening - may be blocked by browser.
      setTimeout(() => {
        try {
          w && w.print && w.print();
        } catch (e) {
          console.warn("Print could not be triggered programmatically", e);
        }
      }, 500);
    } else {
      alert("No ticket available to print for this booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar - hidden on small screens */}
        <aside className="hidden lg:block w-64 lg:min-h-screen order-2 lg:order-1">
          <Sidebar />
        </aside>

        {/* Mobile/Tablet compact tab navigation - visible only on small screens */}
        <div className="lg:hidden w-full px-2 sm:px-4 py-3 order-1 bg-white border-b border-gray-200">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
            {[
              'Booking History',
              'Split Itinerary',
              'Add Passengers',
              'Special Note',
              'Customer Support',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenuItem(item)}
                className={`whitespace-nowrap px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  activeMenuItem === item
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'bg-white text-[#153E7E] border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 order-2 lg:order-2 mt-2 sm:mt-4 lg:mt-0">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-semibold text-[#FF6B35] mb-3 sm:mb-4 lg:mb-6 tracking-wide uppercase">
              {activeMenuItem}
            </h1>

            {/* Booking History Card */}
            <Card className="mb-3 sm:mb-4 lg:mb-6 border border-gray-200 shadow-md w-full max-w-full mx-auto rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 flex justify-center">
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-[20px] font-bold text-[#2E4A6B] tracking-wide relative inline-block">
                  <span className="relative inline-block">
                    Booking History
                    <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto bg-white">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B] min-w-[600px]">
                    <thead className="bg-[#002b5c] text-white text-xs sm:text-sm md:text-[15px] font-medium uppercase">
                      <tr>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Booking #
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Date
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Flight Details
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Trip Type
                        </th>
                        <th className="text-center py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200 w-12 sm:w-16"></th>
                      </tr>
                    </thead>

                    <tbody className="text-sm sm:text-[15px] font-normal">
                      {bookingHistoryData.map(
                        (booking, index) => (
                          <>
                            <tr
                              key={booking.id}
                              onClick={() =>
                                handleRowClick(booking.id)
                              }
                              className={`border-b border-gray-100 hover:bg-[#E8F4FD] transition cursor-pointer ${
                                index % 2 === 0
                                  ? "bg-white"
                                  : "bg-[#F9FBFF]"
                              } ${selectedPlanRow === booking.id ? "bg-[#E8F4FD]" : ""}`}
                            >
                              <td className="py-2 px-3 sm:py-3 sm:px-5">
                                {booking.bookingRef}
                              </td>
                              <td className="py-2 px-3 sm:py-3 sm:px-5">
                                {booking.dateIssue}
                              </td>
                              <td className="py-2 px-3 sm:py-3 sm:px-5">
                                {booking.flightNumber}
                              </td>
                              <td className="py-2 px-3 sm:py-3 sm:px-5">
                                {booking.tripType}
                              </td>
                              <td className="py-3 px-5 text-center">
                                {selectedPlanRow ===
                                booking.id ? (
                                  <ChevronUp className="w-5 h-5 text-[#002b5c] mx-auto" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-[#002b5c] mx-auto" />
                                )}
                              </td>
                            </tr>
                            {selectedPlanRow === booking.id && (
                              <tr>
                                <td colSpan={5} className="p-0">
                                  <div className="bg-[#f8f9fa] p-6 border-t-2 border-[#002b5c]">
                                    {/* Selected Plan Subtable */}
                                    <div className="mb-4">
                                      <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-4 text-center">
                                        Selected Plan
                                      </h3>
                                    </div>

                                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                                      <table className="w-full border border-gray-200 text-[#2E4A6B] min-w-[800px]">
                                        <thead className="bg-[#002b5c] text-white text-xs sm:text-sm md:text-[14px] font-medium uppercase">
                                          <tr>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              #
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Passenger
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Booking Ref
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              From
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Dept
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              To
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Arrival
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Baggage
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Class
                                            </th>
                                            <th className="text-left py-2 px-1 sm:py-3 sm:px-2 md:px-4 border-b border-gray-200">
                                              Actions
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-xs sm:text-sm md:text-[14px] font-normal">
                                          {sampleTripData.map(
                                            (
                                              trip,
                                              tripIndex,
                                            ) => (
                                              <tr
                                                key={trip.srNo}
                                                className={`border-b border-gray-100 ${
                                                  tripIndex %
                                                    2 ===
                                                  0
                                                    ? "bg-white"
                                                    : "bg-[#F9FBFF]"
                                                }`}
                                              >
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {trip.srNo}
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.passengerName
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.airlineBookingRef
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.flyingFrom
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.deptTime
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.flyingTo
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {
                                                    trip.arrivalTime
                                                  }
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {trip.baggage}
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  {trip.class}
                                                </td>
                                                <td className="py-2 px-1 sm:py-3 sm:px-2 md:px-4">
                                                  <Button
                                                    size="sm"
                                                    onClick={() =>
                                                      handleEditInfo(
                                                        trip,
                                                      )
                                                    }
                                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
                                                  >
                                                    Edit Info
                                                  </Button>
                                                </td>
                                              </tr>
                                            ),
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* View Ticket Actions: show when a valid ticket response exists for this booking */}
                                    <div className="mt-6 flex justify-center">
                                      {ticketResponses[booking.id] && ticketResponses[booking.id].hasTicket ? (
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-4">
                                          <Button
                                            onClick={() => handleResendTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm"
                                          >
                                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm">Resend Ticket Email</span>
                                          </Button>

                                          <Button
                                            onClick={() => handleViewTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm"
                                          >
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm">View Ticket</span>
                                          </Button>

                                          <Button
                                            onClick={() => handlePrintTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm"
                                          >
                                            <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="text-xs sm:text-sm">Print</span>
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="text-center text-xs sm:text-sm text-gray-600 w-full sm:w-auto">
                                          No Ticket Available
                                        </div>
                                      )}
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Actions for selected booking: centered row with three buttons */}
            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-md px-2 sm:px-4">
                <Button
                  onClick={() => handleResendTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Resend Ticket Email</span>
                </Button>

                <Button
                  onClick={() => handleViewTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">View Ticket</span>
                </Button>

                <Button
                  onClick={() => handlePrintTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Print</span>
                </Button>
              </div>
            </div>

            {/* Footer Contact Info */}
            <div className="mt-4 lg:mt-6 text-xs sm:text-sm text-gray-600 text-center">
              
              <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1 sm:gap-2">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Edit Info Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        {/* <DialogContent className="max-w-[720px] w-[92vw] sm:w-[640px] bg-white border border-gray-100 rounded-xl shadow-xl p-0 overflow-hidden flex flex-col mx-auto"> */}
          {/* Modern Header */}
          <DialogContent className="max-w-[640px] w-[92vw] sm:w-[640px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col mx-auto my-auto max-h-[72vh]">

          <div className="bg-gradient-to-r from-[#002b5c] to-[#003d7a] px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg sm:text-xl lg:text-[24px] font-bold text-white mb-1">
                  Edit Passenger Information
                </DialogTitle>
                <p className="text-blue-200 text-xs sm:text-sm lg:text-[14px]">
                  {editingPassenger?.passengerName}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white hover:bg-white/10 transition-colors rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {editingPassenger && (
            <div className="overflow-y-auto flex-1">
              <div className="p-6 sm:p-8">
                {/* Beautiful Tabs */}
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1 rounded-xl mb-6 sm:mb-8">
                    <TabsTrigger
                      value="email"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                    <TabsTrigger
                      value="document"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Document
                    </TabsTrigger>
                    <TabsTrigger
                      value="address"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Address
                    </TabsTrigger>
                  </TabsList>

                  {/* Email Tab */}
                  <TabsContent
                    value="email"
                    className="space-y-6 mt-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                        Email Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[#002b5c] font-medium">
                            Current Email Address
                          </Label>
                          <div className="relative">
                            <Input
                              value={editingPassenger.email}
                              disabled
                              className="bg-blue-50/50 border-blue-200 text-gray-700 cursor-not-allowed rounded-lg h-12 pl-4"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              Current
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="newEmail"
                            className="text-[#002b5c] font-medium"
                          >
                            New Email Address
                          </Label>
                          <Input
                            id="newEmail"
                            type="email"
                            placeholder="Enter new email address"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmEmail"
                            className="text-[#002b5c] font-medium"
                          >
                            Confirm New Email Address
                          </Label>
                          <Input
                            id="confirmEmail"
                            type="email"
                            placeholder="Re-enter new email address"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Phone Tab */}
                  <TabsContent
                    value="phone"
                    className="space-y-6 mt-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                        Phone Number Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[#002b5c] font-medium">
                            Current Phone Number
                          </Label>
                          <div className="relative">
                            <Input
                              value={editingPassenger.phone}
                              disabled
                              className="bg-blue-50/50 border-blue-200 text-gray-700 cursor-not-allowed rounded-lg h-12 pl-4"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              Current
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="newPhone"
                            className="text-[#002b5c] font-medium"
                          >
                            New Phone Number
                          </Label>
                          <Input
                            id="newPhone"
                            type="tel"
                            placeholder="Enter new phone number"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPhone"
                            className="text-[#002b5c] font-medium"
                          >
                            Confirm New Phone Number
                          </Label>
                          <Input
                            id="confirmPhone"
                            type="tel"
                            placeholder="Re-enter new phone number"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Travel Document Tab */}
                  <TabsContent
                    value="document"
                    className="space-y-6 mt-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                        Travel Document Information
                      </h3>

                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-[#002b5c] font-medium"
                            >
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              defaultValue={
                                editingPassenger.firstName
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-[#002b5c] font-medium"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              defaultValue={
                                editingPassenger.lastName
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="middleName"
                            className="text-[#002b5c] font-medium"
                          >
                            Middle Name{" "}
                            <span className="text-gray-400">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            id="middleName"
                            placeholder="Enter middle name"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="dateOfBirth"
                              className="text-[#002b5c] font-medium"
                            >
                              Date of Birth
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              defaultValue={
                                editingPassenger.dateOfBirth
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="nationality"
                              className="text-[#002b5c] font-medium"
                            >
                              Nationality
                            </Label>
                            <Input
                              id="nationality"
                              defaultValue={
                                editingPassenger.nationality
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="passportNumber"
                              className="text-[#002b5c] font-medium"
                            >
                              Passport Number
                            </Label>
                            <Input
                              id="passportNumber"
                              defaultValue={
                                editingPassenger.passportNumber
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="passportExpiry"
                              className="text-[#002b5c] font-medium"
                            >
                              Passport Expiry Date
                            </Label>
                            <Input
                              id="passportExpiry"
                              type="date"
                              defaultValue={
                                editingPassenger.passportExpiry
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="issuingCountry"
                            className="text-[#002b5c] font-medium"
                          >
                            Passport Issuing Country
                          </Label>
                          <Select defaultValue="Pakistan">
                            <SelectTrigger className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pakistan">
                                Pakistan
                              </SelectItem>
                              <SelectItem value="India">
                                India
                              </SelectItem>
                              <SelectItem value="UAE">
                                United Arab Emirates
                              </SelectItem>
                              <SelectItem value="UK">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="USA">
                                United States
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Address Tab */}
                  <TabsContent
                    value="address"
                    className="space-y-6 mt-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                        Address Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="street"
                            className="text-[#002b5c] font-medium"
                          >
                            Street Address
                          </Label>
                          <Input
                            id="street"
                            defaultValue={
                              editingPassenger.street
                            }
                            placeholder="Enter street address"
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="apartment"
                            className="text-[#002b5c] font-medium"
                          >
                            Apartment, Suite, etc.{" "}
                            <span className="text-gray-400">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            id="apartment"
                            placeholder="Apt, Suite, Unit, Building, Floor, etc."
                            className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="text-[#002b5c] font-medium"
                            >
                              City
                            </Label>
                            <Input
                              id="city"
                              defaultValue={
                                editingPassenger.city
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="state"
                              className="text-[#002b5c] font-medium"
                            >
                              State / Province
                            </Label>
                            <Input
                              id="state"
                              defaultValue={
                                editingPassenger.state
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="postalCode"
                              className="text-[#002b5c] font-medium"
                            >
                              Postal Code / ZIP Code
                            </Label>
                            <Input
                              id="postalCode"
                              defaultValue={
                                editingPassenger.postalCode
                              }
                              className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="country"
                              className="text-[#002b5c] font-medium"
                            >
                              Country
                            </Label>
                            <Select
                              defaultValue={
                                editingPassenger.country
                              }
                            >
                              <SelectTrigger className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pakistan">
                                  Pakistan
                                </SelectItem>
                                <SelectItem value="India">
                                  India
                                </SelectItem>
                                <SelectItem value="UAE">
                                  United Arab Emirates
                                </SelectItem>
                                <SelectItem value="UK">
                                  United Kingdom
                                </SelectItem>
                                <SelectItem value="USA">
                                  United States
                                </SelectItem>
                                <SelectItem value="Canada">
                                  Canada
                                </SelectItem>
                                <SelectItem value="Australia">
                                  Australia
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Modern Footer with Action Buttons */}
          <div className="border-t border-gray-200 bg-white px-4 sm:px-8 py-3 sm:py-5 flex justify-end gap-3 sm:gap-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 sm:px-8 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all h-10 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#002b5c] to-[#003d7a] hover:from-[#001d42] hover:to-[#002b5c] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium h-10 sm:h-12 text-sm sm:text-base"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Site Footer */}
      <Footer showPaymentImages={false} />
    </div>
  );
}
