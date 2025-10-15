"use client";
import React, { useState, useMemo } from "react";
import HorizontalTimeline from "../HorizontalTimeline/HorizontalTimeline";
import { formatTime } from "@/utils/formatTime";
import convertPrice from '@/utils/convertPrice';
import { useRouter } from "next/navigation";
import { useSignInContext } from '@/providers/SignInStateProvider';
import {
  formatDateWithSlashWithoutYear,
  formatDateWithSlash,
} from "@/utils/formatDateWithSlash";
import Image from "next/image";
import { Button, Timeline, Tooltip } from "antd";
import ProductCardDetails from "./ProductCardDetails";
import "./ProductCardDetails.css";
import { MdOutlineInfo } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import formatCurrency from '@/utils/formatCurrency';
const FlightReviewCard = ({
  priceStructure,
  currency,
  exchangeRate = 1,
  showFlightDetails,
  setShowFlightDetails,
  loading,
  flightLegs,
  flattenedDepartingItems,
  baggageAllowance,
  flightReviewData,
  Airports,
  currentStep,
  nextStep,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [productId, setProductId] = useState("");
  const [showProductCardDetails, setShowProductCardDetails] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState("");
  const router = useRouter();
  const { searchCurrencyCode: ctxCode, searchCurrencySymbol } = useSignInContext();
  const currencyDisplayLocal = searchCurrencySymbol || ctxCode || currency || (priceStructure && priceStructure.currency) || 'PKR';
  let BasePrice = flightReviewData.OfferListResponse.OfferID[0].Price.Base;
  let AdultPrice =
    flightReviewData.OfferListResponse.OfferID[0].Price.PriceBreakdown.find(
      (price) => price.requestedPassengerType == "ADT"
    );
  let CNNPrice =
    flightReviewData.OfferListResponse.OfferID[0].Price.PriceBreakdown.find(
      (price) => price.requestedPassengerType == "CNN"
    );
  let INFPrice =
    flightReviewData.OfferListResponse.OfferID[0].Price.PriceBreakdown.find(
      (price) => price.requestedPassengerType == "INF"
    );
  let TotalTaxesPrice =
    flightReviewData.OfferListResponse.OfferID[0].Price.TotalTaxes;
  const handleFlightLegClick = (index, fLeg) => {
    if (activeCardIndex === index) {
      setActiveCardIndex(null);
    } else {
      const response = flattenedDepartingItems(
        fLeg[0]?.Departure?.location,
        fLeg[fLeg.length - 1]?.Arrival?.location
      );
      setTimelineData([].concat(...response));
      setActiveCardIndex(index);
    }
  };
  const renderFlightLegs = useMemo(() => {
    return flightLegs.map((fLeg, index) => {
      const legDuration = fLeg.reduce(
        (sum, flight) => sum + Number(flight.durationInMinutes),
        0
      );
      let stopTime = fLeg.reduce(
        (sum, flight) => sum + Number(flight.stopTime),
        0
      );
      // fLeg[0]?.Departure.location
      let depCityName = Airports?.find(
        (airport, idx) => airport.tpAIRPORT_CODE === fLeg[0]?.Departure.location
      );
      let arrCityName = Airports?.find(
        (airport) =>
          airport.tpAIRPORT_CODE === fLeg[fLeg.length - 1]?.Arrival.location
      );
      return (
        <div key={index} className="w-full">
          <div className="mainDiv w-full border lg:border rounded">
            <div
              className={`upperPart ${
                activeCardIndex === index ? "border-b" : null
              }`}
            >
              <div className="titleBar flex justify-between items-center bg-orange-500 px-2 lg:px-5 py-3 lg:py-5 text-white">
                <div className="legTitle hidden sm:inline-block font-bold text-sm md:text-base lg:text-lg">
                  {`${depCityName?.tpAIRPORT_CITYNAME} (${
                    fLeg?.[0]?.Departure.location
                  }) -
                  (${fLeg?.[fLeg.length - 1]?.Arrival.location}) ${
                    arrCityName?.tpAIRPORT_CITYNAME
                  }`}
                </div>
                <div className="legTitle inline-block sm:hidden font-bold text-sm md:text-base lg:text-lg">
                  {`${depCityName?.tpAIRPORT_CITYNAME} -
                  ${arrCityName?.tpAIRPORT_CITYNAME}`}
                </div>
                <div className="date font-bold text-sm md:text-base lg:text-lg">
                  {formatDateWithSlash(fLeg[0]?.Departure.dateUK)}
                </div>
              </div>
              <div
                className="upperBody flex flex-col justify-center"
                onClick={() => {
                  handleFlightLegClick(index, fLeg);
                }}
              >
                <div className="px-5 lg:px-8 py-2 lg:py-5 flex items-center">
                  <div className="logoPart pr-[70px] hidden lg:flex flex-col items-center">
                    <Image
                      unoptimized
                      alt="Logo"
                      src={`/img/AirlineLogo/${fLeg[0]?.carrier}.png`}
                      width={105}
                      height={105}
                      priority
                    />
                    <div className="airline">{fLeg[0]?.carrier}</div>
                  </div>
                  <div className="middlePart flex items-center w-full relative h-auto">
                    <div className="timeline flex w-full overflow-x-hidden">
                      <HorizontalTimeline
                        showFlightDetails={showFlightDetails}
                        setShowFlightDetails={setShowFlightDetails}
                        dataItem={fLeg}
                        duration={legDuration + stopTime}
                        depTime={formatTime(
                          fLeg[0]?.Departure?.time?.toString()
                        )}
                        depCityName={depCityName?.tpAIRPORT_CITYNAME}
                        depCity={fLeg[0]?.Departure.location}
                        depDate={formatDateWithSlashWithoutYear(
                          fLeg[0]?.Departure.dateUK
                        )}
                        arrCity={fLeg[fLeg.length - 1]?.Arrival.location}
                        arrCityName={arrCityName?.tpAIRPORT_CITYNAME}
                        arrDate={formatDateWithSlashWithoutYear(
                          fLeg[fLeg.length - 1]?.Arrival.dateUK
                        )}
                        arrTime={formatTime(
                          fLeg?.[fLeg.length - 1]?.Arrival.time
                        )}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className={`text-blue-400 hover:text-blue-500 text-[10px] lg:text-xs cursor-pointer font-gotham hidden sm:flex items-center justify-center gap-1 py-1`}
                  onClick={() => handleFlightLegClick(index, fLeg)}
                >
                  <span>
                    <MdOutlineInfo className=" text-base lg:text-lg" />
                  </span>
                  More Details
                </button>
              </div>
              <div className="border-t px-2 lg:px-8 py-2 lg:py-4 flex w-full justify-between items-center">
                <p
                  className="text-blue-400 hover:text-blue-500 text-[10px] lg:text-xs cursor-pointer font-gotham flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailsTitle("POLICIES");
                    setShowProductCardDetails(true);
                    setProductId(fLeg?.[0]?.productId);
                  }}
                >
                  <span>
                    <MdOutlineInfo className=" text-base lg:text-lg" />
                  </span>
                  Policies
                </p>
              </div>
            </div>
            <div
              className={`fLegDetails items-center w-full px-20 py-20 overflow-x-hidden mx-auto p-4 bg-white shadow-lg rounded-lg ${
                activeCardIndex === index ? "hidden sm:flex" : "hidden"
              }`}
            >
              <Timeline
                items={timelineData}
                style={{
                  width: "90%",
                  display: "block",
                  margin: "0 auto",
                  padding: "0",
                }}
              />
            </div>
          </div>
        </div>
      );
    });
  }, [flightLegs, activeCardIndex, timelineData]);

  return (
    <>
      <div
        className={`flightLegs px-4 md:px-9 mt-8 md:mt-20 rounded-md clearfix font-gotham`}
      >
        {!loading && flightLegs.length > 0 ? (
          <div className="float-left w-full lg:w-[70%]">
            <div className="flightCards flex flex-col items-center gap-y-5 w-full">
              {renderFlightLegs}
            </div>
          </div>
        ) : (
          ""
        )}
        {!loading &&
          (flightLegs.length > 0 ? (
            <div className="flex flex-col float-right">
              <div className="flightDetails rounded min-w-[18%] lg:min-w-[20%] xl:min-w-[22%] px-5 py-6 hidden lg:flex gap-y-2 flex-col border shadow-sm xl:w-[290px] w-[280px] bg-white">
                <p className="font-gotham text-lg mb-2 font-bold">
                  {flightReviewData &&
                  flightReviewData.OfferListResponse.OfferID[0].Product
                    .length === 1
                    ? "One Way Trip"
                    : flightReviewData &&
                      flightReviewData.OfferListResponse.OfferID[0].Product
                        .length === 2
                    ? "Round Trip"
                    : flightReviewData &&
                      flightReviewData.OfferListResponse.OfferID[0].Product
                        .length === 1
                    ? "Multicity Trip"
                    : null}
                </p>

                <div className="legDetails flex flex-col gap-6">
                  {/* {flightReviewData &&
                  flightReviewData.OfferListResponse.OfferID[0].Product.map(
                    (prodItem, idx) => {
                      return (
                        <div
                          className="text-sm text-black font-gotham font-light flex items-center justify-between gap-10 border-b pb-3 transition-all duration-300 ease-in-out"
                          key={idx}
                          onClick={() => {
                            setShowProductCardDetails(true);
                            setProductId(prodItem.id);
                          }}
                        >
                          <div className="flex flex-col gap-y-1">
                            <p className="cursor-pointer tracking-wider font-bold text-justify">
                              {
                                prodItem.FlightSegment[0].Flight.Departure
                                  .locationDescription
                              }{" "}
                              <span className="uppercase">to</span>{" "}
                              {
                                prodItem.FlightSegment[
                                  prodItem.FlightSegment.length - 1
                                ].Flight.Arrival.locationDescription
                              }
                            </p>
                            <div className="text-sm w-full px-4 py-4">
                              <p className="text-md font-gotham font-light flex justify-between items-center text-blue-400 cursor-pointer">
                                Baggage Details
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )} */}
                  <div className="flex flex-col gap-y-1">
                    <div className="pb-3 flex flex-col gap-y-2">
                      <p className="Price w-full font-gotham font-light flex justify-between">
                        Fare Per Adult{" "}
                        <span className="text-sm font-semibold">
                          {currencyDisplayLocal}{" "}
                          {formatCurrency(
                            convertPrice(
                              Number(priceStructure?.adultPriceFC ?? 0) + Number(priceStructure?.adultTaxFC ?? 0),
                              Number(exchangeRate ?? 1)
                            )
                          )}
                        </span>
                      </p>
                      {Number(priceStructure?.childPriceFC) +
                        Number(priceStructure?.childTaxFC) !=
                        0 && (
                        <p className="Price w-full font-gotham font-light flex justify-between">
                          Fare Per Child{" "}
                          <span className="text-sm font-semibold">
                            {/* {flightReviewData &&
                              flightReviewData.OfferListResponse.OfferID[0]
                                .Price.CurrencyCode.value}{" "} */}
                            {currencyDisplayLocal}{" "}
                            {formatCurrency(
                              convertPrice(
                                Number(priceStructure?.childPriceFC ?? 0) + Number(priceStructure?.childTaxFC ?? 0),
                                Number(exchangeRate ?? 1)
                              )
                            )}
                          </span>
                        </p>
                      )}
                      {Number(priceStructure?.infantPriceFC) +
                        Number(priceStructure?.infantTaxFC) !=
                        0 && (
                        <p className="Price w-full font-gotham font-light flex justify-between">
                          Fare Per Infant{" "}
                          <span className="text-sm font-semibold">
                            {/* {flightReviewData &&
                              flightReviewData.OfferListResponse.OfferID[0]
                                .Price.CurrencyCode.value}{" "} */}
                            {currencyDisplayLocal}{" "}
                            {formatCurrency(
                              convertPrice(
                                Number(priceStructure?.infantPriceFC ?? 0) + Number(priceStructure?.infantTaxFC ?? 0),
                                Number(exchangeRate ?? 1)
                              )
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                    <h3 className="font-gotham text-md uppercase">
                      Grand Total
                    </h3>
                    <div className="py-3 flex flex-col gap-y-2">
                      <p className="Price w-full font-gotham font-light flex justify-between">
                        Base Fare{" "}
                        <span className="text-sm font-semibold">
                          {/* {flightReviewData &&
                            flightReviewData.OfferListResponse.OfferID[0].Price
                              .CurrencyCode.value}{" "} */}
                          {currencyDisplayLocal}{" "}
                          {formatCurrency(
                            convertPrice(
                              (Number(priceStructure?.adultPriceFC ?? 0) * (priceStructure?.noOfAdults ?? 0)) +
                                (Number(priceStructure?.childPriceFC ?? 0) * (priceStructure?.noOfChild ?? 0)) +
                                (Number(priceStructure?.infantPriceFC ?? 0) * (priceStructure?.noOfInfant ?? 0)),
                              Number(exchangeRate ?? 1)
                            )
                          )}
                        </span>
                      </p>
                      <p className="Price w-full font-gotham font-light flex justify-between">
                        Total Taxes{" "}
                        <span className="text-sm font-semibold">
                          {/* {flightReviewData &&
                            flightReviewData.OfferListResponse.OfferID[0].Price
                              .CurrencyCode.value}{" "} */}
                          {currencyDisplayLocal}{" "}
                          {formatCurrency(
                            convertPrice(
                              (Number(priceStructure?.adultTaxFC ?? 0) * (priceStructure?.noOfAdults ?? 0)) +
                                (Number(priceStructure?.childTaxFC ?? 0) * (priceStructure?.noOfChild ?? 0)) +
                                (Number(priceStructure?.infantTaxFC ?? 0) * (priceStructure?.noOfInfant ?? 0)),
                              Number(exchangeRate ?? 1)
                            )
                          )}
                        </span>
                      </p>
                      <p className="Price w-full font-gotham font-light flex justify-between">
                        Service Fee{" "}
                        <span className="text-sm font-semibold">
                          {currencyDisplayLocal}{" "}
                          {formatCurrency(
                            convertPrice(Number(priceStructure?.serviceFeeFC ?? 0), Number(exchangeRate ?? 1))
                          )}
                        </span>
                      </p>
                      <p className="Price w-full font-gotham font-light flex justify-between">
                        Grand total{" "}
                        <span className="text-sm font-semibold">
                          {currencyDisplayLocal}{" "}
                          {formatCurrency(
                            convertPrice(Number(priceStructure?.totalPriceFC ?? 0), Number(exchangeRate ?? 1))
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flightDetails rounded min-w-[18%] xl:min-w-[22%] hidden lg:flex gap-y-2 flex-col border-2 xl:w-[290px] w-[280px] bg-white float-right mt-10">
                <Image
                  src="/Advertisement-banner/Advertisement-banner.jpeg"
                  width={290}
                  height={290}
                  alt="Advertisement banner"
                  className="w-auto h-auto"
                />
              </div>
            </div>
          ) : (
            ""
          ))}
        <div
          className={`button w-full ${
            currentStep === 0 ? "flex" : "hidden"
          } items-center justify-center gap-5 py-5 font-gotham border border-t-0 w-full lg:w-[70%]`}
        >
          <Tooltip
            title={
              currentStep == 0 &&
              flightReviewData?.OfferListResponse?.Result?.Error &&
              flightReviewData?.OfferListResponse?.Result?.Error[0]?.Message &&
              "Please select your flight again"
            }
            className="w-full flex items-center justify-center flex-col sm:flex-row gap-y-1"
          >
            <Button
              className={`
                        ${
                          flightReviewData?.OfferListResponse?.Result
                            ?.Error?.[0]?.Message || currentStep === 0
                            ? "!inline-flex"
                            : "!hidden"
                        }
                        !items-center !justify-center !py-2 md:!py-5 !text-xs md:!text-sm !align-middle !rounded 
                        ${
                          flightReviewData?.OfferListResponse?.Result
                            ?.Error?.[0]?.Message
                            ? "!bg-orange-500 !text-white"
                            : "!bg-white !text-orange-500 !border !border-orange-500"
                        } !cursor-pointer !font-gotham !font-normal bookFlightAgain sm:mr-4
                         `}
              onClick={() => router.push("/")}
            >
              Book your flight again
            </Button>
            <Button
              // loading={isLoading}
              className={`${
                flightReviewData?.OfferListResponse?.Result?.Error?.[0]?.Message
                  ? "!hidden"
                  : "!inline-flex"
              } !items-center !justify-center !py-2 md:!py-5 !text-xs md:!text-sm !align-middle !rounded !bg-orange-500 !text-white !font-semibold !cursor-pointer hover:!border !font-gotham`}
              disabled={
                flightReviewData?.OfferListResponse?.Result?.Error &&
                flightReviewData?.OfferListResponse?.Result?.Error[0]?.Message
              }
              onClick={nextStep}
            >
              Continue to Passenger
            </Button>
            {/* </div> */}
          </Tooltip>
          <Toaster
            toastOptions={{
              success: {
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          ></Toaster>
        </div>
      </div>
      {showProductCardDetails && (
        <ProductCardDetails
          priceStructure={priceStructure}
          currency={currency}
          detailsTitle={detailsTitle}
          productId={productId}
          flightReviewData={flightReviewData}
          baggageAllowance={baggageAllowance}
          setShowProductCardDetails={setShowProductCardDetails}
          loading={loading}
          showProductCardDetails={showProductCardDetails}
          flightLegs={flightLegs}
          AdultPrice={AdultPrice}
          CNNPrice={CNNPrice}
          INFPrice={INFPrice}
          TotalTaxesPrice={TotalTaxesPrice}
          BasePrice={BasePrice}
        />
      )}
    </>
  );
};

export default FlightReviewCard;
