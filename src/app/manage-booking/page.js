"use client";

import React, { useState, useRef, useEffect } from "react";
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

export default function ManageBooking() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [logoUrl, setLogoUrl] = useState("/img/logo.png");
  const [activeMenuItem, setActiveMenuItem] = useState("Booking History");
  const [selectedPlanRow, setSelectedPlanRow] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const fileInputRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookingContext, setBookingContext] = useState(null);
  const [message, setMessage] = useState("");
  const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:8081";
  // Ticket responses keyed by booking id. When hasTicket is true the three actions are shown.
  const [ticketResponses, setTicketResponses] = useState({});

  

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
    const names = (passenger.fullName || passenger.passengerName || " ").split(" ");
    const firstName = passenger.firstName || names[0] || "";
    const lastName = passenger.lastName || names.slice(1).join(" ") || "";
    setEditingPassenger({
      ...passenger,
      firstName,
      lastName,
      email: passenger.email || "",
      phone: passenger.phone || "",
      street: passenger.address?.street || "",
      city: passenger.address?.city || "",
      state: passenger.address?.state || "",
      postalCode: passenger.address?.postalCode || "",
      country: passenger.address?.country || "",
      passportNumber: passenger.documentNumber || "",
      passportExpiry: passenger.documentExpiry || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingPassenger) return;
      const pnr = bookingContext?.bookingId || editingPassenger.airlineBookingRef || editingPassenger.airlineBookingReference;
      const passengerId = editingPassenger.id || editingPassenger.srNo;

      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : "";
      };

      const newEmail = getVal("newEmail");
      const newPhone = getVal("newPhone");
      const firstName = getVal("firstName");
      const lastName = getVal("lastName");
      const passportNumber = getVal("passportNumber");
      const passportExpiry = getVal("passportExpiry");

      const updates = [];
      if (newEmail && newEmail !== (editingPassenger.email || "")) {
        updates.push({ type: "email", data: { newEmail } });
      }
      if (newPhone && newPhone !== (editingPassenger.phone || "")) {
        updates.push({ type: "phone_number", data: { newPhone } });
      }
      if ((passportNumber && passportNumber !== (editingPassenger.documentNumber || editingPassenger.passportNumber || "")) ||
          (passportExpiry && passportExpiry !== (editingPassenger.documentExpiry || editingPassenger.passportExpiry || ""))) {
        updates.push({ type: "travel_document", data: { newDocumentNumber: passportNumber, newExpiryDate: passportExpiry } });
      }
      if ((firstName && firstName !== (editingPassenger.firstName || "")) ||
          (lastName && lastName !== (editingPassenger.lastName || ""))) {
        updates.push({ type: "address", data: { firstName, lastName, newPhone: newPhone || editingPassenger.phone || "" } });
      }

      for (const u of updates) {
        const resp = await fetch(`${BASE_URI}/api/booking/update-info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pnr,
            passengerId,
            updateType: u.type,
            updateData: u.data,
            bookingId: bookingContext?.bookingId,
            lastName: bookingContext?.lastName,
          }),
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `Failed to update ${u.type}`);
        }
      }

      setTrips((prev) => prev.map((t) => {
        if ((t.id || t.srNo) === passengerId) {
          return {
            ...t,
            email: newEmail || t.email,
            phone: newPhone || t.phone,
            firstName: firstName || t.firstName,
            lastName: lastName || t.lastName,
            documentNumber: passportNumber || t.documentNumber,
            documentExpiry: passportExpiry || t.documentExpiry,
            fullName: `${firstName || t.firstName || ""} ${lastName || t.lastName || ""}`.trim(),
          };
        }
        return t;
      }));

      setIsEditModalOpen(false);
      setEditingPassenger(null);
      setMessage("Information updated successfully.");
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update information");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const ctxStr = typeof window !== 'undefined' ? sessionStorage.getItem("manageBookingContext") : null;
        if (!ctxStr) return;
        const ctx = JSON.parse(ctxStr);
        setBookingContext(ctx);

        let itinerary = ctx.itinerary;
        if (!itinerary && ctx.bookingId) {
          const res = await fetch(`${BASE_URI}/api/tp/getItinerary?PNR=${encodeURIComponent(ctx.bookingId)}`);
          if (res.ok) {
            itinerary = await res.json();
          }
        }
        if (!itinerary) return;
        let itineraryDetails = itinerary.ItineraryDetails;
        if (typeof itineraryDetails === 'string') {
          try { itineraryDetails = JSON.parse(itineraryDetails); } catch {}
        }
        const reservationData = itineraryDetails?.ReservationResponse?.Reservation;
        const travelers = reservationData?.Traveler || [];
        const products = reservationData?.Offer?.[0]?.Product || [];
        const flightSegments = products.map(p => p.FlightSegment?.[0]?.Flight).filter(Boolean);

        const pnrValue = itinerary.PNR || ctx.bookingId;
        const bookingRow = [{
          id: pnrValue,
          bookingRef: pnrValue,
          dateIssue: reservationData?.Receipt?.[0]?.Confirmation?.Locator?.creationDate || new Date().toISOString().split('T')[0],
          flightNumber: flightSegments.map(seg => `${seg.carrier || 'XX'}${seg.number || '000'}`).join(', '),
          tripType: itinerary.TripType?.replace('TripType:', '').trim() || 'Unknown',
        }];
        setBookings(bookingRow);

        const processedPassengers = travelers.map((traveler, index) => {
          const personName = traveler.PersonName || {};
          const telephone = traveler.Telephone?.[0];
          const email = traveler.Email?.[0];
          const travelDoc = traveler.TravelDocument?.[0];
          const firstFlight = flightSegments[0];
          const lastFlight = flightSegments[flightSegments.length - 1];
          const firstName = personName.Given || "";
          const lastName = personName.Surname || "";
          return {
            id: traveler.id || `traveler_${index + 1}`,
            srNo: index + 1,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`.trim(),
            email: email?.value || "",
            phone: telephone ? `${telephone.countryAccessCode || ""}${telephone.phoneNumber || ""}`.trim() : "",
            airlineBookingRef: pnrValue,
            flyingFrom: firstFlight?.Departure?.location || "N/A",
            deptTime: firstFlight ? `${firstFlight.Departure.date}T${firstFlight.Departure.time}` : "",
            flyingTo: lastFlight?.Arrival?.location || "N/A",
            arrivalTime: lastFlight ? `${lastFlight.Arrival.date}T${lastFlight.Arrival.time}` : "",
            baggage: reservationData?.Offer?.[0]?.TermsAndConditionsFull?.[0]?.BaggageAllowance?.[0]?.Text?.[0] || "Standard",
            class: products[0]?.PassengerFlight?.[0]?.FlightProduct?.[0]?.cabin || "Economy",
            documentNumber: travelDoc?.number || "",
            documentExpiry: travelDoc?.expiryDate || "",
            address: {},
            status: "",
          };
        });
        setTrips(processedPassengers);
      } catch (e) {
        console.error("Failed to load booking context:", e);
      }
    };
    load();
  }, []);

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
        <aside className="w-full lg:w-64 lg:min-h-screen order-2 lg:order-1">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 order-1 lg:order-2">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-[#FF6B35] mb-4 lg:mb-6 tracking-wide uppercase">
              {activeMenuItem}
            </h1>

            {/* Booking History Card */}
            <Card className="mb-4 lg:mb-6 border border-gray-200 shadow-md w-full max-w-full mx-auto rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200 py-3 px-4 flex justify-center">
                <CardTitle className="text-lg sm:text-xl lg:text-[20px] font-bold text-[#2E4A6B] tracking-wide relative inline-block">
                  <span className="relative inline-block">
                    Booking History
                    <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto bg-white">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B]">
                    <thead className="bg-[#002b5c] text-white text-[15px] font-medium uppercase">
                      <tr>
                        <th className="text-left py-3 px-5 border-b border-gray-200">
                          Cherry Flight Booking #
                        </th>
                        <th className="text-left py-3 px-5 border-b border-gray-200">
                          Date (Issue)
                        </th>
                        <th className="text-left py-3 px-5 border-b border-gray-200">
                          Customer Name
                        </th>
                        <th className="text-left py-3 px-5 border-b border-gray-200">
                          Trip Type
                        </th>
                        <th className="text-center py-3 px-5 border-b border-gray-200 w-16"></th>
                      </tr>
                    </thead>

                    <tbody className="text-[15px] font-normal">
                      {bookings.map(
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
                              <td className="py-3 px-5">
                                {booking.bookingRef}
                              </td>
                              <td className="py-3 px-5">
                                {booking.dateIssue}
                              </td>
                              <td className="py-3 px-5">
                                {booking.flightNumber}
                              </td>
                              <td className="py-3 px-5">
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
                                      <h3 className="text-[18px] font-semibold text-[#002b5c] mb-4 text-center">
                                        Selected Plan
                                      </h3>
                                    </div>

                                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                                      <table className="w-full border border-gray-200 text-[#2E4A6B]">
                                        <thead className="bg-[#002b5c] text-white text-[14px] font-medium uppercase">
                                          <tr>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Sr No.
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Passenger Name
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Airline Booking
                                              Reference
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Flying From
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Dept. Time
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Flying To
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Arrival Time
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Baggage
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Class
                                            </th>
                                            <th className="text-left py-3 px-4 border-b border-gray-200">
                                              Actions
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="text-[14px] font-normal">
                                          {trips.map(
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
                                                <td className="py-3 px-4">
                                                  {trip.srNo}
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.passengerName
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.airlineBookingRef
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.flyingFrom
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.deptTime
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.flyingTo
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {
                                                    trip.arrivalTime
                                                  }
                                                </td>
                                                <td className="py-3 px-4">
                                                  {trip.baggage}
                                                </td>
                                                <td className="py-3 px-4">
                                                  {trip.class}
                                                </td>
                                                <td className="py-3 px-4">
                                                  <Button
                                                    size="sm"
                                                    onClick={() =>
                                                      handleEditInfo(
                                                        trip,
                                                      )
                                                    }
                                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-3 py-1.5"
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
                                        <div className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto px-4">
                                          <Button
                                            onClick={() => handleResendTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md"
                                          >
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">Resend Ticket Email</span>
                                          </Button>

                                          <Button
                                            onClick={() => handleViewTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md"
                                          >
                                            <Eye className="w-4 h-4" />
                                            <span className="text-sm">View Ticket</span>
                                          </Button>

                                          <Button
                                            onClick={() => handlePrintTicket(booking.id)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md"
                                          >
                                            <Printer className="w-4 h-4" />
                                            <span className="text-sm">Print</span>
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="text-center text-sm text-gray-600 w-full sm:w-auto">
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
            <div className="mt-6 flex justify-center">
              <div className="flex flex-row items-center justify-center gap-3 w-full max-w-md px-4">
                <Button
                  onClick={() => handleResendTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 py-2 rounded-md"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Resend Ticket Email</span>
                </Button>

                <Button
                  onClick={() => handleViewTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 py-2 rounded-md"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Ticket</span>
                </Button>

                <Button
                  onClick={() => handlePrintTicket(selectedPlanRow)}
                  disabled={!selectedPlanRow}
                  className="flex items-center gap-2 px-3 py-2 rounded-md"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm">Print</span>
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
        <DialogContent className="max-w-[1100px] w-[95vw] sm:w-[90vw] h-[90vh] sm:h-[95vh] bg-gradient-to-br from-white to-gray-50 border-none rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-[#002b5c] to-[#003d7a] px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-[24px] font-bold text-white mb-1">
                  Edit Passenger Information
                </DialogTitle>
                <p className="text-blue-200 text-[14px]">
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
              <div className="p-8">
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
                      <h3 className="text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#FF6B35]" />
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
                      <h3 className="text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#FF6B35]" />
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
                      <h3 className="text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FF6B35]" />
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
                      <h3 className="text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#FF6B35]" />
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
          <div className="border-t border-gray-200 bg-white px-8 py-5 flex justify-end gap-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="px-8 py-3 bg-gradient-to-r from-[#002b5c] to-[#003d7a] hover:from-[#001d42] hover:to-[#002b5c] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium h-12"
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
