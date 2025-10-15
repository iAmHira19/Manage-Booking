import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import useAirports from "@/hooks/useAirports";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTicketDocument } from "@/utils/getTicketDocument";
import { useSignInContext } from "@/providers/SignInStateProvider";
import formatCurrency from '@/utils/formatCurrency';
import convertPrice from '@/utils/convertPrice';

const GetTicket = ({
  TicketResponse,
  setReactToPrintFn,
  onPdfBase64Ready,
  setGeneratedPDFBase64,
  priceStructure,
}) => {
  // STATE Variables
  const [airports, setAirports] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { getTicketDocument } = useTicketDocument();
  const { userId, exchangeRate, searchCurrencySymbol, searchCurrencyCode } = useSignInContext();
  let [GDSBookingRef, setGDSBookingRef] = useState(null);
  const UIRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      setIsMobile(
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        ) || window.innerWidth <= 768
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // APIs Being Called
  const { data: AirportData } = useAirports("none");

  // useEffects
  useEffect(() => {
    setReactToPrintFn(() =>
      isMobile ? generateAndDownloadPDF : reactToPrintFnn
    );
  }, [isMobile]);

  useEffect(() => {
    const getData = async () => {
      let airports_local = AirportData?.flatMap((des, id) => ({
        tpAIRPORT_CITYNAME: des.tpAIRPORT_CITYNAME,
        tpAIRPORT_CODE: des.tpAIRPORT_CODE,
        tpAIRPORT_NAME: des.tpAIRPORT_NAME,
        tpDescription: des.tpDescription,
      }));
      setAirports(airports_local);
    };
    if (airports && airports.length === 0) getData();
  }, [AirportData]);

  // Debug: log current currency context and converted totals to help diagnose wrong currency display
  useEffect(() => {
    try {
      const subtotalBase =
        Number(priceStructure?.adultPriceFC ?? 0) * (priceStructure?.noOfAdults ?? 0) +
        Number(priceStructure?.childPriceFC ?? 0) * (priceStructure?.noOfChild ?? 0) +
        Number(priceStructure?.infantPriceFC ?? 0) * (priceStructure?.noOfInfant ?? 0);
      const taxesBase =
        Number(priceStructure?.adultTaxFC ?? 0) * (priceStructure?.noOfAdults ?? 0) +
        Number(priceStructure?.childTaxFC ?? 0) * (priceStructure?.noOfChild ?? 0) +
        Number(priceStructure?.infantTaxFC ?? 0) * (priceStructure?.noOfInfant ?? 0) +
        Number(priceStructure?.serviceFeeFC ?? 0);
      const totalBase = Number(priceStructure?.totalPriceFC ?? 0);
      console.debug('GetTicket: currency context', { searchCurrencyCode, searchCurrencySymbol, exchangeRate });
      console.debug('GetTicket: bases', { subtotalBase, taxesBase, totalBase });
      console.debug('GetTicket: converted', {
        subtotal: convertPrice(subtotalBase, Number(exchangeRate ?? 1)),
        taxes: convertPrice(taxesBase, Number(exchangeRate ?? 1)),
        total: convertPrice(totalBase, Number(exchangeRate ?? 1)),
      });
    } catch (e) {
      // ignore
    }
  }, [exchangeRate, searchCurrencySymbol, searchCurrencyCode, priceStructure]);

  useEffect(() => {
    if (setGeneratedPDFBase64) {
      setGeneratedPDFBase64(() => generatePDFBase64);
    }
  }, [setGeneratedPDFBase64]);

  useEffect(() => {
    const makeApiReq = async () => {
      let base64 = await generatePDFBase64();
      let payload = {
        PNR: GDSBookingRef,
        TicketDocument: base64,
        UserId: userId,
        priceStructure,
      };
      await getTicketDocument(payload);
    };
    if (GDSBookingRef) makeApiReq();
  }, [GDSBookingRef]);

  // Improved print functionality with better mobile support
  const reactToPrintFnn = useReactToPrint({
    contentRef: UIRef,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 5mm 0;
      }
      
      @media print {
        /* Reset everything first */
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Hide everything by default */
        body * {
          visibility: hidden !important;
        }
        
        /* Show only ticket content */
        .ticket-container,
        .ticket-container * {
          visibility: visible !important;
        }
        
        /* Position ticket container */
        .ticket-container {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: white !important;
        }
        
        /* Remove page margins */
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }
        
        /* Hide print buttons and other UI elements */
        .hide-on-print {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Ensure proper layout */
        .makeItEnd {
          width: 100%;
          text-align: end;
        }
        
        /* Remove any transforms or animations */
        * {
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      }
    `,
    onBeforeGetContent: () => {
      // Hide all other elements before printing
      document.body.style.visibility = "hidden";
      if (UIRef.current) {
        UIRef.current.style.visibility = "visible";
      }
    },
    onAfterPrint: () => {
      // Show all elements after printing
      document.body.style.visibility = "visible";
    },
  });

  // Alternative function for mobile devices - generate PDF and download
  const generateAndDownloadPDF = async () => {
    try {
      const base64 = await generatePDFBase64();
      if (base64) {
        // Create download link
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = `ticket-${GDSBookingRef || "receipt"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error generating PDF for mobile:", error);
      // Fallback to regular print
      reactToPrintFnn();
    }
  };

  // Function to generate PDF as base64
  const generatePDFBase64 = async () => {
    if (!UIRef.current) return;

    try {
      // Create PDF directly instead of going through PNG first
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Determine the size of the ticket container
      const ticketElement = UIRef.current;
      const { width: elementWidth, height: elementHeight } =
        ticketElement.getBoundingClientRect();

      // Scale factor for better quality but not too large
      const scale = isMobile ? 1.2 : 1.5; // Lower scale for mobile devices

      // Create canvas with optimized settings
      const canvas = await html2canvas(ticketElement, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#FFFFFF",
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Remove any unnecessary elements in the cloned document
          const clonedElement = clonedDoc.querySelector(".hide-on-print");
          if (clonedElement) clonedElement.remove();
        },
      });

      // Convert canvas to an image
      const imgData = canvas.toDataURL("image/jpeg", 0.8);

      // Calculate dimensions to fit the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate aspect ratio to fit the page properly
      const imgWidth = elementWidth * scale;
      const imgHeight = elementHeight * scale;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const finalHeight = imgHeight * ratio;
      const finalWidth = imgWidth * ratio;

      // Center the image on the page
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);

      // Get PDF as base64 string
      const pdfBase64 = pdf.output("datauristring");
      const base64Only = pdfBase64.split(",")[1];

      // Send the result to the callback
      onPdfBase64Ready(base64Only);
      return base64Only;
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Fallback to simpler method if the PDF generation fails
      try {
        const canvas = await html2canvas(UIRef.current, {
          scale: 1,
          useCORS: true,
          backgroundColor: "#FFFFFF",
        });

        const base64Only = canvas.toDataURL("image/jpeg", 0.7);
        onPdfBase64Ready(base64Only.split(",")[1]);
        return base64Only.split(",")[1];
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return null;
      }
    }
  };

  // Error handling
  const errorMessage =
    TicketResponse?.ReservationResponse?.Result?.Error?.[0]?.Message ||
    (TicketResponse?.ReservationResponse?.Result?.Error &&
      "An error occurred with your reservation");

  // Extracting base data from the response
  const reservation = TicketResponse?.ReservationResponse?.Reservation;
  const receipts = reservation?.Receipt || [];

  // Other receipts: From other sources than 1G
  const othersReceipts = receipts?.filter(
    (receipt) => receipt?.Confirmation?.Locator?.source != "1G"
  );
  const GDSReceipt = receipts.find(
    (receipt) => receipt?.Confirmation?.Locator?.source == "1G"
  );

  useEffect(() => {
    GDSReceipt && setGDSBookingRef(GDSReceipt?.Confirmation?.Locator?.value);
  }, [GDSReceipt]);

  // Return early if there's an error or no reservation data
  if (errorMessage || !reservation) {
    return (
      <div className="max-w-4xl mx-auto min-h-80">
        <div className="flex items-center justify-center min-h-80">
          <p className="h-full font-gotham bold">
            {errorMessage || "Please Wait"}
          </p>
        </div>
      </div>
    );
  }

  // Extract traveler information
  const traveler = reservation.Traveler?.[0];
  const email = traveler?.Email?.[0]?.value;
  const countryCode = traveler?.Telephone?.[0]?.countryAccessCode;
  const phone = traveler?.Telephone?.[0]?.phoneNumber;
  const fullPhone = countryCode ? `+${countryCode} ${phone}` : phone;

  // Extract offer information
  const offer = reservation.Offer?.[0];
  const price = offer?.Price;

  // Extract products (could be multiple for multicity)
  const products = offer?.Product || [];

  // Get baggage allowance for each product
  const baggageAllowance =
    offer?.TermsAndConditionsFull?.[0]?.BaggageAllowance || [];

  // Handle receipts and booking references properly
  const primaryReceipt =
    receipts.find(
      (receipt) => receipt?.Confirmation?.Locator?.source != "1G"
    ) || receipts[0];

  const bookingRef = primaryReceipt?.Confirmation?.Locator?.value;

  const confirmationStatus =
    GDSReceipt?.Confirmation?.OfferStatus?.StatusAir?.flatMap((status) =>
      status.flightRefs.map((fRef) => ({
        fRefStatus: status.value,
        fRef,
      }))
    ) || [];

  // Format dates and times
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  };

  // Format duration
  const formatDuration = (durationStr) => {
    if (!durationStr) return "";
    const hours = durationStr.match(/(\d+)H/);
    const minutes = durationStr.match(/(\d+)M/);

    let result = "";
    if (hours) result += `${hours[1]}h `;
    if (minutes) result += `${minutes[1]}m`;

    return result.trim();
  };

  // Get cabin and brand info from the first flight
  const PassengerFlight = products?.flatMap((product) =>
    product?.PassengerFlight?.map((PFlight) => PFlight)
  );
  const FlightProducts = PassengerFlight?.flatMap(
    (PFlight) => PFlight?.FlightProduct
  );
  const cabin = FlightProducts?.map((FProduct) => FProduct?.cabin);
  const brand = FlightProducts?.map((FProduct) => FProduct?.Brand?.name);

  return (
    <div
      className={`ticket-container max-w-4xl w-[56rem] lg:w-full mx-auto bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 overflow-x-scroll lg:overflow-x-auto`}
      ref={UIRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 w-full">
        <div className="flex items-center justify-between w-full overflow-x-auto">
          <div className="mr-2 w-full">
            <img
              src="/img/logo.png"
              height={200}
              width={200}
              alt="CherryFlights logo"
              crossOrigin="anonymous"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="text-gray-600 font-semibold text-base w-full">
            e-Ticket Receipt & Itinerary
          </div>
          <div className="flex flex-col items-end w-full">
            <div className="bg-gray-200 p-2 rounded">
              <div className="text-xs">Order ID</div>
              <div className="font-bold text-base">
                {GDSBookingRef || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket information */}
      <div className="p-4 bg-gray-50">
        <p className="text-xs text-gray-600 mb-4">
          Your electronic ticket is stored in our computer reservation system.
          This e-Ticket receipt/itinerary serves as your proof of purchase and
          forms part of your travel contract. You may be required to present
          this receipt to access the airport or to verify your return or onward
          journey.
        </p>
      </div>

      {/* Passenger Information */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-200 p-2 mb-4 flex items-center">
          <h3 className="font-bold text-gray-700 text-xs">
            PASSENGER AND TICKET INFORMATION
          </h3>
        </div>
        {reservation?.Traveler?.map((trav, idx) => (
          <div key={idx} className="border-b pb-2 mb-2">
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">PASSENGER NAME</p>
                <p className="font-semibold text-xs">
                  {trav?.PersonName?.Surname} {trav?.PersonName?.Given}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">E-TICKET NUMBER</p>
                <p className="font-semibold text-xs">
                  {receipts?.map((receipt) => {
                    return receipt?.Document?.map(
                      (doc) =>
                        doc?.TravelerIdentifierRef?.id == trav?.id &&
                        doc?.Number
                    );
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Airline Booking Reference
                </p>
                {othersReceipts?.map((receipt, index) => (
                  <p className="font-semibold text-xs" key={index}>
                    {receipt?.Confirmation?.Locator?.value}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Same Info */}
      <div className="p-4">
        <div className="grid grid-cols-3 p-2 items-center justify-between gap-2 bg-gray-200 text-sm font-semibold text-gray-700 border-t border-gray-200">
          <div className="text-start font-bold text-xs">ISSUE DATE</div>
          <div className="text-start font-bold text-xs">PHONE</div>
          <div className="text-start font-bold text-xs">EMAIL</div>
        </div>
        <div className="grid grid-cols-3 py-3">
          <div className="text-start text-xs font-gotham font-light">
            {formatDate(othersReceipts?.[1]?.dateTime?.split("T")?.[0])}
          </div>
          <div className="text-start text-xs">{fullPhone}</div>
          <div className="text-start text-xs">{email}</div>
        </div>
      </div>

      {/* Travel Information */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-200 p-2 mb-4">
          <h3 className="font-bold text-gray-700 text-xs">
            TRAVEL INFORMATION
          </h3>
        </div>

        {/* Dynamically render all flight segments */}
        {products?.map((product, productIndex) => {
          if (product?.PassengerFlight == null) {
            return;
          }
          const flightSegments = product?.FlightSegment || [];

        return flightSegments?.map((segment, segmentIndex) => {
            const flight = segment?.Flight;
            if (!flight) return null;
            let depMatchedAirport = airports?.filter(
              (airport) =>
                airport?.tpAIRPORT_CODE === flight?.Departure?.location
            );
            let arrMatchedAirport = airports?.filter(
              (airport) => airport?.tpAIRPORT_CODE === flight?.Arrival?.location
            );
            let displayDepAirport;
            let displayArrAirport;
            if (depMatchedAirport?.length) {
              const withNameWithoutAll = depMatchedAirport.find(
                (airport) =>
                  airport?.tpAIRPORT_NAME &&
                  !airport?.tpDescription?.includes("(All Airports)")
              );

              if (withNameWithoutAll) {
                displayDepAirport = withNameWithoutAll.tpAIRPORT_NAME;
              } else {
                const allAirportsWithNoName = depMatchedAirport.find(
                  (airport) =>
                    airport?.tpDescription?.includes("(All Airports)") &&
                    !airport?.tpAIRPORT_NAME
                );

                if (allAirportsWithNoName) {
                  displayDepAirport = allAirportsWithNoName.tpAIRPORT_CITYNAME;
                } else {
                  const fallback = depMatchedAirport.find(
                    (airport) => airport?.tpAIRPORT_CITYNAME
                  );

                  if (fallback) {
                    displayDepAirport = fallback.tpAIRPORT_CITYNAME;
                  }
                }
              }
            }
            if (arrMatchedAirport?.length) {
              const withNameWithoutAll = arrMatchedAirport.find(
                (airport) =>
                  airport?.tpAIRPORT_NAME &&
                  !airport?.tpDescription?.includes("(All Airports)")
              );

              if (withNameWithoutAll) {
                displayArrAirport = withNameWithoutAll.tpAIRPORT_NAME;
              } else {
                const allAirportsWithNoName = arrMatchedAirport.find(
                  (airport) =>
                    airport?.tpDescription?.includes("(All Airports)") &&
                    !airport?.tpAIRPORT_NAME
                );

                if (allAirportsWithNoName) {
                  displayArrAirport = allAirportsWithNoName.tpAIRPORT_CITYNAME;
                } else {
                  const fallback = arrMatchedAirport.find(
                    (airport) => airport?.tpAIRPORT_CITYNAME
                  );

                  if (fallback) {
                    displayArrAirport = fallback.tpAIRPORT_CITYNAME;
                  }
                }
              }
            }

            const segmentBaggage = baggageAllowance?.find(
              (ba) =>
                ba?.SegmentSequenceList &&
                ba?.SegmentSequenceList?.includes(segment.sequence)
            );

            const passengerFlightForSegment = product?.PassengerFlight?.[0];
            const flightProductForSegment =
              passengerFlightForSegment?.FlightProduct?.find(
                (fp) =>
                  fp?.segmentSequence &&
                  fp?.segmentSequence?.includes(segment.sequence)
              ) || FlightProducts;
            const segmentCabin = flightProductForSegment?.cabin || cabin;
            const segmentBrand = flightProductForSegment?.Brand?.name || brand;

            return (
              <div
                key={`${productIndex}-${segmentIndex}`}
                className="mb-6 border border-gray-200 rounded-md overflow-hidden"
              >
                <div className="grid grid-cols-6 gap-2 bg-gray-100 p-2 text-xs font-semibold text-gray-600">
                  <div className="text-xs">FLIGHT</div>
                  <div className="text-xs">DEPART/ARRIVE</div>
                  <div className="text-xs">AIRPORT</div>
                  <div className="text-xs">DURATION</div>
                  <div className="text-xs">CLASS</div>
                  <div className="text-xs">BAGGAGE</div>
                </div>

                <div className={`grid grid-cols-6 gap-y-2`}>
                  <div className="bg-slate-50 h-1/2 px-3 mb-2 py-2">
                    <p className="font-bold text-xs">
                      {flight?.carrier} {flight?.number}
                    </p>
                    <p className="text-xs text-gray-500">
                      Aircraft: {flight?.equipment}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className={`dep bg-slate-50 h-1/2`}>
                      <p className="font-semibold text-xs py-2">
                        {formatDate(flight?.Departure?.date)}
                      </p>
                      <p className="text-xs">
                        {formatTime(flight?.Departure?.time)}
                      </p>
                    </div>
                    <div className="arr">
                      <p className="font-semibold mt-1 text-xs">
                        {formatDate(flight?.Arrival?.date)}
                      </p>
                      <p className="text-xs">
                        {formatTime(flight?.Arrival?.time)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 h-1/2 py-2">
                    <p className="font-semibold overflow-hidden text-xs leading-5 py-0.5 min-h-4">
                      {displayDepAirport}, {flight?.Departure?.location}
                    </p>
                    <p className="text-xs text-gray-500 leading-4">
                      {flight?.Departure?.terminal || ""}
                    </p>
                    <p className="font-semibold mt-1 overflow-hidden text-xs leading-5 py-0.5 min-h-4">
                      {displayArrAirport}, {flight?.Arrival?.location}
                    </p>
                    <p className="text-xs text-gray-500 leading-4">
                      {flight?.Arrival?.terminal || ""}
                    </p>
                  </div>
                  <div className="bg-slate-50 h-1/2 py-2">
                    <p className="font-semibold text-xs">
                      {formatDuration(flight?.duration)}
                    </p>
                  </div>
                  <div className="bg-slate-50 h-1/2 py-2">
                    <p className="font-semibold text-xs">
                      {segmentCabin || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {segmentBrand || ""}
                    </p>
                  </div>
                  <div className="bg-slate-50 h-1/2 px-3 py-2">
                    <p className="font-semibold text-xs">
                      {segmentBaggage?.Text?.[0] || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">CHECKED BAGS</p>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>

      {/* Fare Information */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-200 p-2 mb-4">
          <h3 className="font-bold text-gray-700 text-xs">
            FARE AND ADDITIONAL INFORMATION
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">FARE</p>
                <p className="font-semibold text-xs">
                  {(searchCurrencySymbol || searchCurrencyCode || priceStructure?.currency) + " "}
                  {(() => {
                    const subtotalBase =
                      Number(priceStructure?.adultPriceFC ?? 0) * (priceStructure?.noOfAdults ?? 0) +
                      Number(priceStructure?.childPriceFC ?? 0) * (priceStructure?.noOfChild ?? 0) +
                      Number(priceStructure?.infantPriceFC ?? 0) * (priceStructure?.noOfInfant ?? 0);
                    return formatCurrency(convertPrice(subtotalBase, Number(exchangeRate ?? 1))) || "N/A";
                  })()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">TAXES/FEES/CHARGES</p>
                <p className="font-semibold text-xs">
                  {(searchCurrencySymbol || searchCurrencyCode || priceStructure?.currency) + " "}
                  {(() => {
                    const taxesBase =
                      Number(priceStructure?.adultTaxFC ?? 0) * (priceStructure?.noOfAdults ?? 0) +
                      Number(priceStructure?.childTaxFC ?? 0) * (priceStructure?.noOfChild ?? 0) +
                      Number(priceStructure?.infantTaxFC ?? 0) * (priceStructure?.noOfInfant ?? 0) +
                      Number(priceStructure?.serviceFeeFC ?? 0);
                    return formatCurrency(convertPrice(taxesBase, Number(exchangeRate ?? 1))) || "N/A";
                  })()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">TOTAL</p>
                <p className="font-semibold text-xs">
                  {(searchCurrencySymbol || searchCurrencyCode || priceStructure?.currency) + " "}
                  {formatCurrency(Number(convertPrice((priceStructure?.totalPriceFC ?? 0), Number(exchangeRate ?? 1)))) ||
                    "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="border-l border-gray-200 pl-4">
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-1">
                ADDITIONAL INFORMATION
              </p>
              <p className="text-xs mb-2">
                VALIDATING CARRIER:{" "}
                {offer?.TermsAndConditionsFull?.[0]?.ValidatingAirline?.[0]
                  ?.ValidatingAirline || "N/A"}
              </p>
              {offer?.TermsAndConditionsFull?.[1]?.Restriction?.map(
                (restriction, index) => (
                  <p key={index} className="text-xs text-gray-600">
                    {restriction?.value}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Comments */}
      {/* {reservation?.ReservationComment && (
      )} */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-200 p-2 mb-4">
          <h3 className="font-bold text-gray-700 text-xs">IMPORTANT NOTICES</h3>
        </div>
        <div className="bg-yellow-50 p-3 border-l-4 border-yellow-400 mb-4">
          <p className="text-xs font-medium text-yellow-800">
            <strong className="text-xs">Important:</strong> Check-in desks close
            60 minutes before departure time. Please check with departure
            airport for restrictions on the carriage of liquids, aerosols and
            gels in hand baggage.
          </p>
        </div>
        <div className="space-y-1 text-xs">
          {reservation?.ReservationComment?.map((commentGroup, groupIndex) =>
            commentGroup?.Comment?.map((comment, index) => (
              <p key={`${groupIndex}-${index}`} className="text-xs">
                {comment?.value}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 text-xs text-gray-600 flex items-center justify-end border-t border-gray-200">
        {/* <div
          className="flex items-center hover:text-gray-900 cursor-pointer hide-on-print"
          onClick={reactToPrintFnn}
        >
          <Printer className="w-4 h-4 mr-2" />
          <span>Print this ticket</span>
        </div> */}
        <div className="makeItEnd text-xs">
          © CherryFlights. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default GetTicket;
