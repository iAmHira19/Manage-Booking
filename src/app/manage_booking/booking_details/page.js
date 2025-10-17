"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TermsSidebar from "@/components/TermsSidebar";
import { Upload, ChevronDown, Mail, Phone, FileText, MapPin, Eye, Send, CheckCircle, AlertCircle, X } from "lucide-react";

export default function BookingDetailsPage() {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState("Change your Plan");
  const [logoUrl, setLogoUrl] = useState("/img/logo.png");
  const fileInputRef = useRef(null);

  // State for enhanced functionality
  const [bookingContext, setBookingContext] = useState(null);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formErrors, setFormErrors] = useState({});
  const [currentPassenger, setCurrentPassenger] = useState(null);

  // API data states
  const [itineraryData, setItineraryData] = useState(null);
  const [passengerData, setPassengerData] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [pnrInput, setPnrInput] = useState("");
  const [priceStructure, setPriceStructure] = useState(null);

  // Base URI for API calls
  const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:8081";

  // Load booking context from session storage
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const context = sessionStorage.getItem("manageBookingContext");
        if (context) {
          const parsedContext = JSON.parse(context);
          console.log("Loaded booking context:", parsedContext);
          setBookingContext(parsedContext);
          setPnrInput(parsedContext.bookingId || '');
          await fetchItineraryData(parsedContext.bookingId);
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          const pnr = urlParams.get('PNR');
          if (pnr) {
            console.log("Using PNR from URL params:", pnr);
            await fetchItineraryData(pnr);
          } else {
            console.log("No booking reference found");
            setMessage({ type: "info", text: "Enter a valid PNR to load booking details." });
            setDataLoading(false);
          }
        }
      } catch (e) {
        console.error("Error loading booking context:", e);
        setMessage({ type: "error", text: "Error loading booking context. Please enter PNR to try again." });
        setDataLoading(false);
      }
    };

    loadBookingData();
  }, []);

  // Fetch itinerary data from API using the specific endpoint
  const fetchItineraryData = async (pnr) => {
    setDataLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use the specific API endpoint provided
      const itineraryEndpoint = `${BASE_URI}/api/tp/getItinerary?PNR=${encodeURIComponent(pnr)}`;

      console.log("Fetching itinerary data from:", itineraryEndpoint);

      const response = await fetch(itineraryEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const apiData = await response.json();
        console.log("Complete API response:", apiData);
        console.log("API response type:", typeof apiData);
        console.log("API response keys:", apiData ? Object.keys(apiData) : 'null');

        // Handle different possible response structures
        let reservationData = null;
        let travelers = [];
        let flightSegments = [];
        let priceStructure = null;
        let pnrValue = pnr;

        // Check if the response has the expected Travelport structure
        if (apiData?.ReservationResponse?.Reservation) {
          // This is the Travelport structure
          reservationData = apiData.ReservationResponse.Reservation;
          pnrValue = reservationData?.Receipt?.[0]?.Confirmation?.Locator?.value || pnr;
          travelers = reservationData?.Traveler || [];
          priceStructure = reservationData?.Offer?.[0]?.Price;

          // Extract flight segments from all products
          const products = reservationData?.Offer?.[0]?.Product || [];
          flightSegments = products.map(product => product.FlightSegment?.[0]?.Flight).filter(Boolean);

          console.log("Travelport structure detected");
          console.log("Found travelers:", travelers.length);
          console.log("Found flight segments:", flightSegments.length);
        } else if (apiData?.PNR || apiData?.ItineraryDetails) {
          // This might be a different structure
          pnrValue = apiData.PNR || pnr;
          travelers = apiData?.ItineraryDetails?.passengers || [];
          flightSegments = apiData?.ItineraryDetails?.flights || [];
          priceStructure = apiData?.priceStructure;

          console.log("Alternative structure detected");
        } else if (Array.isArray(apiData)) {
          // Handle array response
          console.log("Array response detected");
          // If it's an array, take the first item
          const firstItem = apiData[0];
          if (firstItem) {
            travelers = firstItem.passengers || [];
            flightSegments = firstItem.flights || [];
            priceStructure = firstItem.priceStructure;
            pnrValue = firstItem.PNR || pnr;
          }
        } else {
          // Try to extract any available data
          console.log("Unknown structure, trying to extract any available data");
          travelers = [];
          flightSegments = [];
          priceStructure = apiData?.priceStructure;
          pnrValue = apiData?.PNR || pnr;
        }

        // If we still don't have travelers but have price structure, create default passengers
        if (travelers.length === 0 && priceStructure) {
          const adultCount = priceStructure.noOfAdults || 1;
          const childCount = priceStructure.noOfChild || 0;
          const infantCount = priceStructure.noOfInfant || 0;

          console.log("Creating passengers from price structure:", { adultCount, childCount, infantCount });

          // Create adult passengers
          for (let i = 0; i < adultCount; i++) {
            travelers.push({
              id: `adult_${i + 1}`,
              PersonName: { Given: "Adult", Surname: `Passenger ${i + 1}` },
              Email: [{ value: "" }],
              Telephone: [{ countryAccessCode: "", phoneNumber: "" }],
              TravelDocument: [{ number: "", expiryDate: "" }]
            });
          }

          // Create child passengers
          for (let i = 0; i < childCount; i++) {
            travelers.push({
              id: `child_${i + 1}`,
              PersonName: { Given: "Child", Surname: `Passenger ${adultCount + i + 1}` },
              Email: [{ value: "" }],
              Telephone: [{ countryAccessCode: "", phoneNumber: "" }],
              TravelDocument: [{ number: "", expiryDate: "" }]
            });
          }
        }

        // Process passenger data
        const processedPassengers = travelers.map((traveler, index) => {
          const personName = traveler.PersonName || {};
          const telephone = traveler.Telephone?.[0];
          const email = traveler.Email?.[0];
          const travelDoc = traveler.TravelDocument?.[0];

          // Extract flight information from segments
          const firstFlight = flightSegments[0];
          const lastFlight = flightSegments[flightSegments.length - 1];

          return {
            id: traveler.id || index + 1,
            firstName: personName.Given || "Passenger",
            lastName: personName.Surname || `${index + 1}`,
            fullName: `${personName.Given || "Passenger"} ${personName.Surname || `${index + 1}`}`.trim(),
            email: email?.value || "",
            phone: telephone ? `${telephone.countryAccessCode || ""}${telephone.phoneNumber || ""}`.trim() : "",
            airlineBookingRef: pnrValue,
            origin: firstFlight?.Departure?.location || "N/A",
            destination: lastFlight?.Arrival?.location || "N/A",
            departureTime: firstFlight ? `${firstFlight.Departure.date}T${firstFlight.Departure.time}` : "",
            arrivalTime: lastFlight ? `${lastFlight.Arrival.date}T${lastFlight.Arrival.time}` : "",
            baggage: "Standard",
            class: firstFlight?.FlightProduct?.[0]?.cabin || "Economy",
            documentType: "passport",
            documentNumber: travelDoc?.number || "",
            documentExpiry: travelDoc?.expiryDate || "",
            address: {}
          };
        });

        console.log("Final processed passengers:", processedPassengers);
        setPassengerData(processedPassengers);

        // Process booking data
        const processedBooking = {
          bookingReference: pnrValue,
          issueDate: new Date().toISOString().split('T')[0],
          flightNumber: flightSegments?.map(segment => `${segment.carrier || 'XX'}${segment.number || '000'}`).join(", ") || "Flight Details",
          tripType: flightSegments?.length > 1 ? "Round Trip" : "One Way",
          refundable: false,
          totalPrice: priceStructure?.TotalPrice || priceStructure?.totalPrice,
          currency: priceStructure?.CurrencyCode?.value || priceStructure?.currency,
          adultPrice: priceStructure?.Base || priceStructure?.adultPrice,
          adultTax: priceStructure?.TotalTaxes || priceStructure?.adultTax,
        };

        console.log("Final processed booking:", processedBooking);
        setBookingData(processedBooking);

        // Set other data
        if (apiData?.TicketDocument) {
          setPdfData(apiData.TicketDocument);
        }

        if (priceStructure) {
          setPriceStructure(priceStructure);
        }

        setMessage({
          type: "success",
          text: `Booking data loaded successfully! Found ${processedPassengers.length} passenger(s) and ${flightSegments?.length || 0} flight segment(s).`
        });
      } else {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        setMessage({
          type: "error",
          text: `Unable to load booking for PNR ${pnr}. ${errorText || 'Please check if the PNR is correct.'}`
        });
      }
    } catch (error) {
      console.error("Error fetching itinerary data:", error);
      setMessage({
        type: "error",
        text: `Error fetching itinerary data: ${error?.message || 'Network error. Please try again.'}`
      });
    } finally {
      setDataLoading(false);
    }
  };

  // Handle resend ticket email using the correct API endpoint
  const handleResendTicket = async () => {
    if (!bookingContext && !itineraryData) {
      setMessage({ type: "error", text: "Booking context not found" });
      return;
    }

    setLoading(true);
    try {
      const pnr = bookingContext?.bookingId || itineraryData?.pnr || bookingData?.bookingReference;
      if (!pnr) {
        setMessage({ type: "error", text: "PNR not found" });
        setLoading(false);
        return;
      }

      const resendEndpoint = `${BASE_URI}/api/tp/resendTicketDocument`;
      console.log("Resending ticket to:", resendEndpoint, "PNR:", pnr);

      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pnr),
      });

      const text = (await response.text()).trim();

      if (response.ok) {
        if (text.includes("Email sent successfully")) {
          setMessage({ type: "success", text: "Email sent successfully!" });
        } else {
          setMessage({ type: "success", text });
        }
      } else {
        if (text.includes("Unable to find")) {
          setMessage({ type: "error", text: `Unable to find ${pnr}. Please try again later!` });
        } else {
          setMessage({ type: "error", text: text || "Failed to send ticket email." });
        }
      }
    } catch (error) {
      console.error("Error sending ticket email:", error);
      setMessage({ type: "error", text: "Error sending ticket email. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle view generated ticket
  const handleViewTicket = async () => {
    if (!pdfData) {
      setMessage({ type: "error", text: "No ticket PDF available" });
      return;
    }

    try {
      const pdfBlob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], {
        type: 'application/pdf'
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const ticketWindow = window.open(pdfUrl, '_blank');

      if (!ticketWindow) {
        setMessage({ type: "error", text: "Please allow popups to view the ticket" });
        return;
      }

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);

    } catch (error) {
      console.error("Error opening PDF:", error);
      setMessage({ type: "error", text: "Error opening ticket PDF" });
    }
  };

  // Handle edit info dropdown
  const handleEditInfo = (type, passenger = null) => {
    setEditType(type);
    setCurrentPassenger(passenger);
    setFormErrors({});

    const existingData = {};
    if (passenger) {
      switch (type) {
        case "Email":
          existingData.newEmail = "";
          break;
        case "Phone Number":
          existingData.newPhone = "";
          break;
        case "Travel Document":
          existingData.newDocumentNumber = "";
          existingData.newExpiryDate = "";
          break;
        case "Address":
          existingData.firstName = passenger.firstName || "";
          existingData.lastName = passenger.lastName || "";
          existingData.newPhone = "";
          existingData.newPassportNumber = "";
          existingData.newPassportExpiry = "";
          break;
      }
    }

    setEditData(existingData);
    setEditModalOpen(true);
    setShowEditDropdown(false);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!bookingContext && !currentPassenger) {
      setMessage({ type: "error", text: "Booking context or passenger data not found" });
      return;
    }

    let errors = {};

    switch (editType) {
      case "Email":
        if (!editData.newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.newEmail)) {
          errors.newEmail = "Please enter a valid email address";
        }
        break;

      case "Phone Number":
        if (!editData.newPhone || !/^[\+]?[1-9][\d]{0,15}$/.test(editData.newPhone.replace(/[\s\-\(\)]/g, ''))) {
          errors.newPhone = "Please enter a valid phone number";
        }
        break;

      case "Travel Document":
        if (!editData.newDocumentNumber || editData.newDocumentNumber.length < 3) {
          errors.newDocumentNumber = "Document number is required and must be at least 3 characters";
        }
        if (!editData.newExpiryDate) {
          errors.newExpiryDate = "Expiry date is required";
        } else {
          const expiry = new Date(editData.newExpiryDate);
          const today = new Date();
          if (expiry <= today) {
            errors.newExpiryDate = "Document must not be expired";
          }
        }
        break;

      case "Address":
        if (!editData.firstName || editData.firstName.trim().length < 2) {
          errors.firstName = "First name is required and must be at least 2 characters";
        }
        if (!editData.lastName || editData.lastName.trim().length < 2) {
          errors.lastName = "Last name is required and must be at least 2 characters";
        }
        if (!editData.newPhone || !/^[\+]?[1-9][\d]{0,15}$/.test(editData.newPhone.replace(/[\s\-\(\)]/g, ''))) {
          errors.newPhone = "Please enter a valid phone number";
        }
        if (!editData.newPassportNumber || editData.newPassportNumber.length < 3) {
          errors.newPassportNumber = "Passport number is required and must be at least 3 characters";
        }
        if (!editData.newPassportExpiry) {
          errors.newPassportExpiry = "Passport expiry date is required";
        } else {
          const expiry = new Date(editData.newPassportExpiry);
          const today = new Date();
          if (expiry <= today) {
            errors.newPassportExpiry = "Passport must not be expired";
          }
        }
        break;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      const pnr = bookingContext?.bookingId || bookingData?.bookingReference;
      const passengerId = currentPassenger?.id;

      const updateData = {};
      switch (editType) {
        case "Email":
          updateData.newEmail = editData.newEmail;
          break;
        case "Phone Number":
          updateData.newPhone = editData.newPhone;
          break;
        case "Travel Document":
          updateData.newDocumentNumber = editData.newDocumentNumber;
          updateData.newExpiryDate = editData.newExpiryDate;
          break;
        case "Address":
          updateData.firstName = editData.firstName;
          updateData.lastName = editData.lastName;
          updateData.newPhone = editData.newPhone;
          updateData.newPassportNumber = editData.newPassportNumber;
          updateData.newPassportExpiry = editData.newPassportExpiry;
          break;
      }

      const response = await fetch(`${BASE_URI}/api/booking/update-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pnr: pnr,
          passengerId: passengerId,
          updateType: editType.toLowerCase().replace(/\s+/g, '_'),
          updateData: updateData,
          bookingId: bookingContext?.bookingId,
          lastName: bookingContext?.lastName
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: `${editType} updated successfully! ${result.message || ''}`
        });

        // Update local passenger data
        if (currentPassenger && passengerData.length > 0) {
          const updatedPassengers = passengerData.map(passenger => {
            if (passenger.id === currentPassenger.id) {
              const updatedPassenger = { ...passenger };
              switch (editType) {
                case "Email":
                  updatedPassenger.email = editData.newEmail;
                  break;
                case "Phone Number":
                  updatedPassenger.phone = editData.newPhone;
                  break;
                case "Travel Document":
                  updatedPassenger.documentNumber = editData.newDocumentNumber;
                  updatedPassenger.documentExpiry = editData.newExpiryDate;
                  break;
                case "Address":
                  updatedPassenger.firstName = editData.firstName;
                  updatedPassenger.lastName = editData.lastName;
                  updatedPassenger.phone = editData.newPhone;
                  updatedPassenger.documentNumber = editData.newPassportNumber;
                  updatedPassenger.documentExpiry = editData.newPassportExpiry;
                  break;
              }
              return updatedPassenger;
            }
            return passenger;
          });
          setPassengerData(updatedPassengers);
        }

        setEditModalOpen(false);
      } else {
        const errorText = await response.text();
        setMessage({ type: "error", text: `Failed to update ${editType}: ${errorText}` });
      }
    } catch (error) {
      console.error("Error updating information:", error);
      setMessage({ type: "error", text: `Error updating ${editType}: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      return timeString;
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Show loading screen while fetching data
  if (dataLoading && !itineraryData) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex w-full justify-center items-center bg-[#f8f9fa] min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-[#2E4A6B] mb-2">Loading Booking Details</h2>
            <p className="text-gray-600">Please wait while we fetch your booking information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between bg-[#f8f9fa] relative min-h-screen gap-x-8">

        {/* Sidebar */}
        <TermsSidebar
          active={activeMenuItem}
          onClick={(item) => setActiveMenuItem(item)}
          items={[
            "Change your Plan",
            "Split Itinerary",
            "Add Passengers",
            "Special Note",
            "Customer Support",
          ]}
          className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col py-4"
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">
          <div className="max-w-6xl w-full px-6 py-10">

            {/* Message Display */}
            {message.text && (
              <div className={`mb-4 p-4 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
                <button
                  onClick={() => setMessage({ type: "", text: "" })}
                  className="float-right text-lg font-bold hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            )}

            <Card className="w-[92%] mx-auto rounded-md overflow-hidden border border-gray-200 shadow-sm">
              <CardContent className="px-6 py-6">
                <h1 className="text-[28px] font-bold text-[#FF6B35] mb-6 tracking-wide uppercase text-left">
                  {activeMenuItem}
                </h1>

                {/* PNR Input */}
                <div className="mb-6 flex items-center gap-3">
                  <input
                    type="text"
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                    placeholder="Enter PNR (e.g. D720HM)"
                    className="px-3 py-2 border rounded-md w-64"
                  />
                  <Button
                    onClick={async () => {
                      if (!pnrInput || pnrInput.trim().length === 0) {
                        setMessage({ type: 'error', text: 'Please enter a valid PNR' });
                        return;
                      }
                      setMessage({ type: '', text: '' });
                      await fetchItineraryData(pnrInput.trim());
                    }}
                    className="bg-[#153E7E] hover:bg-[#0F2F5A] text-white px-4 py-2"
                  >
                    Load Booking
                  </Button>
                </div>

                {/* Personal Info Section */}
                <div className="mb-8">
                  <h2 className="text-[18px] font-semibold text-[#2E4A6B] tracking-wide relative inline-block mb-3 text-center w-full">
                    <span className="relative inline-block">
                      Personal Info
                      <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                    </span>
                  </h2>

                  <div className="overflow-x-auto bg-white">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B] text-[13px]">
                      <thead className="bg-[#153E7E] text-white text-[13px] font-medium uppercase">
                        <tr>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Cherry Flight Booking #</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Date (Issue)</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Flight Number</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Trip Type</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px] font-normal">
                        {dataLoading ? (
                          <tr className="bg-white border-b border-gray-100">
                            <td colSpan="4" className="py-4 px-3 text-center">
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6B35]"></div>
                                <span className="ml-2">Loading booking information...</span>
                              </div>
                            </td>
                          </tr>
                        ) : bookingData ? (
                          <tr className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-2 px-3">{bookingData.bookingReference}</td>
                            <td className="py-2 px-3">{formatDate(bookingData.issueDate)}</td>
                            <td className="py-2 px-3">{bookingData.flightNumber}</td>
                            <td className="py-2 px-3">{bookingData.tripType}</td>
                          </tr>
                        ) : (
                          <tr className="bg-white border-b border-gray-100">
                            <td colSpan="4" className="py-4 px-3 text-center text-gray-500">
                              No booking information available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trip Details Section */}
                <div>
                  <h2 className="text-[18px] font-semibold text-[#2E4A6B] tracking-wide relative inline-block mb-3 text-center w-full">
                    <span className="relative inline-block">
                      Trip Details
                      <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                    </span>
                  </h2>

                  <div className="overflow-x-auto bg-white">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B] text-[13px]">
                      <thead className="bg-[#153E7E] text-white text-[13px] font-medium uppercase">
                        <tr>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Sr No.</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Passenger Name</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Airline Booking Reference</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Flying From</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Dept. Time</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Flying To</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Arrival Time</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Baggage</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Class</th>
                          <th className="text-left py-2 px-3 border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px] font-normal">
                        {dataLoading ? (
                          <tr className="bg-white border-b border-gray-100">
                            <td colSpan="10" className="py-4 px-3 text-center">
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6B35]"></div>
                                <span className="ml-2">Loading passenger information...</span>
                              </div>
                            </td>
                          </tr>
                        ) : passengerData.length > 0 ? (
                          passengerData.map((passenger, index) => (
                            <tr
                              key={passenger.id || index}
                              className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                                index % 2 === 0 ? "bg-white" : "bg-[#F9FBFF]"
                              }`}
                            >
                              <td className="py-2 px-3">{index + 1}</td>
                              <td className="py-2 px-3">{passenger.fullName}</td>
                              <td className="py-2 px-3">{passenger.airlineBookingRef}</td>
                              <td className="py-2 px-3">{passenger.origin}</td>
                              <td className="py-2 px-3">{formatTime(passenger.departureTime)}</td>
                              <td className="py-2 px-3">{passenger.destination}</td>
                              <td className="py-2 px-3">{formatTime(passenger.arrivalTime)}</td>
                              <td className="py-2 px-3">{passenger.baggage}</td>
                              <td className="py-2 px-3">{passenger.class}</td>
                              <td className="py-2 px-3">
                                <div className="relative">
                                  <Button
                                    onClick={() => setShowEditDropdown(showEditDropdown === passenger.id ? false : passenger.id)}
                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
                                  >
                                    Edit Info
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>

                                  {showEditDropdown === passenger.id && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999]">
                                      <div className="py-1">
                                        <button
                                          onClick={() => handleEditInfo("Email", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100">
                                            <Mail className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Email</div>
                                            <div className="text-xs text-gray-500">Update email address</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Phone Number", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100">
                                            <Phone className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Phone Number</div>
                                            <div className="text-xs text-gray-500">Update phone number</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Travel Document", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Travel Document</div>
                                            <div className="text-xs text-gray-500">Update passport/ID details</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Address", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100">
                                            <MapPin className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Address</div>
                                            <div className="text-xs text-gray-500">Update address information</div>
                                          </div>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="bg-white border-b border-gray-100">
                            <td colSpan="10" className="py-4 px-3 text-center text-gray-500">
                              No passenger information available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={handleResendTicket}
                      disabled={loading}
                      className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-8 py-3 rounded-md font-medium text-sm flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Sending..." : "Resend Ticket Email"}
                    </Button>
                    <Button
                      onClick={handleViewTicket}
                      disabled={loading || !pdfData}
                      className={`px-8 py-3 rounded-md font-medium text-sm flex items-center gap-2 ${
                        pdfData
                          ? "bg-[#153E7E] hover:bg-[#0F2F5A] text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      {loading ? "Loading..." : pdfData ? "View Generated Ticket" : "No Ticket Available"}
                    </Button>
                    <Button className="bg-[#28a745] hover:bg-[#218838] text-white px-8 py-3 rounded-md font-medium text-sm">
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary Card */}
            <Card className="w-[92%] mx-auto rounded-md overflow-hidden border border-gray-200 shadow-sm mt-6">
              <CardContent className="px-6 py-6">
                <h2 className="text-[18px] font-semibold text-[#2E4A6B] tracking-wide mb-4">Price Summary</h2>
                {dataLoading ? (
                  <div className="text-sm text-gray-600">Loading price details...</div>
                ) : priceStructure ? (
                  <div className="text-sm text-[#2E4A6B]">
                    <p><strong>Total:</strong> {priceStructure.CurrencyCode?.value} {priceStructure.TotalPrice}</p>
                    <p><strong>Base:</strong> {priceStructure.CurrencyCode?.value} {priceStructure.Base}</p>
                    <p><strong>Taxes:</strong> {priceStructure.CurrencyCode?.value} {priceStructure.TotalTaxes}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No price information available for this booking.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    editType === "Email" ? "bg-orange-500" :
                    editType === "Phone Number" ? "bg-blue-500" :
                    editType === "Travel Document" ? "bg-green-500" : "bg-purple-500"
                  }`}>
                    {editType === "Email" && <Mail className="w-5 h-5" />}
                    {editType === "Phone Number" && <Phone className="w-5 h-5" />}
                    {editType === "Travel Document" && <FileText className="w-5 h-5" />}
                    {editType === "Address" && <MapPin className="w-5 h-5" />}
                  </div>
                  Edit {editType}
                </h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {currentPassenger && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Passenger:</strong> {currentPassenger.firstName} {currentPassenger.lastName}
                </p>
              </div>
            )}

            {editType === "Email" && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Current Email</span>
                  </div>
                  <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                    {currentPassenger?.email || "No email on record"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editData.newEmail || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, newEmail: e.target.value });
                      if (formErrors.newEmail) {
                        setFormErrors({ ...formErrors, newEmail: "" });
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                      formErrors.newEmail ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                    }`}
                    placeholder="Enter new email address"
                  />
                  {formErrors.newEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.newEmail}
                    </p>
                  )}
                </div>
              </div>
            )}

            {editType === "Phone Number" && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Current Phone Number</span>
                  </div>
                  <p className="text-gray-900 bg-white px-3 py-2 rounded border">
                    {currentPassenger?.phone || "No phone number on record"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={editData.newPhone || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, newPhone: e.target.value });
                      if (formErrors.newPhone) {
                        setFormErrors({ ...formErrors, newPhone: "" });
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                      formErrors.newPhone ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Enter new phone number (e.g., +1234567890)"
                  />
                  {formErrors.newPhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.newPhone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Include country code for international numbers
                  </p>
                </div>
              </div>
            )}

            {editType === "Travel Document" && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Current Travel Document</span>
                  </div>
                  <div className="bg-white rounded border p-3 space-y-2">
                    <p><span className="font-medium">Type:</span> {currentPassenger?.documentType || "Not specified"}</p>
                    <p><span className="font-medium">Number:</span> {currentPassenger?.documentNumber || "Not specified"}</p>
                    <p><span className="font-medium">Expiry:</span> {currentPassenger?.documentExpiry ? formatDate(currentPassenger.documentExpiry) : "Not specified"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Document Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.newDocumentNumber || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, newDocumentNumber: e.target.value });
                        if (formErrors.newDocumentNumber) {
                          setFormErrors({ ...formErrors, newDocumentNumber: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                        formErrors.newDocumentNumber ? 'border-red-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                      placeholder="Enter new document number"
                    />
                    {formErrors.newDocumentNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.newDocumentNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editData.newExpiryDate || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, newExpiryDate: e.target.value });
                        if (formErrors.newExpiryDate) {
                          setFormErrors({ ...formErrors, newExpiryDate: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ${
                        formErrors.newExpiryDate ? 'border-red-500' : 'border-gray-300 hover:border-green-400'
                      }`}
                    />
                    {formErrors.newExpiryDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.newExpiryDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {editType === "Address" && (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Current Address Information</span>
                  </div>
                  <div className="bg-white rounded border p-3 space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {currentPassenger?.firstName} {currentPassenger?.lastName}</p>
                    <p><span className="font-medium">Phone:</span> {currentPassenger?.phone || "Not specified"}</p>
                    <p><span className="font-medium">Document:</span> {currentPassenger?.documentNumber || "Not specified"}</p>
                    <p><span className="font-medium">Document Expiry:</span> {currentPassenger?.documentExpiry ? formatDate(currentPassenger.documentExpiry) : "Not specified"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.firstName || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, firstName: e.target.value });
                        if (formErrors.firstName) {
                          setFormErrors({ ...formErrors, firstName: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      placeholder="Enter first name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.lastName || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, lastName: e.target.value });
                        if (formErrors.lastName) {
                          setFormErrors({ ...formErrors, lastName: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      placeholder="Enter last name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editData.newPhone || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, newPhone: e.target.value });
                        if (formErrors.newPhone) {
                          setFormErrors({ ...formErrors, newPhone: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        formErrors.newPhone ? 'border-red-500' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {formErrors.newPhone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.newPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passport Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.newPassportNumber || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, newPassportNumber: e.target.value });
                        if (formErrors.newPassportNumber) {
                          setFormErrors({ ...formErrors, newPassportNumber: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        formErrors.newPassportNumber ? 'border-red-500' : 'border-gray-300 hover:border-purple-400'
                      }`}
                      placeholder="Enter passport number"
                    />
                    {formErrors.newPassportNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.newPassportNumber}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Passport Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editData.newPassportExpiry || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, newPassportExpiry: e.target.value });
                        if (formErrors.newPassportExpiry) {
                          setFormErrors({ ...formErrors, newPassportExpiry: "" });
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 ${
                        formErrors.newPassportExpiry ? 'border-red-500' : 'border-gray-300 hover:border-purple-400'
                      }`}
                    />
                    {formErrors.newPassportExpiry && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.newPassportExpiry}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveEdit}
                disabled={loading}
                className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-2 rounded-md font-medium text-sm flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setEditModalOpen(false);
                  setFormErrors({});
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium text-sm flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
