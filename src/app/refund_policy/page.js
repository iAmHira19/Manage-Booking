"use client";
import React, { useRef, useState } from "react";
import { Refund_Payment } from "../component/(cherryRefundComponents)/Refund_Payment";
import RefundNCancellation_Policy from "../component/(cherryRefundComponents)/RefundNCancellation_Policy";
import Request_A_Refund from "../component/(cherryRefundComponents)/Request_A_Refund";
import Eligibility_Criteria from "../component/(cherryRefundComponents)/Eligibility_Criteria";
import Required_Documents from "../component/(cherryRefundComponents)/Required_Documents";
import Processing_Time from "../component/(cherryRefundComponents)/Processing_Time";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const refundNCancellationRef = useRef(null);
  const reqRefundRef = useRef(null);
  const eligibilityRef = useRef(null);
  const requiredDocRef = useRef(null);
  const processTimeRef = useRef(null);
  const refundPaymentRef = useRef(null);
  const handleScrollTo = (ref, step) => {
    setCurrentStep(step);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <>
      <div className="flex flex-col w-full">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-gotham text-center py-5 md:py-10 bg-[#f8f9fa] text-orange-500">
          Refund Policies
        </h1>
        <div className="flex w-full justify-between bg-[#f8f9fa] relative min-h-screen">
          <div className="w-auto min-w-[10%] xl:min-w-[20%] hidden lg:flex flex-col bg-white h-fit relative top-8 left-5 xl:left-20 gap-y-2 py-4">
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 0
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(refundNCancellationRef, 0);
              }}
            >
              Refund & Cancellation Policy
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 1
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(reqRefundRef, 1);
              }}
            >
              How to Request a Refund
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 2
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(eligibilityRef, 2);
              }}
            >
              Eligibility Criteria
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 3
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(requiredDocRef, 3);
              }}
            >
              Required Documents
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 4
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(processTimeRef, 4);
              }}
            >
              Processing Time
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 5
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(refundPaymentRef, 5);
              }}
            >
              Refund Payment Methods
            </span>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className={`flex w-full}`} ref={refundNCancellationRef}>
              <RefundNCancellation_Policy />
            </div>
            <div className={`flex w-full}`} ref={reqRefundRef}>
              <Request_A_Refund />
            </div>
            <div className={`flex w-full}`} ref={eligibilityRef}>
              <Eligibility_Criteria />
            </div>
            <div className={`flex w-full}`} ref={requiredDocRef}>
              <Required_Documents />
            </div>
            <div className={`flex w-full}`} ref={processTimeRef}>
              <Processing_Time />
            </div>
            <div className={`flex w-full}`} ref={refundPaymentRef}>
              <Refund_Payment />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
