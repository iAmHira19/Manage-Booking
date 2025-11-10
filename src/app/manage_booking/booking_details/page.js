"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TermsSidebar from "@/components/TermsSidebar";
import { Upload, Mail, Phone, FileText, MapPin, Eye, Send, CheckCircle, AlertCircle, X } from "lucide-react";

export default function BookingDetailsPage() {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState("Change your Plan");
  const [logoUrl, setLogoUrl] = useState("/img/logo.png");
  const fileInputRef = useRef(null);
  const detailsRef = useRef(null);
  // State for enhanced functionality
  const [bookingContext, setBookingContext] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(null);
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
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketUrl, setTicketUrl] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [pnrInput, setPnrInput] = useState("");
  const [priceStructure, setPriceStructure] = useState(null);
  const [updatableItems, setUpdatableItems] = useState([]);
  const [workbenchId, setWorkbenchId] = useState('');
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
  const fetchItineraryData = async (pnr) => {
    setDataLoading(true);
    setMessage({ type: "", text: "" });
    try {
      // Fetch itinerary data
      const itineraryResponse = await fetch(`${BASE_URI}/api/tp/getItinerary?pnr=${encodeURIComponent(pnr)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (itineraryResponse.status === 404) {
        setMessage({ type: "error", text: `PNR ${pnr} not found. Please verify and try again.` });
        setDataLoading(false);
        return;
      }
      if (!itineraryResponse.ok) {
        throw new Error(`Failed to fetch itinerary data: ${itineraryResponse.statusText}`);
      }
      const apiData = await itineraryResponse.json();
      console.log("Processing API response:", apiData);
      // Parse ItineraryDetails if it's a string
      let itineraryDetails = apiData.ItineraryDetails;
      if (typeof itineraryDetails === 'string') {
        try {
          itineraryDetails = JSON.parse(itineraryDetails);
        } catch (e) {
          console.error("Error parsing ItineraryDetails:", e);
          throw new Error("Invalid ItineraryDetails format");
        }
      }
      // Fetch updatable items from API
      const updatableResponse = await fetch(`${BASE_URI}/api/tp/getUpdatableItems?pnr=${encodeURIComponent(pnr)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!updatableResponse.ok) {
        throw new Error(`Failed to fetch updatable items: ${updatableResponse.statusText}`);
      }
      const updatableList = await updatableResponse.json();
      setUpdatableItems(updatableList || []);
      const workbenchIdTemp = updatableList[0]?.Key || '';
      setWorkbenchId(workbenchIdTemp);
      localStorage.setItem('workbenchId', workbenchIdTemp);
      localStorage.setItem('updatableItems', JSON.stringify(updatableList));
      localStorage.setItem('pnr', pnr);
      console.log('PNR:', pnr);
      console.log('Workbench ID:', workbenchIdTemp);
      console.log('Updatable Items:', updatableList);
      // Extract key data
      const pnrValue = apiData.PNR || pnr;
      const reservationData = itineraryDetails?.ReservationResponse?.Reservation;
      const travelers = reservationData?.Traveler || [];
      const priceStructure = apiData.priceStructure || {};
      const products = reservationData?.Offer?.[0]?.Product || [];
      const flightSegments = products
        .map(product => product.FlightSegment?.[0]?.Flight)
        .filter(Boolean);
      console.log("Extracted data:", {
        pnr: pnrValue,
        travelers: travelers.length,
        flightSegments: flightSegments.length,
        priceStructure
      });
      // Process passenger data
      const processedPassengers = travelers.map((traveler, index) => {
        const personName = traveler.PersonName || {};
        const telephone = traveler.Telephone?.[0];
        const email = traveler.Email?.[0];
        const travelDoc = traveler.TravelDocument?.[0];
        const firstFlight = flightSegments[0];
        const lastFlight = flightSegments[flightSegments.length - 1];
        const firstName = personName.Given || "Passenger";
        const lastName = personName.Surname || String(index + 1);
        const phoneNumber = telephone ? `${telephone.countryAccessCode || ""}${telephone.phoneNumber || ""}`.trim() : "";
        const departureTime = firstFlight ? `${firstFlight.Departure.date}T${firstFlight.Departure.time}` : "";
        const arrivalTime = lastFlight ? `${lastFlight.Arrival.date}T${lastFlight.Arrival.time}` : "";
        
        return {
          id: traveler.id || `traveler_${index + 1}`,
          firstName: firstName,
          lastName: lastName,
          fullName: `${firstName} ${lastName}`.trim(),
          email: email?.value || "",
          phone: phoneNumber,
          airlineBookingRef: pnrValue,
          origin: firstFlight?.Departure?.location || "N/A",
          destination: lastFlight?.Arrival?.location || "N/A",
          departureTime: departureTime,
          arrivalTime: arrivalTime,
          baggage: reservationData?.Offer?.[0]?.TermsAndConditionsFull?.[0]?.BaggageAllowance?.[0]?.Text?.[0] || "Standard",
          class: products[0]?.PassengerFlight?.[0]?.FlightProduct?.[0]?.cabin || "Economy",
          documentType: travelDoc ? "passport" : "",
          documentNumber: travelDoc?.number || "",
          documentExpiry: travelDoc?.expiryDate || "",
          address: {},
          updatable: new Set(
            updatableList
              .filter(item => item.ValueList.some(v => v.Key === traveler.id))
              .map(item => item.Value1)
          ),
        };
      });
      console.log("Processed passengers:", processedPassengers);
      // Process booking data
      const flightNumber = flightSegments
        .map(segment => `${segment.carrier || 'XX'}${segment.number || '000'}`)
        .join(", ");
      const issueDate = reservationData?.Receipt?.[0]?.Confirmation?.Locator?.creationDate || new Date().toISOString().split('T')[0];
      const tripType = apiData.TripType?.replace("TripType:", "").trim() || "Unknown";
      
      const processedBooking = {
        bookingReference: pnrValue,
        issueDate: issueDate,
        flightNumber: flightNumber,
        tripType: tripType,
        refundable: false,
        totalPrice: priceStructure.totalPrice || "0",
        currency: priceStructure.currency || "PKR",
        adultPrice: priceStructure.adultPrice || "0",
        adultTax: priceStructure.adultTax || "0",
      };
      console.log("Processed booking:", processedBooking);
      // Set state
      setPassengerData(processedPassengers);
      setBookingData(processedBooking);
      setPriceStructure(priceStructure);
      setItineraryData(apiData);
      const successMessage = `Booking data loaded successfully! Found ${processedPassengers.length} passenger(s) and ${flightSegments.length} flight segment(s).`;
      setMessage({
        type: "success",
        text: successMessage
      });
    } catch (error) {
      console.error("Error processing itinerary data:", error);
      setMessage({
        type: "error",
        text: `Error processing itinerary data: ${error.message || 'Please try again.'}`
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
    try {
      const pnr = bookingContext?.bookingId || itineraryData?.pnr || bookingData?.bookingReference;
      if (!pnr) {
        setMessage({ type: "error", text: "PNR not found" });
        return;
      }
      let base64 = pdfData;
      if (!base64) {
        const resp = await fetch(`${BASE_URI}/api/tp/getTicketDocument?pnr=${encodeURIComponent(pnr)}`);
        if (!resp.ok) {
          const t = await resp.text();
          setMessage({ type: "error", text: t || "Unable to fetch ticket PDF" });
          return;
        }
        base64 = await resp.text();
        setPdfData(base64);
      }
      const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setTicketUrl(url);
      setTicketModalOpen(true);
    } catch (error) {
      console.error("Error opening ticket:", error);
      setMessage({ type: "error", text: "Error opening ticket PDF" });
    }
  };
  const handlePrint = () => {
    try {
      const node = detailsRef.current;
      if (!node) return window.print();
      const printWindow = window.open("", "_blank");
      if (!printWindow) return window.print();
      printWindow.document.write('<html><head><title>Print</title><link rel="stylesheet" href="/styles/globals.css" /></head><body>' + node.innerHTML + '</body></html>');
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 200);
    } catch (e) {
      window.print();
    }
  };
  // Handle edit info dropdown
  const handleEditInfo = (type, passenger = null) => {
    if (!passenger.updatable.has(mapTypeToUpdatable(type))) {
      return; // Do not open if not updatable
    }
    setEditType(type);
    setCurrentPassenger(passenger);
    setFormErrors({});
    const existingData = {};
    if (passenger) {
      switch (type) {
        case "Email":
          existingData.newEmail = ""; // Always start with empty email
          break;
        case "Phone Number":
          existingData.newPhone = ""; // Always start with empty phone
          break;
        case "Travel Document":
          existingData.newDocumentNumber = passenger.documentNumber || "";
          existingData.newExpiryDate = passenger.documentExpiry || "";
          existingData.documentType = passenger.documentType || "passport";
          break;
        case "Address":
          existingData.addressLine1 = passenger.address?.line1 || "";
          existingData.addressLine2 = passenger.address?.line2 || "";
          existingData.street = passenger.address?.street || "";
          existingData.city = passenger.address?.city || "";
          existingData.country = passenger.address?.country || "Pakistan";
          existingData.postalCode = passenger.address?.postalCode || "";
          break;
      }
    }
    setEditData(existingData);
    setEditModalOpen(true);
    setShowEditPopup(null);
  };
  const mapTypeToUpdatable = (type) => {
    switch (type) {
      case "Email":
        return "TravelerUpdatableItemEmail";
      case "Phone Number":
        return "TravelerUpdatableItemTelephone";
      case "Address":
        return "TravelerUpdatableItemPersonName";
      case "Travel Document":
        return "TravelerUpdatableItemTravelDocument";
      default:
        return "";
    }
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
        if (!editData.newPhone || !/^\+?[0-9]{11}$/.test(editData.newPhone)) {
          errors.newPhone = "Please enter a valid 11-digit phone number";
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
          today.setHours(0, 0, 0, 0);
          if (expiry <= today) {
            errors.newExpiryDate = "Document must not be expired";
          }
        }
        break;
      case "Address":
        if (!editData.addressLine1 || editData.addressLine1.trim().length < 5) {
          errors.addressLine1 = "Address line 1 is required and must be at least 5 characters";
        }
        if (!editData.street || editData.street.trim().length < 3) {
          errors.street = "Street name is required and must be at least 3 characters";
        }
        if (!editData.city) {
          errors.city = "City is required";
        }
        if (!editData.country) {
          errors.country = "Country is required";
        }
        if (!editData.postalCode || !/^\d{5}$/.test(editData.postalCode)) {
          errors.postalCode = "Postal code must be 5 digits";
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
          updateData.email = editData.newEmail;
          break;
        case "Phone Number":
          updateData.phone = editData.newPhone;
          break;
        case "Travel Document":
          updateData.documentNumber = editData.newDocumentNumber;
          updateData.documentExpiry = editData.newExpiryDate;
          updateData.documentType = editData.documentType;
          break;
        case "Address":
          updateData.address = {
            line1: editData.addressLine1,
            line2: editData.addressLine2 || "",
            street: editData.street,
            city: editData.city,
            country: editData.country,
            postalCode: editData.postalCode
          };
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
                  updatedPassenger.documentType = editData.documentType;
                  break;
                case "Address":
                  updatedPassenger.address = {
                    line1: editData.addressLine1,
                    line2: editData.addressLine2 || "",
                    street: editData.street,
                    city: editData.city,
                    country: editData.country,
                    postalCode: editData.postalCode
                  };
                  break;
              }
              return updatedPassenger;
            }
            return passenger;
          });
          setPassengerData(updatedPassengers);
        }
        // Refetch itinerary to keep in sync with backend
        try {
          if (pnr) {
            await fetchItineraryData(pnr);
          }
        } catch (e) {
          console.warn("Failed to refresh itinerary after update:", e);
        }
        // Close modal
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
    <div className="relative">
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
        <div className="flex-1 flex flex-col items-center" ref={detailsRef}>
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
                              <td className="py-2 px-3 relative">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentPassenger(passenger);
                                    setShowEditPopup(showEditPopup === passenger.id ? null : passenger.id);
                                  }}
                                  className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-4 py-2 text-sm font-medium"
                                >
                                  Edit Info
                                </Button>
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
                  {/* Edit Popup - Moved outside the table */}
                  {showEditPopup && currentPassenger && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold text-gray-900">Edit Passenger Information</h3>
                          <button
                            onClick={() => setShowEditPopup(null)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInfo("Email", currentPassenger);
                              setShowEditPopup(null);
                            }}
                            disabled={!currentPassenger.updatable.has("TravelerUpdatableItemEmail")}
                            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition-colors h-full ${!currentPassenger.updatable.has("TravelerUpdatableItemEmail") ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
                          >
                            <div className="p-3 bg-blue-50 rounded-full mb-2">
                              <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">Email</span>
                            <span className="text-xs text-gray-500 mt-1 text-center">Update email address</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInfo("Phone Number", currentPassenger);
                              setShowEditPopup(null);
                            }}
                            disabled={!currentPassenger.updatable.has("TravelerUpdatableItemTelephone")}
                            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition-colors h-full ${!currentPassenger.updatable.has("TravelerUpdatableItemTelephone") ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
                          >
                            <div className="p-3 bg-green-50 rounded-full mb-2">
                              <Phone className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">Phone</span>
                            <span className="text-xs text-gray-500 mt-1 text-center">Update phone number</span>
                          </button>
                          <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed h-full">
                            <div className="p-3 bg-purple-50 rounded-full mb-2">
                              <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-900">Document</span>
                            <span className="text-xs text-gray-500 mt-1 text-center">Coming soon</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInfo("Address", currentPassenger);
                              setShowEditPopup(null);
                            }}
                            disabled={!currentPassenger.updatable.has("TravelerUpdatableItemAddress")}
                            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition-colors h-full ${!currentPassenger.updatable.has("TravelerUpdatableItemAddress") ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
                          >
                            <div className="p-3 bg-amber-50 rounded-full mb-2">
                              <MapPin className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="font-medium text-gray-900">Address</span>
                            <span className="text-xs text-gray-500 mt-1 text-center">Update address details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
      </div>
      
      {typeof window !== 'undefined' && editModalOpen && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[800px] mx-4 max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] px-5 py-3 rounded-t-2xl">
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
                    {currentPassenger?.email || ""}
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
                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E55A2B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
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
                    {currentPassenger?.phone || ""}
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
                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E55A2B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
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
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Address Information</h4>
                      <p className="text-sm text-gray-600">Please provide complete and accurate address details</p>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]"></div>
                    <span className="ml-2 text-gray-600">Saving changes...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={editData.addressLine1 || ''}
                        onChange={(e) => setEditData({...editData, addressLine1: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-md ${formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="House/Flat number, Building"
                      />
                      {formErrors.addressLine1 && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.addressLine1}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">House/Flat number, Building</p>
                    </div>
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalOpen(false);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E55A2B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35] disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      {/* Ticket Modal */}
      {ticketModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100000] p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Ticket</h3>
              <button
                onClick={() => {
                  setTicketModalOpen(false);
                  if (ticketUrl) {
                    URL.revokeObjectURL(ticketUrl);
                    setTicketUrl("");
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <div className="flex-1 bg-gray-50">
              {ticketUrl ? (
                <iframe title="Ticket PDF" src={ticketUrl} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">Loading ticket...</div>
              )}
            </div>
            <div className="px-4 py-3 border-t flex justify-end gap-3">
              <Button
                onClick={() => {
                  const iframe = document.querySelector('iframe[title="Ticket PDF"]');
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                  }
                }}
                className="bg-[#28a745] hover:bg-[#218838] text-white"
              >
                Print Ticket
              </Button>
              <Button
                onClick={() => {
                  setTicketModalOpen(false);
                  if (ticketUrl) {
                    URL.revokeObjectURL(ticketUrl);
                    setTicketUrl("");
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Close
              </Button>
            </div>
          <div className="flex-1 bg-gray-50">
            {ticketUrl ? (
              <iframe title="Ticket PDF" src={ticketUrl} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">Loading ticket...</div>
            )}
          </div>
          <div className="px-4 py-3 border-t flex justify-end gap-3">
            <Button
              onClick={() => {
                const iframe = document.querySelector('iframe[title="Ticket PDF"]');
                if (iframe && iframe.contentWindow) {
                  iframe.contentWindow.focus();
                  iframe.contentWindow.print();
                }
              }}
              className="bg-[#28a745] hover:bg-[#218838] text-white"
            >
              Print Ticket
            </Button>
            <Button
              onClick={() => {
                setTicketModalOpen(false);
                if (ticketUrl) {
                  URL.revokeObjectURL(ticketUrl);
                  setTicketUrl("");
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </div>
  );
}