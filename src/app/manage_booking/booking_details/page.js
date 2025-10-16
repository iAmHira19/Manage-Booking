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
  
  // New state for enhanced functionality
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
  const [lastAttemptedEndpoints, setLastAttemptedEndpoints] = useState([]);
  const [lastApiError, setLastApiError] = useState("");
  const [priceStructure, setPriceStructure] = useState(null);
  
  // Prefer explicit env, fallback to common local dev port
  const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || "http://localhost:8081";
  const ALT_BASE_URI = "http://localhost:8086";

  const parsePathList = (envValue, pnr, isPost = false) => {
    if (envValue && typeof envValue === 'string') {
      const rawPaths = envValue.split(',').map(p => p.trim()).filter(Boolean);
      return rawPaths.map(p => {
        const hasQuery = p.includes('?');
        const url = `${BASE_URI}${p.startsWith('/') ? '' : '/'}${p}${hasQuery ? '' : `?PNR=${encodeURIComponent(pnr)}`}`;
        return url;
      });
    }
    return null;
  };

  // API endpoint discovery function
  const discoverApiEndpoint = async (endpoints, method = "GET", body = null) => {
    let lastError = null;
    const attempted = [];

    for (const endpoint of endpoints) {
      attempted.push(endpoint);
      try {
        console.log(`Trying ${method} endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Success with endpoint: ${endpoint}`, data);
          return { success: true, data, endpoint };
        } else {
          const errorText = await response.text();
          console.log(`Endpoint ${endpoint} failed:`, errorText);
          lastError = errorText || `HTTP ${response.status}`;
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} error:`, err.message);
        lastError = err.message;
      }
    }

    return { success: false, error: lastError, attempted };
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogoUrl(imageUrl);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  // Load booking context from session storage and fetch itinerary data
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const context = sessionStorage.getItem("manageBookingContext");
        if (context) {
          const parsedContext = JSON.parse(context);
          console.log("Loaded booking context:", parsedContext);
          setBookingContext(parsedContext);
          // Prefill PNR input and fetch itinerary data using PNR
          setPnrInput(parsedContext.bookingId || '');
          await fetchItineraryData(parsedContext.bookingId);
        } else {
          // Try to get PNR from URL params as fallback
          const urlParams = new URLSearchParams(window.location.search);
          const pnr = urlParams.get('PNR');
          if (pnr) {
            console.log("Using PNR from URL params:", pnr);
            await fetchItineraryData(pnr);
          } else {
            // No PNR provided: stop loading and prompt user to enter PNR
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

  // Dynamic passenger data from API
  const getPassengerData = (pnr, lastName) => {
    // This will be populated from API response
    return [];
  };

  // NOTE: Removed sample data helper. Booking details must come from API via PNR.

  // Fetch itinerary data from API using the specific endpoint
  const fetchItineraryData = async (pnr) => {
    setDataLoading(true);
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
        console.log("Itinerary data received:", apiData);

        // Handle the actual API response structure from Postman
        const normalized = {
          pnr: apiData?.PNR,
          itinerary: apiData?.ItineraryDetails || apiData, // Fallback to entire response if no ItineraryDetails
          ticketDocument: apiData?.TicketDocument,
          priceStructure: apiData?.priceStructure,
        };

        // Set base datasets
        setItineraryData(normalized.itinerary);

        // Extract passenger data from the actual API response
        // Since the API response doesn't have a separate ItineraryDetails with passengers,
        // we'll create passenger data from the available information
        const passengers = [];

        // If we have priceStructure with passenger counts, create passenger entries
        if (normalized.priceStructure) {
          const priceStruct = normalized.priceStructure;
          const adultCount = parseInt(priceStruct.noOfAdults) || 0;
          const childCount = parseInt(priceStruct.noOfChild) || 0;
          const infantCount = parseInt(priceStruct.noOfInfant) || 0;

          // Create adult passengers
          for (let i = 0; i < adultCount; i++) {
            passengers.push({
              id: i + 1,
              firstName: `Adult`,
              lastName: `Passenger ${i + 1}`,
              fullName: `Adult Passenger ${i + 1}`,
              email: "",
              phone: "",
              airlineBookingRef: normalized.pnr,
              origin: "N/A",
              destination: "N/A",
              departureTime: "",
              arrivalTime: "",
              baggage: "Standard",
              class: "Economy",
              documentType: "passport",
              documentNumber: "",
              documentExpiry: "",
              address: {}
            });
          }

          // Create child passengers
          for (let i = 0; i < childCount; i++) {
            passengers.push({
              id: adultCount + i + 1,
              firstName: `Child`,
              lastName: `Passenger ${adultCount + i + 1}`,
              fullName: `Child Passenger ${adultCount + i + 1}`,
              email: "",
              phone: "",
              airlineBookingRef: normalized.pnr,
              origin: "N/A",
              destination: "N/A",
              departureTime: "",
              arrivalTime: "",
              baggage: "Standard",
              class: "Economy",
              documentType: "passport",
              documentNumber: "",
              documentExpiry: "",
              address: {}
            });
          }

          // Create infant passengers
          for (let i = 0; i < infantCount; i++) {
            passengers.push({
              id: adultCount + childCount + i + 1,
              firstName: `Infant`,
              lastName: `Passenger ${adultCount + childCount + i + 1}`,
              fullName: `Infant Passenger ${adultCount + childCount + i + 1}`,
              email: "",
              phone: "",
              airlineBookingRef: normalized.pnr,
              origin: "N/A",
              destination: "N/A",
              departureTime: "",
              arrivalTime: "",
              baggage: "Standard",
              class: "Economy",
              documentType: "passport",
              documentNumber: "",
              documentExpiry: "",
              address: {}
            });
          }
        }

        // If no passengers created from priceStructure, create at least one default passenger
        if (passengers.length === 0) {
          passengers.push({
            id: 1,
            firstName: "Main",
            lastName: "Passenger",
            fullName: "Main Passenger",
            email: "",
            phone: "",
            airlineBookingRef: normalized.pnr,
            origin: "N/A",
            destination: "N/A",
            departureTime: "",
            arrivalTime: "",
            baggage: "Standard",
            class: "Economy",
            documentType: "passport",
            documentNumber: "",
            documentExpiry: "",
            address: {}
          });
        }

        console.log("Processed passengers data:", passengers);
        setPassengerData(passengers);

        // Set booking data with enhanced information from priceStructure
        const booking = {
          bookingReference: normalized.pnr,
          issueDate: new Date().toISOString().split('T')[0],
          flightNumber: "Flight Details",
          tripType: "Round Trip",
          refundable: false,
          totalPrice: normalized.priceStructure?.totalPrice,
          currency: normalized.priceStructure?.currency,
          adultPrice: normalized.priceStructure?.adultPrice,
          adultTax: normalized.priceStructure?.adultTax,
          noOfAdults: normalized.priceStructure?.noOfAdults,
          noOfChild: normalized.priceStructure?.noOfChild,
          noOfInfant: normalized.priceStructure?.noOfInfant,
        };

        console.log("Processed booking data:", booking);
        setBookingData(booking);

        if (normalized.ticketDocument) {
          setPdfData(normalized.ticketDocument);
        }

        if (normalized.priceStructure) {
          setPriceStructure(normalized.priceStructure);
        }

        setMessage({ type: "success", text: `Booking data loaded successfully! Found ${passengers.length} passenger(s).` });
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);

        setMessage({
          type: "error",
          text: `Unable to load booking for PNR ${pnr}. Error: ${errorText || 'Unknown error'}`
        });

        // Clear any previous data so UI reflects absence of valid booking
        setItineraryData(null);
        setPassengerData([]);
        setBookingData(null);
      }
    } catch (error) {
      console.error("Error fetching itinerary data:", error);
      setMessage({ type: "error", text: `Error fetching itinerary data: ${error?.message || error}` });
      setItineraryData(null);
      setPassengerData([]);
      setBookingData(null);
    } finally {
      setDataLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEditDropdown && !event.target.closest('.relative')) {
        setShowEditDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditDropdown]);

  // Handle resend ticket email using the correct API endpoint
  const handleResendTicket = async () => {
    if (!bookingContext && !itineraryData) {
      setMessage({ type: "error", text: "Booking context not found" });
      return;
    }

    setLoading(true);
    try {
      const pnr = bookingContext?.bookingId || itineraryData?.pnr || itineraryData?.PNR;
      if (!pnr) {
        setMessage({ type: "error", text: "PNR not found" });
        setLoading(false);
        return;
      }

      // Use the correct API endpoint as specified
      const resendEndpoint = `${BASE_URI}/api/tp/resendTicketDocument`;
      console.log("Resending ticket to:", resendEndpoint, "PNR:", pnr);

      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pnr), // Send PNR as JSON string as per API spec
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
      // Decode Base64 PDF and open in new window
      const pdfBlob = new Blob([Uint8Array.from(atob(pdfData), c => c.charCodeAt(0))], {
        type: 'application/pdf'
      });
      
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const ticketWindow = window.open(pdfUrl, '_blank');
      
      if (!ticketWindow) {
        setMessage({ type: "error", text: "Please allow popups to view the ticket" });
        return;
      }
      
      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
      
    } catch (error) {
      console.error("Error opening PDF:", error);
      setMessage({ type: "error", text: "Error opening ticket PDF" });
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateDocument = (documentType, documentNumber, expiryDate) => {
    const errors = {};
    
    if (!documentType) {
      errors.documentType = "Document type is required";
    }
    
    if (!documentNumber || documentNumber.length < 3) {
      errors.documentNumber = "Document number is required and must be at least 3 characters";
    }
    
    if (!expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else {
      const expiry = new Date(expiryDate);
      const today = new Date();
      if (expiry <= today) {
        errors.expiryDate = "Document must not be expired";
      }
    }
    
    return errors;
  };

  const validateAddress = (street, city, country, postalCode) => {
    const errors = {};
    
    if (!street || street.trim().length < 5) {
      errors.street = "Street address is required and must be at least 5 characters";
    }
    
    if (!city || city.trim().length < 2) {
      errors.city = "City is required and must be at least 2 characters";
    }
    
    if (!country || country.trim().length < 2) {
      errors.country = "Country is required and must be at least 2 characters";
    }
    
    if (!postalCode || postalCode.trim().length < 3) {
      errors.postalCode = "Postal code is required and must be at least 3 characters";
    }
    
    return errors;
  };

  // Handle edit info dropdown
  const handleEditInfo = (type, passenger = null) => {
    setEditType(type);
    setCurrentPassenger(passenger);
    setFormErrors({});

    // Pre-populate with existing data if available
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

    // Validate form data based on edit type
    let errors = {};

    switch (editType) {
      case "Email":
        if (!editData.newEmail || !validateEmail(editData.newEmail)) {
          errors.newEmail = "Please enter a valid email address";
        }
        break;

      case "Phone Number":
        if (!editData.newPhone || !validatePhone(editData.newPhone)) {
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
        if (!editData.newPhone || !validatePhone(editData.newPhone)) {
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
      const pnr = bookingContext?.bookingId || itineraryData?.pnr || itineraryData?.PNR;
      const passengerId = currentPassenger?.id || currentPassenger?.passengerId;

      // Prepare the update data according to the new form structure
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

        // Update local passenger data if available
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
                  updatedPassenger.phoneNumber = editData.newPhone;
                  break;
                case "Travel Document":
                  updatedPassenger.documentNumber = editData.newDocumentNumber;
                  updatedPassenger.documentExpiry = editData.newExpiryDate;
                  break;
                case "Address":
                  updatedPassenger.firstName = editData.firstName;
                  updatedPassenger.lastName = editData.lastName;
                  updatedPassenger.phone = editData.newPhone;
                  updatedPassenger.phoneNumber = editData.newPhone;
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

  // Debug logging
  console.log("Booking Details Debug:", {
    dataLoading,
    bookingData,
    passengerData,
    itineraryData,
    bookingContext
  });

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
        
        {/* Sidebar: Cherry Return style */}
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
                  : message.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
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

            {/* Debug Panel - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Information</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Base URI:</strong> {BASE_URI}</p>
                  <p><strong>PNR:</strong> {bookingContext?.bookingId || 'Not found'}</p>
                  <p><strong>Data Loading:</strong> {dataLoading ? 'Yes' : 'No'}</p>
                  <p><strong>Passenger Count:</strong> {passengerData.length}</p>
                  <p><strong>PDF Available:</strong> {pdfData ? 'Yes' : 'No'}</p>
                  <p><strong>Booking Data:</strong> {bookingData ? 'Yes' : 'No'}</p>
                  {lastAttemptedEndpoints.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold">Attempted Endpoints:</p>
                      <ul className="list-disc ml-5">
                        {lastAttemptedEndpoints.map((e, i) => (
                          <li key={i} className="break-all">{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {lastApiError && (
                    <p><strong>Last API Error:</strong> {String(lastApiError)}</p>
                  )}
                </div>
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
                    placeholder="Enter PNR (e.g. ABC123)"
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
                            <td className="py-2 px-3">{bookingData.bookingReference || itineraryData?.pnr || "N/A"}</td>
                            <td className="py-2 px-3">{formatDate(bookingData.issueDate || itineraryData?.issueDate)}</td>
                            <td className="py-2 px-3">
                              {bookingData.flightNumber || itineraryData?.flightNumber || "N/A"}
                              {bookingData.aircraft && ` (Aircraft: ${bookingData.aircraft})`}
                            </td>
                            <td className="py-2 px-3">
                              {bookingData.tripType || itineraryData?.tripType || "N/A"}
                              {bookingData.refundable && " (Refundable)"}
                            </td>
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
                              <td className="py-2 px-3">
                                {passenger.firstName && passenger.lastName 
                                  ? `${passenger.firstName} ${passenger.lastName}`
                                  : passenger.fullName || passenger.name || "N/A"
                                }
                              </td>
                              <td className="py-2 px-3">{passenger.airlineBookingRef || passenger.bookingReference || "N/A"}</td>
                              <td className="py-2 px-3">{passenger.origin || passenger.departureCity || "N/A"}</td>
                              <td className="py-2 px-3">{formatTime(passenger.departureTime || passenger.deptTime)}</td>
                              <td className="py-2 px-3">{passenger.destination || passenger.arrivalCity || "N/A"}</td>
                              <td className="py-2 px-3">{formatTime(passenger.arrivalTime)}</td>
                              <td className="py-2 px-3">{passenger.baggage || passenger.baggageAllowance || "N/A"}</td>
                              <td className="py-2 px-3">{passenger.class || passenger.cabinClass || "N/A"}</td>
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
                                    <div
                                      className="fixed w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2"
                                      style={{
                                        position: 'fixed',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        marginTop: '10px'
                                      }}
                                      ref={(el) => {
                                        if (el && showEditDropdown === passenger.id) {
                                          const button = el.previousElementSibling;
                                          if (button) {
                                            const rect = button.getBoundingClientRect();
                                            el.style.left = `${rect.left + rect.width / 2}px`;
                                            el.style.top = `${rect.bottom + 10}px`;
                                            el.style.transform = 'translateX(-50%)';
                                          }
                                        }
                                      }}
                                    >
                                      <div className="py-1">
                                        <button
                                          onClick={() => handleEditInfo("Email", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 group border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                                            <Mail className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Email</div>
                                            <div className="text-xs text-gray-500">Update email address</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Phone Number", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 group border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                                            <Phone className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Phone Number</div>
                                            <div className="text-xs text-gray-500">Update phone number</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Travel Document", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 group border-b border-gray-100"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900">Edit Travel Document</div>
                                            <div className="text-xs text-gray-500">Update passport/ID details</div>
                                          </div>
                                        </button>
                                        <button
                                          onClick={() => handleEditInfo("Address", passenger)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-all duration-200 group"
                                        >
                                          <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
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
                    <p><strong>Total:</strong> {priceStructure.currency ? `${priceStructure.currency} ` : ''}{priceStructure.totalPriceFC ?? priceStructure.totalPrice ?? 'N/A'}</p>
                    {priceStructure.priceBreakDown && (
                      <div className="mt-2 text-xs text-gray-700">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(priceStructure.priceBreakDown, null, 2)}</pre>
                      </div>
                    )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-4">
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
