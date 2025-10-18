"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import TermsSidebar from "@/components/TermsSidebar";
import { Upload, ChevronDown, Mail, Phone, FileText, MapPin, Eye, Send, CheckCircle, AlertCircle, X } from "lucide-react";

export default function BookingDetailsPage() {
  const router = useRouter();
  const [activeMenuItem, setActiveMenuItem] = useState("Change your Plan");
  const [logoUrl, setLogoUrl] = useState("/img/logo.png");
  const fileInputRef = useRef(null);

  // State for enhanced functionality
  const [bookingContext, setBookingContext] = useState(null);
  const [showEditDropdown, setShowEditDropdown] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formErrors, setFormErrors] = useState({});
  const [currentPassenger, setCurrentPassenger] = useState(null);
  // Modal and editing state that mirror /manage-booking/page.js behavior
  const [isEditModalOpenBD, setIsEditModalOpenBD] = useState(false);
  const [editingPassengerBD, setEditingPassengerBD] = useState(null);

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

  // Dummy booking data for testing
  const DUMMY_BOOKING_DATA = {
    bookingReference: "D720HM",
    issueDate: "2024-01-15",
    flightNumber: "PK301",
    tripType: "One Way",
    refundable: false,
    totalPrice: "450.00",
    currency: "USD",
    adultPrice: "400.00",
    adultTax: "50.00",
  };

  const DUMMY_PASSENGER_DATA = [
    {
      id: "passenger_1",
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1234567890",
      airlineBookingRef: "D720HM",
      origin: "JFK",
      destination: "LHR",
      departureTime: "2024-01-20T14:30:00",
      arrivalTime: "2024-01-20T22:45:00",
      baggage: "Standard",
      class: "Economy",
      documentType: "passport",
      documentNumber: "P123456789",
      documentExpiry: "2028-12-31",
      address: {}
    }
  ];

  const DUMMY_PRICE_STRUCTURE = {
    TotalPrice: "450.00",
    Base: "400.00",
    TotalTaxes: "50.00",
    CurrencyCode: { value: "USD" },
    noOfAdults: 1,
    noOfChild: 0,
    noOfInfant: 0
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEditDropdown && !event.target.closest('.edit-dropdown-container')) {
        setShowEditDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditDropdown]);

  // Open the full Edit Info modal (same behavior as /manage-booking/page.js)
  const handleOpenEditModal = (passenger) => {
    // Normalize passenger data into the editingPassenger shape used by manage-booking
    const names = (passenger?.fullName || passenger?.firstName + ' ' + passenger?.lastName || '').split(' ');
    const firstName = passenger?.firstName || names[0] || '';
    const lastName = passenger?.lastName || (names.length > 1 ? names.slice(-1)[0] : '');

    setEditingPassengerBD({
      ...passenger,
      email: passenger?.email || '',
      phone: passenger?.phone || '',
      street: passenger?.address?.street || '',
      city: passenger?.address?.city || '',
      state: passenger?.address?.state || '',
      postalCode: passenger?.address?.postalCode || '',
      country: passenger?.address?.country || '',
      firstName: firstName,
      lastName: lastName,
      passportNumber: passenger?.documentNumber || passenger?.passportNumber || '',
      passportExpiry: passenger?.documentExpiry || passenger?.passportExpiry || '',
      dateOfBirth: passenger?.dateOfBirth || '',
      nationality: passenger?.nationality || '',
    });

    setIsEditModalOpenBD(true);
  };

  const handleSaveEditBD = () => {
    // For parity with /manage-booking/page.js, simply close modal and clear editing passenger
    // (manage-booking's save didn't persist changed values in the sample implementation)
    setIsEditModalOpenBD(false);
    setEditingPassengerBD(null);
  };
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
  const handleEditInfo = (passenger = null) => {
    setCurrentPassenger({
      ...passenger,
      email: passenger?.email || "passenger@email.com",
      phone: passenger?.phone || "+92 300 1234567",
      street: "123 Main Street",
      city: "Lahore",
      state: "Punjab",
      postalCode: "54000",
      country: "Pakistan",
      firstName: passenger?.firstName || "John",
      lastName: passenger?.lastName || "Smith",
      passportNumber: passenger?.documentNumber || "P123456789",
      passportExpiry: passenger?.documentExpiry || "2028-12-31",
      dateOfBirth: "1990-01-01",
      nationality: "Pakistani",
    });
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
  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] w-full bg-[#f8f9fa] relative min-h-screen gap-x-8">

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

  {/* Mobile/Tablet compact tab navigation - visible only on small screens */}
  <div className="lg:hidden w-full px-4 py-3 bg-white">
          <div className="flex gap-2 overflow-x-auto">
            {[
              'Change your Plan',
              'Split Itinerary',
              'Add Passengers',
              'Special Note',
              'Customer Support',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenuItem(item)}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ${
                  activeMenuItem === item
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white text-[#153E7E] border border-gray-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

  {/* Main Content */}
  <div className="flex-1 flex flex-col items-center mt-4 lg:mt-0">
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
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#FF6B35] mb-4 sm:mb-6 tracking-wide uppercase text-left">
                  {activeMenuItem}
                </h1>

                {/* PNR Input and Demo Data */}
                <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                    placeholder="Enter PNR (e.g. D720HM)"
                    className="px-3 py-2 border rounded-md w-full sm:w-48 md:w-64 text-sm sm:text-base"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      onClick={async () => {
                        if (!pnrInput || pnrInput.trim().length === 0) {
                          setMessage({ type: 'error', text: 'Please enter a valid PNR' });
                          return;
                        }
                        setMessage({ type: '', text: '' });
                        await fetchItineraryData(pnrInput.trim());
                      }}
                      className="bg-[#153E7E] hover:bg-[#0F2F5A] text-white px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      Load Booking
                    </Button>
                    <Button
                      onClick={() => {
                        setMessage({ type: '', text: '' });
                        setPassengerData(DUMMY_PASSENGER_DATA);
                        setBookingData(DUMMY_BOOKING_DATA);
                        setPriceStructure(DUMMY_PRICE_STRUCTURE);
                        setDataLoading(false);
                        setMessage({
                          type: "success",
                          text: "Demo booking data loaded successfully! You can now test the layout and functionality."
                        });
                      }}
                      className="bg-[#28a745] hover:bg-[#218838] text-white px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
                    >
                      Load Demo Data
                    </Button>
                  </div>
                </div>

                {/* Personal Info Section */}
                <div className="mb-8">
                  <h2 className="text-lg sm:text-[18px] font-semibold text-[#2E4A6B] tracking-wide relative inline-block mb-3 text-center w-full">
                    <span className="relative inline-block">
                      Personal Info
                      <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                    </span>
                  </h2>

                  <div className="overflow-x-auto bg-white">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B]">
                      <thead className="bg-[#153E7E] text-white text-sm sm:text-[13px] font-medium uppercase">
                        <tr>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Cherry Flight Booking #</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Date (Issue)</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Flight Number</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Trip Type</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm sm:text-[13px] font-normal">
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
                            <td className="py-2 px-2 sm:py-2 sm:px-3">{bookingData.bookingReference}</td>
                            <td className="py-2 px-2 sm:py-2 sm:px-3">{formatDate(bookingData.issueDate)}</td>
                            <td className="py-2 px-2 sm:py-2 sm:px-3">{bookingData.flightNumber}</td>
                            <td className="py-2 px-2 sm:py-2 sm:px-3">{bookingData.tripType}</td>
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
                  <h2 className="text-lg sm:text-[18px] font-semibold text-[#2E4A6B] tracking-wide relative inline-block mb-3 text-center w-full">
                    <span className="relative inline-block">
                      Trip Details
                      <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                    </span>
                  </h2>

                  <div className="overflow-x-auto bg-white">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B]">
                      <thead className="bg-[#153E7E] text-white text-sm sm:text-[13px] font-medium uppercase">
                        <tr>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Sr No.</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Passenger Name</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Airline Booking Reference</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Flying From</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Dept. Time</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Flying To</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Arrival Time</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Baggage</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Class</th>
                          <th className="text-left py-2 px-2 sm:py-2 sm:px-3 border-b border-gray-200">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm sm:text-[13px] font-normal">
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
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{index + 1}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.fullName}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.airlineBookingRef}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.origin}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{formatTime(passenger.departureTime)}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.destination}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{formatTime(passenger.arrivalTime)}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.baggage}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">{passenger.class}</td>
                              <td className="py-2 px-2 sm:py-2 sm:px-3">
                                <div className="relative">
                                  <Button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // Open the main Edit Info modal (same as manage-booking)
                                      handleOpenEditModal(passenger);
                                    }}
                                    className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
                                  >
                                    Edit Info
                                    <ChevronDown className="w-4 h-4" />
                                  </Button>

                                  {showEditDropdown === passenger.id && (
                                    <div className="edit-dropdown-container absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999]">
                                      <div className="py-1">
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowEditDropdown(false);
                                            handleOpenEditModal(passenger);
                                          }}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 cursor-pointer"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100">
                                            <Mail className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Info</div>
                                            <div className="text-xs text-gray-500">Update passenger details</div>
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

                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button
                      onClick={handleResendTicket}
                      disabled={loading}
                      className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      {loading ? "Sending..." : "Resend Ticket Email"}
                    </Button>
                    <Button
                      onClick={handleViewTicket}
                      disabled={loading || !pdfData}
                      className={`px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-2 w-full sm:w-auto ${
                        pdfData
                          ? "bg-[#153E7E] hover:bg-[#0F2F5A] text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      {loading ? "Loading..." : pdfData ? "View Generated Ticket" : "No Ticket Available"}
                    </Button>
                    <Button className="bg-[#28a745] hover:bg-[#218838] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-md font-medium text-xs sm:text-sm w-full sm:w-auto">
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary Card */}
            <Card className="w-[92%] mx-auto rounded-md overflow-hidden border border-gray-200 shadow-sm mt-6">
              <CardContent className="px-6 py-6">
                <h2 className="text-lg sm:text-[18px] font-semibold text-[#2E4A6B] tracking-wide mb-4">Price Summary</h2>
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

      {/* Beautiful Edit Info Modal */}
      <Dialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      >
  <DialogContent className="max-w-[640px] w-[92vw] sm:w-[640px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col mx-auto my-auto max-h-[72vh]">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-[24px] font-bold text-white mb-1">
                  Edit Passenger Information
                </DialogTitle>
                <p className="text-blue-200 text-[14px]">
                  {currentPassenger?.firstName} {currentPassenger?.lastName}
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white hover:bg-white/10 transition-colors rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {currentPassenger && (
            <div className="overflow-y-auto flex-1">
              <div className="p-6 sm:p-8">
                {/* Beautiful Tabs */}
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1 rounded-xl mb-6 sm:mb-8">
                    <TabsTrigger
                      value="email"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                    <TabsTrigger
                      value="document"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Document
                    </TabsTrigger>
                    <TabsTrigger
                      value="address"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2"
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
                      <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#FF6B35]" />
                        Email Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[#153E7E] font-medium">
                            Current Email Address
                          </Label>
                          <div className="relative">
                            <Input
                              value={currentPassenger.email}
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
                            className="text-[#153E7E] font-medium"
                          >
                            New Email Address
                          </Label>
                          <Input
                            id="newEmail"
                            type="email"
                            placeholder="Enter new email address"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmEmail"
                            className="text-[#153E7E] font-medium"
                          >
                            Confirm New Email Address
                          </Label>
                          <Input
                            id="confirmEmail"
                            type="email"
                            placeholder="Re-enter new email address"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
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
                      <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-[#FF6B35]" />
                        Phone Number Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[#153E7E] font-medium">
                            Current Phone Number
                          </Label>
                          <div className="relative">
                            <Input
                              value={currentPassenger.phone}
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
                            className="text-[#153E7E] font-medium"
                          >
                            New Phone Number
                          </Label>
                          <Input
                            id="newPhone"
                            type="tel"
                            placeholder="Enter new phone number"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPhone"
                            className="text-[#153E7E] font-medium"
                          >
                            Confirm New Phone Number
                          </Label>
                          <Input
                            id="confirmPhone"
                            type="tel"
                            placeholder="Re-enter new phone number"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
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
                      <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FF6B35]" />
                        Travel Document Information
                      </h3>

                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-[#153E7E] font-medium"
                            >
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              defaultValue={
                                currentPassenger.firstName
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-[#153E7E] font-medium"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              defaultValue={
                                currentPassenger.lastName
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="middleName"
                            className="text-[#153E7E] font-medium"
                          >
                            Middle Name{" "}
                            <span className="text-gray-400">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            id="middleName"
                            placeholder="Enter middle name"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="dateOfBirth"
                              className="text-[#153E7E] font-medium"
                            >
                              Date of Birth
                            </Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              defaultValue={
                                currentPassenger.dateOfBirth
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="nationality"
                              className="text-[#153E7E] font-medium"
                            >
                              Nationality
                            </Label>
                            <Input
                              id="nationality"
                              defaultValue={
                                currentPassenger.nationality
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="passportNumber"
                              className="text-[#153E7E] font-medium"
                            >
                              Passport Number
                            </Label>
                            <Input
                              id="passportNumber"
                              defaultValue={
                                currentPassenger.passportNumber
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="passportExpiry"
                              className="text-[#153E7E] font-medium"
                            >
                              Passport Expiry Date
                            </Label>
                            <Input
                              id="passportExpiry"
                              type="date"
                              defaultValue={
                                currentPassenger.passportExpiry
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="issuingCountry"
                            className="text-[#153E7E] font-medium"
                          >
                            Passport Issuing Country
                          </Label>
                          <Select defaultValue="Pakistan">
                            <SelectTrigger className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12">
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
                      <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#FF6B35]" />
                        Address Information
                      </h3>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="street"
                            className="text-[#153E7E] font-medium"
                          >
                            Street Address
                          </Label>
                          <Input
                            id="street"
                            defaultValue={
                              currentPassenger.street
                            }
                            placeholder="Enter street address"
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="apartment"
                            className="text-[#153E7E] font-medium"
                          >
                            Apartment, Suite, etc.{" "}
                            <span className="text-gray-400">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            id="apartment"
                            placeholder="Apt, Suite, Unit, Building, Floor, etc."
                            className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="city"
                              className="text-[#153E7E] font-medium"
                            >
                              City
                            </Label>
                            <Input
                              id="city"
                              defaultValue={
                                currentPassenger.city
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="state"
                              className="text-[#153E7E] font-medium"
                            >
                              State / Province
                            </Label>
                            <Input
                              id="state"
                              defaultValue={
                                currentPassenger.state
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label
                              htmlFor="postalCode"
                              className="text-[#153E7E] font-medium"
                            >
                              Postal Code / ZIP Code
                            </Label>
                            <Input
                              id="postalCode"
                              defaultValue={
                                currentPassenger.postalCode
                              }
                              className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="country"
                              className="text-[#153E7E] font-medium"
                            >
                              Country
                            </Label>
                            <Select
                              defaultValue={
                                currentPassenger.country
                              }
                            >
                              <SelectTrigger className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12">
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
              onClick={() => setEditModalOpen(false)}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="px-8 py-3 bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] hover:from-[#0F2F5A] hover:to-[#153E7E] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium h-12"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        {/* Full Edit Info Modal (same as /manage-booking) */}
        <Dialog
          open={isEditModalOpenBD}
          onOpenChange={setIsEditModalOpenBD}
        >
  <DialogContent className="max-w-[640px] w-[92vw] sm:w-[640px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col mx-auto my-auto max-h-[72vh]">
            <div className="bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] px-8 py-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-[24px] font-bold text-white mb-1">
                    Edit Passenger Information
                  </DialogTitle>
                  <p className="text-blue-200 text-[14px]">
                    {editingPassengerBD?.firstName} {editingPassengerBD?.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpenBD(false)}
                  className="text-white hover:bg-white/10 transition-colors rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {editingPassengerBD && (
              <div className="overflow-y-auto flex-1">
                <div className="p-6 sm:p-8">
                  <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 p-1 rounded-xl mb-6 sm:mb-8">
                      <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </TabsTrigger>
                      <TabsTrigger value="document" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Document
                      </TabsTrigger>
                      <TabsTrigger value="address" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#153E7E] data-[state=active]:shadow-md transition-all flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-6 mt-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-[#FF6B35]" />
                          Email Information
                        </h3>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-[#153E7E] font-medium">Current Email Address</Label>
                            <div className="relative">
                              <Input value={editingPassengerBD.email} disabled className="bg-blue-50/50 border-blue-200 text-gray-700 cursor-not-allowed rounded-lg h-12 pl-4" />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Current</div>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                          <div className="space-y-2">
                            <Label htmlFor="newEmail" className="text-[#153E7E] font-medium">New Email Address</Label>
                            <Input id="newEmail" type="email" placeholder="Enter new email address" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmEmail" className="text-[#153E7E] font-medium">Confirm New Email Address</Label>
                            <Input id="confirmEmail" type="email" placeholder="Re-enter new email address" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-6 mt-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-[#FF6B35]" />
                          Phone Number Information
                        </h3>

                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label className="text-[#153E7E] font-medium">Current Phone Number</Label>
                            <div className="relative">
                              <Input value={editingPassengerBD.phone} disabled className="bg-blue-50/50 border-blue-200 text-gray-700 cursor-not-allowed rounded-lg h-12 pl-4" />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Current</div>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                          <div className="space-y-2">
                            <Label htmlFor="newPhone" className="text-[#153E7E] font-medium">New Phone Number</Label>
                            <Input id="newPhone" type="tel" placeholder="Enter new phone number" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPhone" className="text-[#153E7E] font-medium">Confirm New Phone Number</Label>
                            <Input id="confirmPhone" type="tel" placeholder="Re-enter new phone number" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="document" className="space-y-6 mt-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-[#FF6B35]" /> Travel Document Information</h3>
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-[#153E7E] font-medium">First Name</Label>
                              <Input id="firstName" defaultValue={editingPassengerBD.firstName} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-[#153E7E] font-medium">Last Name</Label>
                              <Input id="lastName" defaultValue={editingPassengerBD.lastName} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="middleName" className="text-[#153E7E] font-medium">Middle Name <span className="text-gray-400">(Optional)</span></Label>
                            <Input id="middleName" placeholder="Enter middle name" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="dateOfBirth" className="text-[#153E7E] font-medium">Date of Birth</Label>
                              <Input id="dateOfBirth" type="date" defaultValue={editingPassengerBD.dateOfBirth} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="nationality" className="text-[#153E7E] font-medium">Nationality</Label>
                              <Input id="nationality" defaultValue={editingPassengerBD.nationality} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="passportNumber" className="text-[#153E7E] font-medium">Passport Number</Label>
                              <Input id="passportNumber" defaultValue={editingPassengerBD.passportNumber} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="passportExpiry" className="text-[#153E7E] font-medium">Passport Expiry Date</Label>
                              <Input id="passportExpiry" type="date" defaultValue={editingPassengerBD.passportExpiry} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="issuingCountry" className="text-[#153E7E] font-medium">Passport Issuing Country</Label>
                            <Select defaultValue="Pakistan">
                              <SelectTrigger className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pakistan">Pakistan</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="UAE">United Arab Emirates</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="USA">United States</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="address" className="space-y-6 mt-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-[18px] font-semibold text-[#153E7E] mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#FF6B35]" /> Address Information</h3>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="street" className="text-[#153E7E] font-medium">Street Address</Label>
                            <Input id="street" defaultValue={editingPassengerBD.street} placeholder="Enter street address" className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apartment" className="text-[#153E7E] font-medium">Apartment, Suite, etc. <span className="text-gray-400">(Optional)</span></Label>
                            <Input id="apartment" placeholder="Apt, Suite, Unit, Building, Floor, etc." className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-[#153E7E] font-medium">City</Label>
                              <Input id="city" defaultValue={editingPassengerBD.city} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state" className="text-[#153E7E] font-medium">State / Province</Label>
                              <Input id="state" defaultValue={editingPassengerBD.state} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <Label htmlFor="postalCode" className="text-[#153E7E] font-medium">Postal Code / ZIP Code</Label>
                              <Input id="postalCode" defaultValue={editingPassengerBD.postalCode} className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="country" className="text-[#153E7E] font-medium">Country</Label>
                              <Select defaultValue={editingPassengerBD.country}>
                                <SelectTrigger className="border-gray-300 focus:border-[#153E7E] focus:ring-2 focus:ring-[#153E7E]/20 rounded-lg h-12">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="USA">United States</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
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

            <div className="border-t border-gray-200 bg-white px-8 py-5 flex justify-end gap-4 flex-shrink-0">
              <Button variant="outline" onClick={() => setIsEditModalOpenBD(false)} className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all h-12">Cancel</Button>
              <Button onClick={handleSaveEditBD} className="px-8 py-3 bg-gradient-to-r from-[#153E7E] to-[#2E4A6B] hover:from-[#0F2F5A] hover:to-[#153E7E] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium h-12">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
