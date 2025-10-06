"use client";
import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { GiMeal } from "react-icons/gi";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MdFreeCancellation } from "react-icons/md";
import { LuBaggageClaim } from "react-icons/lu";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function FlightCardFareOption(props) {
  const router = useRouter();
  const [modificationOpen, setModificationOpen] = useState(false);
  const [cancellationOpen, setCancellationOpen] = useState(false);
  const [moveToFlightsReviewRT, setMoveToFlightsReviewRT] = useState(false);
  const [moveToFlightsReviewOW, setMoveToFlightsReviewOW] = useState(false);
  const [moveToFlightsReviewMC, setMoveToFlightsReviewMC] = useState(false);
  const [check_inOpen, setCheckInOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);
  let tabId;
  if (isClientLoaded) {
    tabId = sessionStorage.getItem("tabId");
  }

  let { bagRules, changeRules, refundRules } = props;
  const showCancellationLoading = () => {
    setCancellationOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const showCheckInLoading = () => {
    setCheckInOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const showModificationLoading = () => {
    setModificationOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  // Modification Table
  const [changingRules, setChangingRules] = useState([]);
  const changingColumns = [
    {
      title: "Modification Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <a className="font-gotham text-blue-900 cursor-default">{text}</a>
      ),
    },
    {
      title: "Modification Fee",
      dataIndex: "fee",
      key: "fee",
      render: (text) => (
        <a className="font-gotham text-blue-900 cursor-default">{text}</a>
      ),
    },
  ];

  useEffect(() => {
    const newModificationData = changeRules.filter(
      (changeRule) => changeRule.keyData === props.keyData
    );
    let updatedModificationData = newModificationData.map(
      (changeRule, index) => {
        return {
          key: changeRule.keyData,
          type: changeRule.commonText,
          fee: changeRule.changeFee,
        };
      }
    );
    setChangingRules([...updatedModificationData]);
  }, [changeRules, props.keyData]);

  // Cancellation Table
  const [refundingRules, setRefundingRules] = useState([]);
  const cancellationColumns = [
    {
      title: "Refund Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <a className="font-gotham text-blue-900 cursor-default">{text}</a>
      ),
    },
    {
      title: "Refund Fee",
      dataIndex: "fee",
      key: "fee",
      render: (text) => (
        <a className="font-gotham text-blue-900 cursor-default">{text}</a>
      ),
    },
  ];

  useEffect(() => {
    const newRefundingData = refundRules.filter(
      (refundRule) => refundRule.keyData === props.keyData
    );
    let updatedRefundingData = newRefundingData.map((refundRule, index) => {
      return {
        key: refundRule.keyData,
        type: refundRule.commonText,
        fee: refundRule.refundFee,
      };
    });
    setRefundingRules([...updatedRefundingData]);
  }, [refundRules, props.keyData]);

  // Baggage Table
  const baggageColumns = [
    {
      title: "Rule",
      dataIndex: "rule",
      key: "rule",
      render: (text) => (
        <a className="text-blue-900 font-gotham font-light cursor-default">
          {text}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <a className="text-blue-900 font-gotham font-light cursor-default">
          {text}
        </a>
      ),
    },
  ];
  const [baggageRules, setBaggageRules] = useState([]);

  useEffect(() => {
    const newBaggageData = bagRules.filter(
      (bagrule) => bagrule.keyData === props.keyData
    );
    let updatedBaggageData = newBaggageData.map((bagrule, index) => {
      return {
        key: bagrule.keyData + Math.floor(Math.random() * 100),
        rule: bagrule.commonText,
        type: bagrule.commonText.includes("FirstCheckedBag")
          ? "First Check Bag"
          : bagrule.commonText.includes("SecondCheckedBag")
          ? "Second Checked Bag"
          : bagrule.commonText.includes("CarryOn") && "Carry on",
      };
    });
    setBaggageRules([...updatedBaggageData]);
  }, [bagRules, props.keyData]);

  const HandleRoundTripLegs = () => {
    if (props.disableButton) return;
    // Ensure parent first-leg metadata (SearchId, FlightId, TokenId, ProductId etc.)
    // is initialized before we append flight criteria. This prevents a stale
    // or previously-expanded flight from being used when the user selects a
    // filtered flight for the return leg.
    // IMPORTANT: Only call setFirstLegDataHandler when user actually selects a fare option
    try {
      props.setFirstLegDataHandler && props.setFirstLegDataHandler();
    } catch (e) {
      console.warn("setFirstLegDataHandler not available", e.message);
    }
    if (props.legsCount === 1) {
      props.setFirstLegData((prevData) => {
        let newprevData = {
          ...prevData,
          FlightCriteria: props.dataItem.flightSegment.map((fCriteria) => {
            let newFC = {
              ...fCriteria,
              cabin: props.brand.cabin,
              cabinGrade: props.brand.cabinGrade,
              brandTier: props.brand.brandTier,
            };
            return newFC;
          }),
        };
        return newprevData;
      });
      props.setFlightsReview((prevData) => {
        let newprevData = {
          ...prevData,
          tokenId: props.TokenId,
          flightCriteria: props.dataItem.flightSegment.map((fCriteria) => {
            let newFC = {
              ...fCriteria,
              cabin: props.brand.cabin,
              cabinGrade: props.brand.cabinGrade,
              brandTier: props.brand.brandTier,
            };
            return newFC;
          }),
        };
        return newprevData;
      });
      props.setUsersSelectedPrice(Number(props.CardPrice.replace(/,/g, "")));
      props.setSearchTriggered(true);
      props.setLegsCount((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      props.setFirstLegData((prevData) => {
        let newprevData = {
          ...prevData,
          FlightCriteria: [
            ...prevData.FlightCriteria,
            ...props.dataItem.flightSegment.map((fSegment) => {
              let newFC = {
                ...fSegment,
                cabin: props.brand.cabin,
                cabinGrade: props.brand.cabinGrade,
                brandTier: props.brand.brandTier,
              };
              return newFC;
            }),
          ],
        };
        return newprevData;
      });
      props.setFlightsReview((prevData) => {
        let newprevData = {
          ...prevData,
          flightCriteria: [
            ...prevData.flightCriteria,
            ...props.dataItem.flightSegment.map((fSegment) => {
              let newFC = {
                ...fSegment,
                cabin: props.brand.cabin,
                cabinGrade: props.brand.cabinGrade,
                brandTier: props.brand.brandTier,
              };
              return newFC;
            }),
          ],
        };
        return newprevData;
      });
      setMoveToFlightsReviewRT(true);
    } catch (error) {
      console.log("Error navigating to flightsReview:", error.message);
    } finally {
      return;
    }
  };

  const HandleOneWayLeg = () => {
    // First ensure parent metadata is initialized (SearchId, FlightId, TokenId, ProductId)
    // IMPORTANT: Only call setFirstLegDataHandler when user actually selects a fare option
    try {
      props.setFirstLegDataHandler && props.setFirstLegDataHandler();
    } catch (e) {
      console.warn("setFirstLegDataHandler not available", e.message);
    }

    try {
      props.setFirstLegData((prevData) => {
        let newprevData = {
          ...prevData,
          FlightCriteria: props.dataItem.flightSegment.map((fCriteria) => {
            let newFC = {
              ...fCriteria,
              cabin: props.brand.cabin,
              cabinGrade: props.brand.cabinGrade,
              brandTier: props.brand.brandTier,
            };
            return newFC;
          }),
        };
        return newprevData;
      });
      props.setFlightsReview((prevData) => {
        let newprevData = {
          ...prevData,
          tokenId: props.TokenId,
          flightCriteria: props.dataItem.flightSegment.map((fCriteria) => {
            let newFC = {
              ...fCriteria,
              cabin: props.brand.cabin,
              cabinGrade: props.brand.cabinGrade,
              brandTier: props.brand.brandTier,
            };
            return newFC;
          }),
        };
        return newprevData;
      });
      setMoveToFlightsReviewOW(true);
    } catch (error) {
      console.log("Error navigating to flightsReview:", error.message);
    } finally {
      return;
    }
  };

  const HandleMultiCityLegs = () => {
    // Rest of the code
    const newCriteria = props.dataItem.flightSegment.map((segment) => ({
      ...segment,
      cabin: props.brand.cabin,
      cabinGrade: props.brand.cabinGrade,
      brandTier: props.brand.brandTier,
    }));
    // Ensure metadata is initialized for the first leg when selecting a brand
    // IMPORTANT: Only call setFirstLegDataHandler when user actually selects a fare option
    try {
      props.setFirstLegDataHandler && props.setFirstLegDataHandler();
    } catch (e) {
      console.warn("setFirstLegDataHandler not available", e.message);
    }
    props.setFirstLegData((prevData) => {
      const updatedData = {
        ...prevData,
        FlightCriteria:
          props.legsCount === 1
            ? newCriteria
            : [...prevData.FlightCriteria, ...newCriteria],
      };
      return updatedData;
    });
    props.setFlightsReview((prevData) => {
      const updatedData = {
        ...prevData,
        tokenId: props.TokenId,
        flightCriteria:
          props.legsCount === 1
            ? newCriteria
            : [...prevData.flightCriteria, ...newCriteria],
      };
      return updatedData;
    });
    props.setUsersSelectedPrice((prev) => {
      let newPrice = Number(props.CardPrice.replace(/,/g, ""));
      return prev + newPrice;
    });
    let lCount = props.legsCount;
    if (lCount + 1 <= props.MCDataLength) {
      props.setSearchTriggered(true);
    }
    props.setLegsCount((prevCount) => {
      const newCount =
        prevCount === props.MCDataLength ? prevCount : prevCount + 1;
      return newCount;
    });
    setMoveToFlightsReviewMC(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (
      props.flightsReview.flightCriteria.length > 0 &&
      moveToFlightsReviewOW
    ) {
      // Debug: ensure required metadata present
      const requiredMeta = {
        SearchId: props.firstLegData?.SearchId,
        TokenId: props.TokenId,
        ProductId: props.firstLegData?.ProductId,
      };
      console.debug("[FlightCardFareOption] OneWay navigation payload:", {
        flightsReview: props.flightsReview,
        firstLegData: props.firstLegData,
        requiredMeta,
      });

      if (!requiredMeta.SearchId || !requiredMeta.TokenId) {
        toast.error(
          "Missing flight metadata (SearchId/TokenId). Please re-select the flight.",
          { duration: 4000 }
        );
        return;
      }

      props.setButtonLoading(true);
      let flightsReviewDataString = JSON.stringify(props.flightsReview);
      isClientLoaded &&
        sessionStorage.setItem(
          "flightReviewPageData",
          `${tabId}___${flightsReviewDataString}`
        );
      router.push(`/flightsReview`);
    }
  }, [moveToFlightsReviewOW]);
  useEffect(() => {
    const isBothLegsPresent = props.flightsReview.flightCriteria.filter(
      (fC, idx) => fC.legRef === "2" && moveToFlightsReviewRT
    );
    if (
      props.flightsReview.flightCriteria.length > 0 &&
      isBothLegsPresent.length > 0
    ) {
      // Debug payload before navigation (helps identify stale metadata)
      const requiredMeta = {
        SearchId: props.firstLegData?.SearchId,
        TokenId: props.TokenId,
        ProductId: props.firstLegData?.ProductId,
      };
      console.debug("[FlightCardFareOption] RoundTrip navigation payload:", {
        flightsReview: props.flightsReview,
        firstLegData: props.firstLegData,
        requiredMeta,
      });

      if (!requiredMeta.SearchId || !requiredMeta.TokenId) {
        toast.error(
          "Missing flight metadata (SearchId/TokenId) for round-trip. Please re-select the flights.",
          { duration: 4000 }
        );
        return;
      }

      props.setButtonLoading(true);
      // props.setDisableButton(true);
      let flightsReviewDataString = JSON.stringify(props.flightsReview);
      isClientLoaded &&
        sessionStorage.setItem(
          "flightReviewPageData",
          `${tabId}___${flightsReviewDataString}`
        );
      router.push(`/flightsReview`);
    }
  }, [moveToFlightsReviewRT]);
  useEffect(() => {
    const handleMultiCityNavigation = async () => {
      if (props.legsCount !== props.MCDataLength) {
        if (props.legsCount !== 1) {
          props.setSearchTriggered(true);
        }
        return;
      }
      const isAllLegsPresent = props.flightsReview.flightCriteria.filter(
        (fC) => fC.legRef === props.MCDataLength.toString()
      );
      if (isAllLegsPresent.length > 0) {
        const flightsReviewDataString = JSON.stringify(props.flightsReview);
        props.setButtonLoading(true);
        if (isClientLoaded) {
          const tabId = sessionStorage.getItem("tabId");
          sessionStorage.setItem(
            "flightReviewPageData",
            `${tabId}___${flightsReviewDataString}`
          );
        }
        router.push("/flightsReview");
      }
    };
    if (moveToFlightsReviewMC) handleMultiCityNavigation();
  }, [moveToFlightsReviewMC]);
  return (
    <>
      <div
        className="FlightCardFareOption container rounded-md border CT:border-2 border-gray-200 py-2 sm:py-4 px-4 flex flex-col gap-5 relative items-center justify-center bg-transparent shadow-sm CT:shadow-none min-h-[280px] sm:min-h-[350px] w-full max-w-[400px] max-h-full font-gotham font-light"
        key={props.key}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="item font-light w-full font-gotham">
          <h2 className="font-bold text-sm CT:text-base w-full text-left font-gotham">
            {props.Title}
          </h2>
        </div>
        <div className="cardPart font-gotham w-full">
          <div className="standardRules flex flex-col gap-y-4 font-gotham">
            <div className="item grid XS:grid-cols-3 font-gotham">
              <div className="iconPart flex gap-2 col-span-2 text-[10px] sm:text-xs font-gotham font-light">
                <LuBaggageClaim />
                {props.Check_in}
              </div>
              <div className="item flex text-left text-xs font-gotham">
                <p
                  className="text-blue-900 cursor-pointer font-gotham font-light pl-5 XS:pl-0 text-[10px] sm:text-xs"
                  onClick={showCheckInLoading}
                >
                  {props.Check_in_Value}
                </p>
                <Modal
                  title={
                    <p className="pb-5 text-orange-500 font-bold">
                      Bag Details
                    </p>
                  }
                  loading={loading}
                  open={check_inOpen}
                  onCancel={() => setCheckInOpen(false)}
                  centered={true}
                  width={768}
                >
                  <Table
                    columns={baggageColumns}
                    dataSource={baggageRules}
                    pagination={false}
                  ></Table>
                </Modal>
              </div>
            </div>

            <div className="item grid XS:grid-cols-3 font-gotham">
              <div className="iconPart flex gap-2 items-center col-span-2 text-[10px] sm:text-xs font-gotham font-light">
                <FaPen />
                {props.Modification}
              </div>
              <div className="item flex items-center text-xs">
                <p
                  className="text-blue-900 cursor-pointer font-gotham font-light pl-5 XS:pl-0 text-[10px] sm:text-xs"
                  // style={{ fontFamily: "Gotham", fontWeight: "300" }}
                  onClick={showModificationLoading}
                >
                  {props.Modification_Value}
                </p>
                <Modal
                  title={
                    <p className="text-orange-500 font-bold pb-5 font-gotham">
                      Modification
                    </p>
                  }
                  loading={loading}
                  open={modificationOpen}
                  onCancel={() => setModificationOpen(false)}
                  centered={true}
                  width={768}
                >
                  <Table
                    columns={changingColumns}
                    dataSource={changingRules}
                    pagination={false}
                  ></Table>
                </Modal>
              </div>
            </div>

            <div className="item grid XS:grid-cols-3 font-gotham">
              <div className="iconPart flex gap-2 items-center col-span-2 text-[10px] sm:text-xs font-gotham font-light">
                <MdFreeCancellation />
                {props.Cancellation}
              </div>
              <div className="item flex items-center text-xs">
                <p
                  className="text-blue-900 cursor-pointer font-gotham font-light pl-5 XS:pl-0 text-[10px] sm:text-xs"
                  onClick={showCancellationLoading}
                >
                  {props.Cancellation_Value}
                </p>
                <Modal
                  title={
                    <p className="pb-5 text-orange-500 font-bold font-gotham">
                      Cancellation
                    </p>
                  }
                  // footer={
                  //   <p className="text-left py-5 font-gotham">
                  //     Tickets will be valid till 29th day only after flight
                  //     departure for modifications or refund.
                  //   </p>
                  // }
                  loading={loading}
                  open={cancellationOpen}
                  onCancel={() => setCancellationOpen(false)}
                  centered={true}
                  width={768}
                >
                  <Table
                    columns={cancellationColumns}
                    dataSource={refundingRules}
                    pagination={false}
                  ></Table>
                </Modal>
              </div>
            </div>

            <div className="item grid XS:grid-cols-3 font-gotham">
              <div className="iconPart flex gap-2 items-center col-span-2 text-[10px] sm:text-xs font-gotham font-light">
                <MdAirlineSeatReclineExtra />
                {props.Seat}
              </div>
              <div className="cursor-pointer font-gotham font-light pl-5 XS:pl-0 text-[10px] sm:text-xs">
                {props.Seat_Value}
              </div>
            </div>

            <div className="item grid XS:grid-cols-3 font-gotham">
              <div className="iconPart flex gap-2 items-center col-span-2 text-[10px] sm:text-xs font-gotham font-light">
                <GiMeal />
                {props.Meal}
              </div>
              <div className="cursor-pointer font-gotham font-light pl-5 XS:pl-0 text-[10px] sm:text-xs">
                {props.Meal_Value}
              </div>
            </div>
          </div>
        </div>
        <div className="item flex items-center justify-center">
          <Button
            type="button"
            loading={props.buttonLoading}
            className={`!rounded !bg-orange-500 !text-white !w-full !mt-auto !px-2 !CT:px-6 !CT:py-2 !inline-block !text-xs font-gotham font-light lg:!text-base ${
              props.disableButton ? "!cursor-not-allowed" : "!pointer"
            }`}
            onClick={() => {
              if (props.isReturn) {
                HandleRoundTripLegs();
                return;
              }
              if (props.isOneWay) {
                HandleOneWayLeg();
                return;
              }
              if (props.isMultiCity) {
                HandleMultiCityLegs();
                return;
              }
            }}
          >
            {props.searchCurrencyCode}{" "}
            {props.CardPrice.replace(/,/g, "") < 0 ? 0 : props.CardPrice}/-
          </Button>
        </div>
      </div>
    </>
  );
}

export default FlightCardFareOption;
