"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Upload, ChevronDown, ChevronUp, X, Mail, Phone, FileText, MapPin, Eye, Printer, AlertCircle, Search, Filter } from "lucide-react";
import ImageWithFallback from "@/components/figma/ImageWithFallback";
import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Validation utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Pakistani phone number should be 11 digits starting with 92 or 10 digits starting with 0
  return digitsOnly.length >= 10 && digitsOnly.length <= 13 && /^\+?92[0-9]{9}$|^\+?[0-9]{10,12}$/.test(phone);
};

const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return name.trim().length >= 2 && nameRegex.test(name.trim());
};

const validatePassportNumber = (passport) => {
  const passportRegex = /^[A-Z0-9]+$/;
  return passport.trim().length >= 5 && passportRegex.test(passport.trim());
};

const validatePostalCode = (postalCode) => {
  const postalRegex = /^[0-9]+$/;
  return postalRegex.test(postalCode.trim()) && postalCode.trim().length >= 4;
};

const validateFutureDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

const validateBookingReference = (bookingRef) => {
  const bookingRegex = /^[A-Z0-9]+$/;
  return bookingRef.trim().length >= 3 && bookingRegex.test(bookingRef.trim());
};

// Booking details data - replace with API call
const bookingDetailsData = [];

export default function BookingDetails() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const fileInputRef = useRef(null);

  // Form state and validation
  const [formData, setFormData] = useState({
    bookingReference: '',
    passengerName: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    issuingCountry: 'Pakistan',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateField = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
      case 'bookingReference':
        if (!value.trim()) {
          error = 'Booking reference is required';
        } else if (!validateBookingReference(value)) {
          error = 'Booking reference must be alphanumeric and at least 3 characters';
        }
        break;

      case 'passengerName':
        if (!value.trim()) {
          error = 'Passenger name is required';
        } else if (value.trim().length < 3) {
          error = 'Passenger name must be at least 3 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!validatePhone(value)) {
          error = 'Please enter a valid phone number';
        }
        break;

      case 'firstName':
        if (!value.trim()) {
          error = 'First name is required';
        } else if (!validateName(value)) {
          error = 'First name must contain only letters';
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          error = 'Last name is required';
        } else if (!validateName(value)) {
          error = 'Last name must contain only letters';
        }
        break;

      case 'middleName':
        if (value.trim() && !validateName(value)) {
          error = 'Middle name must contain only letters';
        }
        break;

      case 'dateOfBirth':
        if (!value.trim()) {
          error = 'Date of birth is required';
        }
        break;

      case 'nationality':
        if (!value.trim()) {
          error = 'Nationality is required';
        } else if (!validateName(value)) {
          error = 'Nationality must contain only letters';
        }
        break;

      case 'passportNumber':
        if (!value.trim()) {
          error = 'Passport number is required';
        } else if (!validatePassportNumber(value)) {
          error = 'Passport number must be alphanumeric and at least 5 characters';
        }
        break;

      case 'passportExpiry':
        if (!value.trim()) {
          error = 'Passport expiry date is required';
        } else if (!validateFutureDate(value)) {
          error = 'Passport expiry date must be in the future';
        }
        break;

      case 'street':
        if (!value.trim()) {
          error = 'Street address is required';
        }
        break;

      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        }
        break;

      case 'state':
        if (!value.trim()) {
          error = 'State/Province is required';
        }
        break;

      case 'postalCode':
        if (!value.trim()) {
          error = 'Postal code is required';
        } else if (!validatePostalCode(value)) {
          error = 'Please enter a valid postal code';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Real-time validation
    const error = validateField(fieldName, value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    // Check if form is valid after each change
    checkFormValidity();
  };

  const checkFormValidity = () => {
    const errors = {};

    // Validate all required fields
    Object.keys(formData).forEach(field => {
      if (field !== 'middleName' && field !== 'apartment') {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
      }
    });

    // For optional fields, only validate if they have values
    if (formData.middleName) {
      const error = validateField('middleName', formData.middleName);
      if (error) errors.middleName = error;
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleEditBooking = (booking) => {
    // Reset form data when opening modal
    setFormData({
      bookingReference: booking.bookingRef,
      passengerName: booking.passengerName,
      email: booking.email,
      phone: booking.phone,
      firstName: booking.passengerName.split(" ")[0] || '',
      lastName: booking.passengerName.split(" ").slice(-1)[0] || '',
      middleName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      issuingCountry: 'Pakistan',
      street: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Pakistan'
    });

    // Reset validation errors
    setValidationErrors({});
    setIsFormValid(false);

    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (isFormValid) {
      // Handle save logic here - only executes if form is valid
      console.log('Booking form data being saved:', formData);
      alert('Booking form validation passed! Data would be saved here.');
      setIsEditModalOpen(false);
      setEditingBooking(null);
      // Reset form data
      setFormData({
        bookingReference: '',
        passengerName: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        nationality: '',
        passportNumber: '',
        passportExpiry: '',
        issuingCountry: 'Pakistan',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Pakistan'
      });
    }
  };

  const filteredBookings = bookingDetailsData.filter(booking => {
    const matchesSearch = booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || booking.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar - hidden on small screens */}
        <aside className="hidden lg:block w-64 lg:min-h-screen order-2 lg:order-1">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 order-2 lg:order-2 mt-2 sm:mt-4 lg:mt-0">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-semibold text-[#FF6B35] mb-3 sm:mb-4 lg:mb-6 tracking-wide uppercase">
              Booking Details
            </h1>

            {/* Search and Filter Section */}
            <Card className="mb-3 sm:mb-4 lg:mb-6 border border-gray-200 shadow-md rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200 py-3 px-4">
                <CardTitle className="text-base sm:text-lg font-bold text-[#2E4A6B] tracking-wide">
                  Search & Filter Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-[#002b5c] font-medium">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Search by booking ref, name, or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statusFilter" className="text-[#002b5c] font-medium">
                      Filter by Status
                    </Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#002b5c] font-medium">Actions</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg h-12"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Table */}
            <Card className="mb-3 sm:mb-4 lg:mb-6 border border-gray-200 shadow-md w-full max-w-full mx-auto rounded-xl overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 flex justify-center">
                <CardTitle className="text-base sm:text-lg md:text-xl lg:text-[20px] font-bold text-[#2E4A6B] tracking-wide relative inline-block">
                  <span className="relative inline-block">
                    Booking Details
                    <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded"></span>
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto bg-white">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-[#2E4A6B] min-w-[800px]">
                    <thead className="bg-[#002b5c] text-white text-xs sm:text-sm md:text-[15px] font-medium uppercase">
                      <tr>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Booking Ref
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Passenger
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Contact
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Flight
                        </th>
                        <th className="text-left py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Status
                        </th>
                        <th className="text-center py-2 px-2 sm:py-3 sm:px-3 md:px-5 border-b border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-sm sm:text-[15px] font-normal">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-lg font-medium text-gray-400 mb-2">No booking data available</div>
                              <div className="text-sm text-gray-400">Booking details will appear here once data is loaded from the API.</div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking, index) => (
                          <tr
                            key={booking.id}
                            className={`border-b border-gray-100 hover:bg-[#E8F4FD] transition cursor-pointer ${
                              index % 2 === 0 ? "bg-white" : "bg-[#F9FBFF]"
                            }`}
                          >
                            <td className="py-2 px-3 sm:py-3 sm:px-5">
                              <div className="font-semibold text-[#FF6B35]">{booking.bookingRef}</div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5">
                              <div className="font-medium">{booking.passengerName}</div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5">
                              <div className="text-sm text-gray-600">{booking.email}</div>
                              <div className="text-sm text-gray-600">{booking.phone}</div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5">
                              <div className="font-medium">{booking.flightNumber}</div>
                              <div className="text-sm text-gray-600">{booking.route}</div>
                            </td>
                            <td className="py-2 px-3 sm:py-3 sm:px-5">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'Confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-5 text-center">
                              <Button
                                size="sm"
                                onClick={() => handleEditBooking(booking)}
                                className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white border-none rounded-md px-3 py-2 text-sm"
                              >
                                Edit Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Booking Modal */}
            <Dialog
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
            >
              <DialogContent className="max-w-[720px] w-[92vw] sm:w-[720px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-0 overflow-hidden flex flex-col mx-auto my-auto max-h-[80vh]">
                <div className="bg-gradient-to-r from-[#002b5c] to-[#003d7a] px-8 py-6 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-lg sm:text-xl lg:text-[24px] font-bold text-white mb-1">
                        Edit Booking Details
                      </DialogTitle>
                      <p className="text-blue-200 text-xs sm:text-sm lg:text-[14px]">
                        {editingBooking?.passengerName} - {editingBooking?.bookingRef}
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

                {editingBooking && (
                  <div className="overflow-y-auto flex-1">
                    <div className="p-6 sm:p-8">
                      {/* Booking Information Section */}
                      <div className="mb-6">
                        <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                          Booking Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bookingReference" className="text-[#002b5c] font-medium">
                              Booking Reference
                            </Label>
                            <Input
                              id="bookingReference"
                              value={formData.bookingReference}
                              onChange={(e) => handleInputChange('bookingReference', e.target.value)}
                              className={`rounded-lg h-12 ${
                                validationErrors.bookingReference
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                  : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                              }`}
                            />
                            {validationErrors.bookingReference && (
                              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                <AlertCircle className="w-4 h-4" />
                                {validationErrors.bookingReference}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="passengerName" className="text-[#002b5c] font-medium">
                              Passenger Name
                            </Label>
                            <Input
                              id="passengerName"
                              value={formData.passengerName}
                              onChange={(e) => handleInputChange('passengerName', e.target.value)}
                              className={`rounded-lg h-12 ${
                                validationErrors.passengerName
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                  : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                              }`}
                            />
                            {validationErrors.passengerName && (
                              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                <AlertCircle className="w-4 h-4" />
                                {validationErrors.passengerName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information Tabs */}
                      <Tabs defaultValue="contact" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl mb-6">
                          <TabsTrigger
                            value="contact"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" />
                            Contact
                          </TabsTrigger>
                          <TabsTrigger
                            value="personal"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Personal
                          </TabsTrigger>
                          <TabsTrigger
                            value="address"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#002b5c] data-[state=active]:shadow-md transition-all flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            Address
                          </TabsTrigger>
                        </TabsList>

                        {/* Contact Tab */}
                        <TabsContent value="contact" className="space-y-6 mt-6">
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                              Contact Information
                            </h3>

                            <div className="space-y-5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="email" className="text-[#002b5c] font-medium">
                                    Email Address
                                  </Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.email && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.email}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="phone" className="text-[#002b5c] font-medium">
                                    Phone Number
                                  </Label>
                                  <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.phone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.phone && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Personal Information Tab */}
                        <TabsContent value="personal" className="space-y-6 mt-6">
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                              Personal Information
                            </h3>

                            <div className="space-y-5">
                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="firstName" className="text-[#002b5c] font-medium">
                                    First Name
                                  </Label>
                                  <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.firstName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.firstName && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.firstName}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="lastName" className="text-[#002b5c] font-medium">
                                    Last Name
                                  </Label>
                                  <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.lastName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.lastName && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.lastName}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="middleName" className="text-[#002b5c] font-medium">
                                  Middle Name{" "}
                                  <span className="text-gray-400">(Optional)</span>
                                </Label>
                                <Input
                                  id="middleName"
                                  placeholder="Enter middle name"
                                  value={formData.middleName}
                                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                                  className={`rounded-lg h-12 ${
                                    validationErrors.middleName
                                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                      : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                  }`}
                                />
                                {validationErrors.middleName && (
                                  <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationErrors.middleName}
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="dateOfBirth" className="text-[#002b5c] font-medium">
                                    Date of Birth
                                  </Label>
                                  <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.dateOfBirth
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.dateOfBirth && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.dateOfBirth}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="nationality" className="text-[#002b5c] font-medium">
                                    Nationality
                                  </Label>
                                  <Input
                                    id="nationality"
                                    value={formData.nationality}
                                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.nationality
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.nationality && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.nationality}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="passportNumber" className="text-[#002b5c] font-medium">
                                    Passport Number
                                  </Label>
                                  <Input
                                    id="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.passportNumber
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.passportNumber && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.passportNumber}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="passportExpiry" className="text-[#002b5c] font-medium">
                                    Passport Expiry Date
                                  </Label>
                                  <Input
                                    id="passportExpiry"
                                    type="date"
                                    value={formData.passportExpiry}
                                    onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.passportExpiry
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.passportExpiry && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.passportExpiry}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Address Tab */}
                        <TabsContent value="address" className="space-y-6 mt-6">
                          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base sm:text-lg lg:text-[18px] font-semibold text-[#002b5c] mb-6 flex items-center gap-2">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
                              Address Information
                            </h3>

                            <div className="space-y-5">
                              <div className="space-y-2">
                                <Label htmlFor="street" className="text-[#002b5c] font-medium">
                                  Street Address
                                </Label>
                                <Input
                                  id="street"
                                  value={formData.street}
                                  onChange={(e) => handleInputChange('street', e.target.value)}
                                  className={`rounded-lg h-12 ${
                                    validationErrors.street
                                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                      : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                  }`}
                                />
                                {validationErrors.street && (
                                  <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {validationErrors.street}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="apartment" className="text-[#002b5c] font-medium">
                                  Apartment, Suite, etc.{" "}
                                  <span className="text-gray-400">(Optional)</span>
                                </Label>
                                <Input
                                  id="apartment"
                                  placeholder="Apt, Suite, Unit, Building, Floor, etc."
                                  value={formData.apartment}
                                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                                  className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="city" className="text-[#002b5c] font-medium">
                                    City
                                  </Label>
                                  <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.city
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.city && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.city}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="state" className="text-[#002b5c] font-medium">
                                    State / Province
                                  </Label>
                                  <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.state
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.state && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.state}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                  <Label htmlFor="postalCode" className="text-[#002b5c] font-medium">
                                    Postal Code / ZIP Code
                                  </Label>
                                  <Input
                                    id="postalCode"
                                    value={formData.postalCode}
                                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                    className={`rounded-lg h-12 ${
                                      validationErrors.postalCode
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20'
                                    }`}
                                  />
                                  {validationErrors.postalCode && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                                      <AlertCircle className="w-4 h-4" />
                                      {validationErrors.postalCode}
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="country" className="text-[#002b5c] font-medium">
                                    Country
                                  </Label>
                                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                                    <SelectTrigger className="border-gray-300 focus:border-[#002b5c] focus:ring-2 focus:ring-[#002b5c]/20 rounded-lg h-12">
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
                    disabled={!isFormValid}
                    className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium h-10 sm:h-12 text-sm sm:text-base ${
                      isFormValid
                        ? 'bg-gradient-to-r from-[#002b5c] to-[#003d7a] hover:from-[#001d42] hover:to-[#002b5c] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Footer Contact Info */}
            <div className="mt-4 lg:mt-6 text-xs sm:text-sm text-gray-600 text-center">
              <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1 sm:gap-2">
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Site Footer */}
      <Footer showPaymentImages={false} />
    </div>
  );
}
