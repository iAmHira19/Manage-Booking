import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import "./ProductCardDetails.css";
import { Skeleton } from "antd";

const ProductCardDetails = ({
  priceStructure,
  currency,
  productId: id,
  flightReviewData,
  setShowProductCardDetails,
  detailsTitle,
  loading,
  flightLegs,
  AdultPrice,
  CNNPrice,
  INFPrice,
  TotalTaxesPrice,
  BasePrice,
}) => {
  // Baggage details
  const [baggageAllowance, setBaggageAllowance] = useState([]);
  const [baggageAllowanceLocal, setBaggageAllowanceLocal] = useState([]);
  const [allPassengerTypes, setAllPassengerTypes] = useState([]);
  const [passengerAllowances, setPassengerAllowances] = useState([]);
  const [showBg, setShowBg] = useState(false);
  const [closeCardDetails, setCloseCardDetails] = useState(false);
  const [error, setError] = useState(null);
  const [restriction, setRestriction] = useState([]);
  const [isEven, setIsEven] = useState(false);

  useEffect(() => {
    const numberOnly = id.replace(/\D/g, "");
    numberOnly % 2 === 0 ? setIsEven(true) : setIsEven(false);
  }, [id]);

  // Safely extract baggage allowance from API response
  useEffect(() => {
    try {
      const termsAndConditions =
        flightReviewData?.OfferListResponse?.OfferID?.[0]
          ?.TermsAndConditionsFull?.[0];

      if (termsAndConditions && termsAndConditions.BaggageAllowance) {
        setBaggageAllowance(termsAndConditions.BaggageAllowance);
        setRestriction(termsAndConditions.Restriction);
      } else {
        // If BaggageAllowance is not available in API response, try to use the provided JSON directly
        if (Array.isArray(flightReviewData)) {
          const firstItem = flightReviewData[0];
          if (firstItem?.BaggageAllowance) {
            setBaggageAllowance(firstItem.BaggageAllowance);
          } else {
            throw new Error("No baggage allowance data found");
          }
        } else {
          throw new Error("Invalid data format");
        }
      }
    } catch (err) {
      console.error("Error setting baggage allowance:", err);
      setError("Unable to load baggage information");
    }
  }, [flightReviewData]);

  // Filter baggage allowances for the selected product
  useEffect(() => {
    if (!baggageAllowance || !baggageAllowance.length) return;

    try {
      const filteredAllowances = baggageAllowance.filter((bAllow) => {
        // Check if ProductRef is an array or string and handle accordingly
        const productRefs = Array.isArray(bAllow?.ProductRef)
          ? bAllow.ProductRef
          : [bAllow?.ProductRef];

        return (
          productRefs.includes(id) &&
          bAllow?.BaggageItem?.[0]?.BaggageFee?.value === 0
        );
      });
      setBaggageAllowanceLocal(filteredAllowances);
    } catch (err) {
      console.error("Error filtering baggage allowances:", err);
      setError("Error processing baggage data");
    }
  }, [baggageAllowance, id]);

  // Extract unique passenger types
  useEffect(() => {
    if (!baggageAllowanceLocal || !baggageAllowanceLocal.length) return;

    try {
      const passengerTypes = [
        ...new Set(
          baggageAllowanceLocal.flatMap(
            (item) => item?.passengerTypeCodes || []
          )
        ),
      ];
      setAllPassengerTypes(passengerTypes);
    } catch (err) {
      console.error("Error extracting passenger types:", err);
    }
  }, [baggageAllowanceLocal]);

  // Process baggage allowances for each passenger type
  useEffect(() => {
    if (!allPassengerTypes.length || !baggageAllowanceLocal.length) return;

    try {
      const allowances = allPassengerTypes.map((passengerType) => {
        // Find free checked bags for this passenger type
        const checkedBags = baggageAllowanceLocal.filter(
          (item) =>
            item?.baggageType?.includes("CheckedBag") &&
            item?.passengerTypeCodes?.includes(passengerType) &&
            item?.BaggageItem?.[0]?.BaggageFee?.value === 0
        );
        const checkedBagCount = checkedBags.length;

        // Extract baggage weight information safely
        const checkedBagWeight =
          checkedBags
            .map((bag) => {
              if (!bag?.BaggageItem?.[0]?.Text) return "N/A";

              const weightMatch = bag.BaggageItem[0].Text.match(/(\d+)KG/);
              return weightMatch ? weightMatch[1] : "N/A";
            })
            .filter((weight) => weight !== "N/A")[0] || "N/A";
        // Find carry-on items
        const carryOnItems = baggageAllowanceLocal.filter(
          (item) =>
            item?.baggageType?.includes("CarryOn") &&
            item?.passengerTypeCodes?.includes(passengerType) &&
            item?.BaggageItem?.[0]?.BaggageFee?.value === 0
        );
        const carryOnCount = carryOnItems.length;

        // Extract carry-on weight information safely
        let carryOnWeight = "N/A";
        if (
          carryOnItems.length > 0 &&
          carryOnItems[0]?.BaggageItem?.[0]?.Text
        ) {
          const weightMatch =
            carryOnItems[0].BaggageItem[0].Text.match(/(\d+)KG/);
          carryOnWeight = weightMatch ? weightMatch[1] : "N/A";
        }

        // Get descriptions safely
        const description = checkedBags
          .map(
            (bag) => bag?.BaggageItem?.[0]?.Text || "No description available"
          )
          .filter(Boolean);
        const carryOnDescriptions = carryOnItems.map(
          (carryOnItem) =>
            carryOnItem?.BaggageItem?.[0]?.Text || "No description available"
        );
        return {
          passengerType,
          checkedBaggage:
            checkedBagCount > 0 && checkedBagWeight !== "N/A"
              ? `${checkedBagCount}PCs x ${checkedBagWeight}KG`
              : checkedBagCount > 0
              ? `${checkedBagCount}PCs`
              : "0PCs",
          carryOn:
            carryOnCount > 0 && carryOnWeight !== "N/A"
              ? `${carryOnCount}PCs x ${carryOnWeight}KG`
              : carryOnCount > 0
              ? `${carryOnCount}PCs`
              : "0PCs",
          checkedDescription: description.length
            ? description
            : ["No description available"],
          carryOnDescriptions: carryOnDescriptions.length
            ? carryOnDescriptions
            : ["No description available"],
          charges: "Included",
        };
      });

      setPassengerAllowances(allowances);
    } catch (err) {
      console.error("Error processing passenger allowances:", err);
      setError("Error processing baggage allowances");
    }
  }, [allPassengerTypes, baggageAllowanceLocal]);

  // Animation effects
  useEffect(() => {
    setTimeout(() => {
      setShowBg(true);
    }, 30);
  }, []);

  useEffect(() => {
    if (closeCardDetails) {
      setShowBg(false);
      setTimeout(() => {
        setShowProductCardDetails(false);
      }, 700);
    }
  }, [closeCardDetails, setShowProductCardDetails]);

  // Get passenger type display name
  const getPassengerTypeDisplay = (type) => {
    switch (type) {
      case "ADT":
        return "Adult";
      case "CNN":
        return "Child";
      case "INF":
        return "Infant";
      default:
        return type;
    }
  };
  const normalizedRestriction = (item) => {
    if (!item) return;

    if (item.includes("/")) {
      return item
        .split("/")
        .map((part) => {
          if (part === "FLT") return "Flight";
          if (part === "CNX") return "Cancel";
          if (part === "CHG" || part === "CHNG") return "Change";
          return part;
        })
        .join("/");
    }

    return item;
  };

  return (
    <div
      className="w-full h-full fixed top-0 left-0 right-0 bottom-0 z-50"
      onClick={() => {
        setCloseCardDetails(true);
      }}
    >
      <div
        className={`bg-white ${
          detailsTitle === "Flight Details"
            ? "w-full lg:w-4/5"
            : "w-full lg:w-4/5"
        } absolute p-2 py-8 lg:p-8 h-screen overflow-y-scroll lg:h-auto flex items-center justify-center flex-col gap-y-6 lg:gap-y-12 transition-all duration-1000 ${
          isEven
            ? "lg:rounded-tl-3xl lg:rounded-bl-3xl"
            : "lg:rounded-tr-3xl lg:rounded-br-3xl"
        } top-1/2  transform -translate-y-1/2 ${
          showBg
            ? isEven
              ? "right-0"
              : "left-0"
            : isEven
            ? "-right-[80%]"
            : "-left-[80%]"
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full flex items-center justify-between">
          <h3 className="text-center w-full font-gotham text-sm lg:text-base">
            {detailsTitle}
          </h3>
          <IoClose
            // size={20}
            className="cursor-pointer text-sm lg:text-[20px]"
            onClick={() => {
              setCloseCardDetails(true);
            }}
          />
        </div>

        <div className="baggageAllowance flex flex-col gap-y-5 w-full">
          {error ? (
            <div className="text-red-500 font-medium text-center py-4">
              {error}
            </div>
          ) : passengerAllowances.length === 0 ? (
            <div className="text-center py-4">
              Loading baggage information...
            </div>
          ) : (
            <>
              {/* Table Container with Horizontal Scroll */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                  {" "}
                  {/* Minimum width to prevent excessive shrinking */}
                  <table className="w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                          Passenger Type
                        </th>
                        <th className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                          Check-In Baggage
                        </th>
                        <th className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                          Carry-On
                        </th>
                        <th className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                          Check-In Description
                        </th>
                        <th className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                          CarryOn Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengerAllowances.map((allowance, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-gray-50" : ""}
                        >
                          <td className="py-1 lg:py-2 px-2 lg:px-4 border font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap">
                            {getPassengerTypeDisplay(allowance.passengerType)}
                          </td>
                          <td className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                            {allowance.checkedBaggage}
                          </td>
                          <td className="py-1 lg:py-2 px-2 lg:px-4 border text-xs sm:text-sm lg:text-base whitespace-nowrap">
                            {allowance.carryOn}
                          </td>
                          <td className="py-1 lg:py-2 px-2 lg:px-4 border text-xs lg:text-sm">
                            <div className="max-w-[120px] sm:max-w-[150px]">
                              {allowance.checkedDescription.map((desc, i) => (
                                <div key={i} className="break-words">
                                  {desc}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-1 lg:py-2 px-2 lg:px-4 border text-xs lg:text-sm">
                            <div className="max-w-[120px] sm:max-w-[150px]">
                              {allowance.carryOnDescriptions.map((desc, i) => (
                                <div key={i} className="break-words">
                                  {desc}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="font-gotham text-xs sm:text-sm lg:text-md">
                Restriction: <br />
                <span className="font-light">
                  {!restriction
                    ? "No data available"
                    : restriction?.map((item, index) => (
                        <React.Fragment key={index}>
                          {normalizedRestriction(item?.value)}
                          <br />
                        </React.Fragment>
                      ))}
                </span>
              </p>
              {!loading ? (
                flightLegs.length > 0 ? (
                  <div className="flightDetails rounded px-2 py-4 lg:hidden flex gap-y-2 flex-col border bg-white w-full sm:max-w-72">
                    <p className="font-gotham text-sm sm:text-sm mb-1 font-normal">
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
                      <div className="flex flex-col">
                        <div className="pb-2 flex flex-col gap-y-2">
                          <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                            Fare Per Adult{" "}
                            <span className="text-xs sm:text-sm font-light">
                              {currency}{" "}
                              {Math.ceil(
                                Number(priceStructure?.adultPrice ?? 0) +
                                  Number(priceStructure?.adultTax ?? 0)
                              ).toLocaleString("en-US")}
                            </span>
                          </p>
                          {Number(priceStructure?.childPrice) +
                            Number(priceStructure?.childTax) !=
                            0 && (
                            <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                              Fare Per Child{" "}
                              <span className="text-xs sm:text-sm font-light">
                                {currency}{" "}
                                {Math.ceil(
                                  Number(priceStructure?.childPrice ?? 0) +
                                    Number(priceStructure?.childTax ?? 0)
                                ).toLocaleString("en-US")}
                              </span>
                            </p>
                          )}
                          {Number(priceStructure?.infantPrice) +
                            Number(priceStructure?.infantTax) !=
                            0 && (
                            <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                              Fare Per Infant{" "}
                              <span className="text-xs sm:text-sm font-light">
                                {currency}{" "}
                                {Math.ceil(
                                  Number(priceStructure?.infantPrice ?? 0) +
                                    Number(priceStructure?.infantTax ?? 0)
                                ).toLocaleString("en-US")}
                              </span>
                            </p>
                          )}
                        </div>
                        <h3 className="font-gotham text-xs uppercase font-normal">
                          Grand Total
                        </h3>
                        <div className="py-2 flex flex-col gap-y-2">
                          <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                            Base Fare{" "}
                            <span className="font-light text-xs sm:text-sm">
                              {currency}{" "}
                              {Math.ceil(
                                Number(priceStructure?.adultPrice ?? 0) +
                                  Number(priceStructure?.childPrice ?? 0) +
                                  Number(priceStructure?.infantPrice ?? 0)
                              ).toLocaleString("en-US")}
                            </span>
                          </p>
                          <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                            Total Taxes{" "}
                            <span className="font-light text-xs sm:text-sm">
                              {currency}{" "}
                              {Math.ceil(
                                Number(priceStructure?.adultTax ?? 0) +
                                  Number(priceStructure?.childTax ?? 0) +
                                  Number(priceStructure?.infantTax ?? 0)
                              ).toLocaleString("en-US")}
                            </span>
                          </p>
                          <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                            Service Fee{" "}
                            <span className="font-light text-xs sm:text-sm">
                              {currency}{" "}
                              {Number(
                                priceStructure?.serviceFee ?? 0
                              ).toLocaleString("en-US")}
                            </span>
                          </p>
                          <p className="Price w-full font-gotham font-light flex justify-between text-xs sm:text-sm">
                            Grand total{" "}
                            <span className="font-light text-xs sm:text-sm">
                              {currency}{" "}
                              {Math.ceil(
                                Number(priceStructure?.totalPriceFC ?? 0)
                              ).toLocaleString("en-US")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )
              ) : (
                <Skeleton count={1} height={120} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardDetails;
