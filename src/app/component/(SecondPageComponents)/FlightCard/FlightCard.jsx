"use client";
import React, { useState } from "react";
import { useSignInContext } from '@/providers/SignInStateProvider';
import FlightCardLogo from "@/app/component/(SecondPageComponents)/FlightCardLogo/FlightCardLogo";
import formatCurrency from '@/utils/formatCurrency';
import convertPrice from '@/utils/convertPrice';
import FlightCardFareOption from "@/app/component/(SecondPageComponents)/FlightCardFareOption/FlightCardFareOption";
import { v4 } from "uuid";
import "./FlightCard.css";
import HorizontalTimeline from "../../(ThirdPageComponents)/HorizontalTimeline/HorizontalTimeline";
import { formatDateWithSlashWithoutYear } from "@/utils/formatDateWithSlash";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const FlightCard = ({
  // showFlightDetails,
  // setShowFlightDetails,
  filteredOptions,
  searchCurrencyCode,
  searchTriggered,
  setSearchTriggered,
  setUsersSelectedPrice,
  usersSelectedPrice,
  isReturn,
  isOneWay,
  isMultiCity,
  MCDataLength,
  setFlightsReview,
  flightsReview,
  legsCount,
  setLegsCount,
  userData2,
  setFirstLegData,
  firstLegData,
  dataItem,
  TokenId,
  brandsDataJson,
  airlineLogo,
  airlineName,
  airlineCode,
  flightNumber,
  totalPriceBase,
  exchangeRate = 1,
}) => {
  const { searchCurrencyCode: ctxCode, searchCurrencySymbol, exchangeRate: providerExchangeRate } = useSignInContext();
  let settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1290,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  const [disableButton, setDisableButton] = useState(false);
  const [enableFairOptions, setEnableFairOptions] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const setFirstLegDataHandler = () => {
    setFirstLegData({
      SearchId: dataItem.tracid,
      FlightId: dataItem.keyData,
      TokenId: dataItem.tokenId,
      ProductId: dataItem.productId,
      uGUID: v4(),
      FlightType: dataItem.flightType,
      LegNo: legsCount + 1,
      Criteria: JSON.stringify(userData2),
      FlightCriteria: isMultiCity
        ? [...firstLegData.FlightCriteria, dataItem.flightSegment]
        : dataItem.flightSegment,
    });
  };

  // Separate function for handling flight expansion (UI only)
  const handleFlightExpansion = (e) => {
    e.stopPropagation();
    // Only toggle UI state, do NOT update flight selection state
    setEnableFairOptions(!enableFairOptions);
  };

  return (
    <div
      className={`border sm:border-2 border-slate-300 rounded !max-w-full font-gotham shadow-sm CT:shadow-none`}
      onClick={handleFlightExpansion}
    >
      <div
        className={`upperCard w-full rounded-xl flex flex-col CT:flex-row items-center justify-between font-gotham ${
          enableFairOptions && "border-b-2 border-slate-300"
        }  rounded-b-none`}
        // onClick={(e) => {
        //   e.stopPropagation();
        // }}
      >
        <div className="flightCardLogo hidden CT:flex flex-col items-start px-3 xl:px-4 xl:w-[220px] min-h-full font-gotham">
          <FlightCardLogo
            airlineCode={airlineCode}
            airlineLogo={airlineLogo}
            airlineName={airlineName}
            flightNumber={flightNumber}
          />
        </div>
        <div className="flightCardContent flex flex-col items-center w-full px-6 py-4 font-gotham">
          <HorizontalTimeline
            // showFlightDetails={showFlightDetails}
            // setShowFlightDetails={setShowFlightDetails}
            dataItem={dataItem && dataItem?.flightSegment}
            duration={dataItem && dataItem?.duration}
            depTime={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[0].depTime
            }
            durationSize="text-sm CT:text-base"
            depCityName={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[0].depCityName
            }
            depDate={
              dataItem &&
              dataItem?.flightSegment &&
              formatDateWithSlashWithoutYear(dataItem?.flightSegment[0].depDate)
            }
            depAirportName={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[0].depAirportName
            }
            depCity={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[0].depCity
            }
            arrAirportName={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[dataItem?.flightSegment.length - 1]
                .arrAirportName
            }
            arrCity={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[dataItem?.flightSegment.length - 1]
                .arrCity
            }
            arrDate={
              dataItem &&
              dataItem?.flightSegment &&
              formatDateWithSlashWithoutYear(
                dataItem?.flightSegment[dataItem?.flightSegment.length - 1]
                  .arrDate
              )
            }
            arrTime={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[dataItem?.flightSegment.length - 1]
                .arrTime
            }
            arrCityName={
              dataItem &&
              dataItem?.flightSegment &&
              dataItem?.flightSegment[dataItem?.flightSegment.length - 1]
                .arrCityName
            }
          ></HorizontalTimeline>
        </div>
        <div
          className={`flightCardButton w-full CT:w-auto flex flex-row gap-x-4 CT:flex-col justify-center items-center CT:border-l-2 CT:border-l-slate-300 min-h-full xl:min-w-[180px] px-2 xl:px-4 py-4 CT:py-10 font-gotham`}
        >
          <div className="w-1/2 inline-block CT:hidden">
            <FlightCardLogo
              airlineCode={airlineCode}
              airlineLogo={airlineLogo}
              airlineName={airlineName}
              flightNumber={flightNumber}
            />
          </div>
          <button className="bg-orange-500 font-gotham rounded font-bold px-1 sm:px-4 CT:px-7 xl:px-12 py-2 sm:py-3 text-white text-[10px] sm:text-xs CT:text-sm lg:text-base">
            {/* Prefer provider symbol, then local prop code, then provider code */}
            {(searchCurrencySymbol || ctxCode || searchCurrencyCode) + " "}
            {(() => {
              const base = Number(totalPriceBase || 0);
              const ex = typeof exchangeRate !== 'undefined' ? exchangeRate : providerExchangeRate || 1;
              const converted = convertPrice(base, ex);
              return formatCurrency(converted);
            })()}
          </button>
          <p className="hidden CT:inline-block capitalize font-gotham mt-3 text-sm text-slate-600 w-full text-center">
            {isReturn
              ? "Round Trip Fare"
              : isOneWay
              ? "One Way Fare"
              : isMultiCity
              ? "Multicity Fare"
              : ""}
          </p>
        </div>
      </div>
      <div
        className={`lowerPart ${
          enableFairOptions ? "flex" : "hidden"
        } flex-col py-5 px-4 w-full overflow-hidden font-gotham`}
      >
        <h2 className="mb-2 CT:mb-4 text-lg CT:text-xl font-gotham">
          Select a fare options
        </h2>
        <div className="flightCardFareOptionContainer flex items-center">
          <div
            className="flightCardFareOptions w-full flex gap-2 justify-center overflow-hidden font-gotham"
            onClick={(e) => e.stopPropagation()}
          >
            {brandsDataJson && (
              <Slider
                {...settings}
                slidesToShow={3}
                className={`w-full lg:w-[90%] px-5 lg:px-10`}
                onClick={(e) => e.stopPropagation()}
              >
                {brandsDataJson.map((brand, i) => {
                  return (
                    <div className="p-2" key={i}>
                      <FlightCardFareOption
                        searchCurrencyCode={searchCurrencyCode}
                        searchTriggered={searchTriggered}
                        setSearchTriggered={setSearchTriggered}
                        setUsersSelectedPrice={setUsersSelectedPrice}
                        setButtonLoading={setButtonLoading}
                        buttonLoading={buttonLoading}
                        setDisableButton={setDisableButton}
                        disableButton={disableButton}
                        MCDataLength={MCDataLength}
                        TokenId={TokenId}
                        brand={brand}
                        dataItem={dataItem}
                        setFirstLegDataHandler={setFirstLegDataHandler}
                        setFirstLegData={setFirstLegData}
                        firstLegData={firstLegData}
                        flightsReview={flightsReview}
                        setFlightsReview={setFlightsReview}
                        priceStructure={
                          brand.keyData === "Root0"
                            ? dataItem.priceStructure
                            : brand.priceStructure
                        }
                        CardPriceBase={
                          brand.keyData === "Root0"
                            ? Math.ceil(
                                Number(dataItem.priceStructure.totalPriceFC) -
                                  usersSelectedPrice
                              )
                            : Math.ceil(
                                Number(brand.priceStructure.totalPriceFC) -
                                  usersSelectedPrice
                              )
                        }
                        exchangeRate={exchangeRate}
                        isReturn={isReturn}
                        isOneWay={isOneWay}
                        isMultiCity={isMultiCity}
                        setLegsCount={setLegsCount}
                        legsCount={legsCount}
                        refundRules={
                          brand.keyData === "Root0"
                            ? dataItem.rules
                            : brand.refundRules
                        }
                        bagRules={
                          brand.keyData === "Root0"
                            ? dataItem.bagrules
                            : brand.bagRules
                        }
                        changeRules={
                          brand.keyData === "Root0"
                            ? dataItem.rules
                            : brand.changeRules
                        }
                        keyData={
                          brand.keyData === "Root0"
                            ? dataItem.keyData
                            : brand.keyData
                        }
                        Title={brand.brandName}
                        Check_in="Check-in Baggage"
                        Check_in_Value={
                          brand.bagTitle == "Not Offered"
                            ? "See Details"
                            : brand.keyData == "Root0"
                            ? "See Details"
                            : brand.bagTitle
                        }
                        Cancellation={"Cancellation"}
                        Cancellation_Value="Penalities Apply"
                        Modification="Modification"
                        Modification_Value="Penalities Apply"
                        Seat="Seat"
                        Seat_Value={brand.seatTitle}
                        Meal="Meal"
                        Meal_Value={brand.mealTitle}
                      ></FlightCardFareOption>
                    </div>
                  );
                })}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
