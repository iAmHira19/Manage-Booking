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
  const [lastAttemptedEndpoints, setLastAttemptedEndpoints] = useState([]);
  const [lastApiError, setLastApiError] = useState("");
  
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
          
          // Fetch itinerary data using PNR
          await fetchItineraryData(parsedContext.bookingId);
        } else {
          // Try to get PNR from URL params as fallback
          const urlParams = new URLSearchParams(window.location.search);
          const pnr = urlParams.get('PNR');
          if (pnr) {
            console.log("Using PNR from URL params:", pnr);
            await fetchItineraryData(pnr);
          } else {
            // Show sample data when no booking reference is found
            console.log("No booking reference found, showing sample data");
            setMessage({ type: "info", text: "No booking reference found. Showing sample data for demonstration." });
            loadSampleData();
          }
        }
      } catch (e) {
        console.error("Error loading booking context:", e);
        setMessage({ type: "info", text: "Error loading booking data. Showing sample data for demonstration." });
        // Show sample data even on error
        loadSampleData();
      }
    };

    loadBookingData();
  }, []);

  // Helper function to load sample data
  const loadSampleData = () => {
    const sampleBookingData = {
      bookingReference: "CF123456",
      issueDate: "2024-01-10",
      flightNumber: "PK 301",
      tripType: "Round Trip",
      refundable: true
    };

    const samplePassengerData = [
      {
        id: 1,
        firstName: "Muhammad",
        lastName: "Ali",
        fullName: "Muhammad Ali",
        email: "muhammad.ali@example.com",
        phone: "+923001234567",
        airlineBookingRef: "CF123456",
        origin: "Lahore (LHE)",
        destination: "Karachi (KHI)",
        departureTime: "2024-01-15T14:30:00",
        arrivalTime: "2024-01-15T16:45:00",
        baggage: "20kg",
        class: "Economy",
        documentType: "passport",
        documentNumber: "AB1234567",
        documentExpiry: "2025-12-31",
        address: {
          street: "123 Main Street, Gulberg",
          city: "Lahore",
          country: "Pakistan",
          postalCode: "54000"
        }
      },
      {
        id: 2,
        firstName: "Fatima",
        lastName: "Khan",
        fullName: "Fatima Khan",
        email: "fatima.khan@example.com",
        phone: "+923007654321",
        airlineBookingRef: "CF123456",
        origin: "Lahore (LHE)",
        destination: "Karachi (KHI)",
        departureTime: "2024-01-15T14:30:00",
        arrivalTime: "2024-01-15T16:45:00",
        baggage: "20kg",
        class: "Economy",
        documentType: "passport",
        documentNumber: "CD9876543",
        documentExpiry: "2026-06-30",
        address: {
          street: "456 Park Avenue, DHA",
          city: "Karachi",
          country: "Pakistan",
          postalCode: "75500"
        }
      }
    ];

    setBookingData(sampleBookingData);
    setPassengerData(samplePassengerData);
    setDataLoading(false);
  };

  // Fetch itinerary data from API
  const fetchItineraryData = async (pnr) => {
    setDataLoading(true);
    try {
      // Prefer provided Manage Booking endpoint, allow env override, then fallbacks
      const configured = parsePathList(process.env.NEXT_PUBLIC_ITINERARY_PATHS, pnr);
      const bases = [BASE_URI, ALT_BASE_URI];
      const defaultPaths = [
        "/api/tpflight/getItinerary",
        "/api/tp/getItinerary",
        "/api/Booking/Details",
        "/api/Booking/GetItinerary",
        "/api/ManageBooking/GetItinerary",
        "/api/getItinerary",
        "/api/booking/getItinerary",
        "/api/manage/getItinerary",
        "/api/Itinerary",
        "/api/BookingDetails",
      ];
      const possibleEndpoints = configured || bases.flatMap((b) =>
        defaultPaths.map((p) => `${b}${p}?PNR=${encodeURIComponent(pnr)}`)
      );

      const result = await discoverApiEndpoint(possibleEndpoints);
      
      if (result.success) {
        const apiData = result.data;
        console.log("Itinerary data received from:", result.endpoint, apiData);

        // Normalize according to provided contract
        const normalized = {
          pnr: apiData?.PNR,
          itinerary: apiData?.ItineraryDetails || apiData,
          ticketDocument: apiData?.TicketDocument,
          priceStructure: apiData?.priceStructure,
        };

        // Set base datasets
        setItineraryData(normalized.itinerary);

        // Attempt to infer passengers and booking info from ItineraryDetails shapes
        const passengers =
          normalized.itinerary?.passengers ||
          normalized.itinerary?.Passengers ||
          normalized.itinerary?.passengerList ||
          normalized.itinerary?.PassengerList ||
          normalized.itinerary?.travelers ||
          normalized.itinerary?.Travelers ||
          apiData?.passengers ||
          apiData?.Passengers ||
          apiData?.passengerList ||
          apiData?.PassengerList ||
          apiData?.travelers ||
          apiData?.Travelers ||
          [];

        console.log("Found passengers data:", passengers);

        if (Array.isArray(passengers) && passengers.length > 0) {
          // Ensure each passenger has required fields
          const processedPassengers = passengers.map((passenger, index) => ({
            id: passenger.id || passenger.passengerId || index + 1,
            firstName: passenger.firstName || passenger.first_name || passenger.givenName || "",
            lastName: passenger.lastName || passenger.last_name || passenger.surname || "",
            fullName: passenger.fullName || passenger.full_name || `${passenger.firstName || ""} ${passenger.lastName || ""}`.trim(),
            email: passenger.email || passenger.emailAddress || "",
            phone: passenger.phone || passenger.phoneNumber || passenger.mobile || "",
            airlineBookingRef: passenger.airlineBookingRef || passenger.bookingReference || passenger.pnr || normalized.pnr,
            origin: passenger.origin || passenger.departureCity || passenger.from || "",
            destination: passenger.destination || passenger.arrivalCity || passenger.to || "",
            departureTime: passenger.departureTime || passenger.deptTime || passenger.departure || "",
            arrivalTime: passenger.arrivalTime || passenger.arrTime || passenger.arrival || "",
            baggage: passenger.baggage || passenger.baggageAllowance || passenger.baggageWeight || "",
            class: passenger.class || passenger.cabinClass || passenger.travelClass || "",
            documentType: passenger.documentType || passenger.docType || "",
            documentNumber: passenger.documentNumber || passenger.docNumber || "",
            documentExpiry: passenger.documentExpiry || passenger.docExpiry || "",
            address: passenger.address || {}
          }));
          setPassengerData(processedPassengers);
        } else {
          console.log("No valid passenger data found, using sample data");
          loadSampleData();
          return; // Exit early to avoid setting empty data
        }

        const booking =
          normalized.itinerary?.booking ||
          normalized.itinerary?.Booking ||
          normalized.itinerary?.bookingInfo ||
          normalized.itinerary?.BookingInfo ||
          normalized.itinerary?.bookingDetails ||
          normalized.itinerary?.BookingDetails ||
          apiData?.booking ||
          apiData?.Booking ||
          apiData?.bookingInfo ||
          apiData?.BookingInfo ||
          null;

        console.log("Found booking data:", booking);

        if (booking) {
          // Process booking data to ensure required fields
          const processedBooking = {
            bookingReference: booking.bookingReference || booking.booking_ref || booking.reference || normalized.pnr,
            issueDate: booking.issueDate || booking.issue_date || booking.createdDate || booking.created_date,
            flightNumber: booking.flightNumber || booking.flight_number || booking.flight || "",
            tripType: booking.tripType || booking.trip_type || booking.journeyType || "",
            refundable: booking.refundable || booking.isRefundable || false,
            ...booking
          };
          setBookingData(processedBooking);
        } else {
          // Minimal booking info from the envelope
          setBookingData({ 
            bookingReference: normalized.pnr,
            issueDate: new Date().toISOString().split('T')[0],
            flightNumber: "N/A",
            tripType: "N/A",
            refundable: false
          });
        }

        if (normalized.ticketDocument) {
          setPdfData(normalized.ticketDocument);
        }

        setMessage({ type: "success", text: `Booking data loaded successfully from ${result.endpoint}!` });
      } else {
        setLastAttemptedEndpoints(result.attempted || []);
        setLastApiError(result.error || "");
        // If no API endpoint works, show sample data with a detailed warning
        console.warn("No working API endpoint found, showing sample data", result);

        // Build helpful diagnostic text for the UI
        const lastErrText = result.error || "No response returned";
        const attemptedList = Array.isArray(result.attempted) ? result.attempted : [];
        const attemptedPreview = attemptedList.join("\n");

        let suggestion = "Please verify the backend is running and that the Booking controller route exists.";
        if (typeof lastErrText === 'string' && lastErrText.includes('No type was found that matches the controller named')) {
          suggestion = "The backend reports a missing controller. Check your backend routing and controller name (e.g. 'Booking').";
        }

        setMessage({ 
          type: "warning", 
          text: `No working API endpoint found. Showing sample data. Last error: ${lastErrText}. Tried endpoints:\n${attemptedPreview}\n${suggestion}`
        });
        
        // Set sample data as fallback - always show sample data when API fails
        setItineraryData({ pnr: pnr, sample: true });
        
        // Load comprehensive sample data with all fields needed for editing
        const sampleBookingData = {
          bookingReference: pnr || "CF123456",
          issueDate: "2024-01-10",
          flightNumber: "PK 301",
          tripType: "Round Trip",
          refundable: true
        };

        const samplePassengerData = [
          {
            id: 1,
            firstName: "Muhammad",
            lastName: "Ali",
            fullName: "Muhammad Ali",
            email: "muhammad.ali@example.com",
            phone: "+923001234567",
            airlineBookingRef: pnr || "CF123456",
            origin: "Lahore (LHE)",
            destination: "Karachi (KHI)",
            departureTime: "2024-01-15T14:30:00",
            arrivalTime: "2024-01-15T16:45:00",
            baggage: "20kg",
            class: "Economy",
            documentType: "passport",
            documentNumber: "AB1234567",
            documentExpiry: "2025-12-31",
            address: {
              street: "123 Main Street, Gulberg",
              city: "Lahore",
              country: "Pakistan",
              postalCode: "54000"
            }
          },
          {
            id: 2,
            firstName: "Fatima",
            lastName: "Khan",
            fullName: "Fatima Khan",
            email: "fatima.khan@example.com",
            phone: "+923007654321",
            airlineBookingRef: pnr || "CF123456",
            origin: "Lahore (LHE)",
            destination: "Karachi (KHI)",
            departureTime: "2024-01-15T14:30:00",
            arrivalTime: "2024-01-15T16:45:00",
            baggage: "20kg",
            class: "Economy",
            documentType: "passport",
            documentNumber: "CD9876543",
            documentExpiry: "2026-06-30",
            address: {
              street: "456 Park Avenue, DHA",
              city: "Karachi",
              country: "Pakistan",
              postalCode: "75500"
            }
          }
        ];

        setPassengerData(samplePassengerData);
        setBookingData(sampleBookingData);
      }
    } catch (error) {
      console.error("Error fetching itinerary data:", error);
      setMessage({ type: "info", text: "Error loading booking data. Showing sample data for demonstration." });
      // Show sample data even on API error
      loadSampleData();
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

  // Handle resend ticket email
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

      // Use provided endpoint contract; body is raw JSON string
      const resendEndpoint = `${BASE_URI}/api/tp/resendTicketDocument`;
      console.log("Resending ticket to:", resendEndpoint, "PNR:", pnr);
      const response = await fetch(resendEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pnr),
      });

      const text = (await response.text()).trim();
      if (response.ok && /sent successfully/i.test(text)) {
        setMessage({ type: "success", text });
      } else if (!response.ok) {
        setMessage({ type: "error", text: text || "Failed to send ticket email." });
      } else {
        // 200 but not a success string
        setMessage({ type: "warning", text });
      }
    } catch (error) {
      console.error("Error sending ticket email:", error);
      setMessage({ type: "error", text: "Error sending ticket email" });
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
          existingData.email = passenger.email || "";
          break;
        case "Phone Number":
          existingData.phone = passenger.phone || passenger.phoneNumber || "";
          break;
        case "Travel Document":
          existingData.documentType = passenger.documentType || "";
          existingData.documentNumber = passenger.documentNumber || "";
          existingData.expiryDate = passenger.documentExpiry || "";
          break;
        case "Address":
          existingData.street = passenger.address?.street || "";
          existingData.city = passenger.address?.city || "";
          existingData.country = passenger.address?.country || "";
          existingData.postalCode = passenger.address?.postalCode || "";
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
        if (!editData.email || !validateEmail(editData.email)) {
          errors.email = "Please enter a valid email address";
        }
        break;
        
      case "Phone Number":
        if (!editData.phone || !validatePhone(editData.phone)) {
          errors.phone = "Please enter a valid phone number";
        }
        break;
        
      case "Travel Document":
        errors = validateDocument(editData.documentType, editData.documentNumber, editData.expiryDate);
        break;
        
      case "Address":
        errors = validateAddress(editData.street, editData.city, editData.country, editData.postalCode);
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
      
      const response = await fetch(`${BASE_URI}/api/booking/update-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pnr: pnr,
          passengerId: passengerId,
          updateType: editType.toLowerCase().replace(/\s+/g, '_'),
          updateData: editData,
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
                  updatedPassenger.email = editData.email;
                  break;
                case "Phone Number":
                  updatedPassenger.phone = editData.phone;
                  updatedPassenger.phoneNumber = editData.phone;
                  break;
                case "Travel Document":
                  updatedPassenger.documentType = editData.documentType;
                  updatedPassenger.documentNumber = editData.documentNumber;
                  updatedPassenger.documentExpiry = editData.expiryDate;
                  break;
                case "Address":
                  updatedPassenger.address = {
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
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                      <button
                                        onClick={() => handleEditInfo("Email", passenger)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <Mail className="w-4 h-4" />
                                        Edit Email
                                      </button>
                                      <button
                                        onClick={() => handleEditInfo("Phone Number", passenger)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <Phone className="w-4 h-4" />
                                        Edit Phone Number
                                      </button>
                                      <button
                                        onClick={() => handleEditInfo("Travel Document", passenger)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <FileText className="w-4 h-4" />
                                        Edit Travel Document
                                      </button>
                                      <button
                                        onClick={() => handleEditInfo("Address", passenger)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <MapPin className="w-4 h-4" />
                                        Edit Address
                                      </button>
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
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#2E4A6B]">Edit {editType}</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {currentPassenger && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Passenger:</strong> {currentPassenger.firstName} {currentPassenger.lastName}
                </p>
              </div>
            )}
            
            {editType === "Email" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {editType === "Phone Number" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, phone: e.target.value });
                      if (formErrors.phone) {
                        setFormErrors({ ...formErrors, phone: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number (e.g., +1234567890)"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.phone}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Include country code for international numbers
                  </p>
                </div>
              </div>
            )}

            {editType === "Travel Document" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editData.documentType || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, documentType: e.target.value });
                      if (formErrors.documentType) {
                        setFormErrors({ ...formErrors, documentType: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.documentType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select document type</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="driving_license">Driving License</option>
                    <option value="visa">Visa</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.documentType && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.documentType}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.documentNumber || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, documentNumber: e.target.value });
                      if (formErrors.documentNumber) {
                        setFormErrors({ ...formErrors, documentNumber: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.documentNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter document number"
                  />
                  {formErrors.documentNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.documentNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editData.expiryDate || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, expiryDate: e.target.value });
                      if (formErrors.expiryDate) {
                        setFormErrors({ ...formErrors, expiryDate: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.expiryDate}
                    </p>
                  )}
                </div>
              </div>
            )}

            {editType === "Address" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.street || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, street: e.target.value });
                      if (formErrors.street) {
                        setFormErrors({ ...formErrors, street: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter street address"
                  />
                  {formErrors.street && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.street}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.city || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, city: e.target.value });
                        if (formErrors.city) {
                          setFormErrors({ ...formErrors, city: "" });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editData.postalCode || ""}
                      onChange={(e) => {
                        setEditData({ ...editData, postalCode: e.target.value });
                        if (formErrors.postalCode) {
                          setFormErrors({ ...formErrors, postalCode: "" });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                        formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter postal code"
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.country || ""}
                    onChange={(e) => {
                      setEditData({ ...editData, country: e.target.value });
                      if (formErrors.country) {
                        setFormErrors({ ...formErrors, country: "" });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      formErrors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter country"
                  />
                  {formErrors.country && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.country}
                    </p>
                  )}
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
