"use client";
import Agreement from "../component/(Terms&ConditionComponents)/Agreement";
import EntireAgreement from "../component/(Terms&ConditionComponents)/EntireAgreement";
import Indemnity from "../component/(Terms&ConditionComponents)/Indemnity";
import Intellectual from "../component/(Terms&ConditionComponents)/Intellectual";
import Modification from "../component/(Terms&ConditionComponents)/Modification";
import Security from "../component/(Terms&ConditionComponents)/Security";
import Passport from "../component/(Terms&ConditionComponents)/Passport";
import { HealthInsurance } from "../component/(Terms&ConditionComponents)/HealthInsurance";
import WebsiteContent from "../component/(Terms&ConditionComponents)/WebsiteContent";
import { CreditCard } from "../component/(Terms&ConditionComponents)/CreditCard";
import { useRef, useState } from "react";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const agreementRef = useRef(null);
  const modificationRef = useRef(null);
  const entireAgreementRef = useRef(null);
  const indemnityRef = useRef(null);
  const intellectualRef = useRef(null);
  const creditCardRef = useRef(null);
  const securityRef = useRef(null);
  const passportRef = useRef(null);
  const healthInsuranceRef = useRef(null);
  const websiteContentRef = useRef(null);
  const handleScrollTo = (ref, step) => {
    setCurrentStep(step);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <>
      <div className="flex flex-col w-full">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-gotham text-center py-5 md:py-10 bg-[#f8f9fa] text-orange-500">
          Terms & Conditions
        </h1>
        <div className="flex w-full justify-between bg-[#f8f9fa] relative min-h-screen gap-x-10">
          <div className="w-auto min-w-[10%] xl:min-w-[20%] hidden lg:flex flex-col bg-white h-fit relative top-8 left-5 xl:left-20 gap-y-2 py-4">
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 0
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(agreementRef, 0);
              }}
            >
              Agreement between you and CherryFlight
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 1
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(modificationRef, 1);
              }}
            >
              Modifications of Terms
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 2
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(entireAgreementRef, 2);
              }}
            >
              Entire Agreement
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 3
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(indemnityRef, 3);
              }}
            >
              Indemnity
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 4
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(intellectualRef, 4);
              }}
            >
              Intellectual Property Rights
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 5
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(creditCardRef, 5);
              }}
            >
              Use of Credit Card
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 6
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(securityRef, 6);
              }}
            >
              Security
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 7
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(passportRef, 7);
              }}
            >
              Passport
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 8
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(healthInsuranceRef, 8);
              }}
            >
              Health Insurance / Requirements
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 9
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(websiteContentRef, 9);
              }}
            >
              Website Content
            </span>
          </div>
          <div className="w-full flex flex-col items-center">
            <div className={`flex w-full}`} ref={agreementRef}>
              <Agreement />
            </div>
            <div className={`flex w-full}`} ref={modificationRef}>
              <Modification />
            </div>
            <div className={`flex w-full}`} ref={entireAgreementRef}>
              <EntireAgreement />
            </div>
            <div className={`flex w-full}`} ref={indemnityRef}>
              <Indemnity />
            </div>
            <div className={`flex w-full}`} ref={intellectualRef}>
              <Intellectual />
            </div>
            <div className={`flex w-full}`} ref={creditCardRef}>
              <CreditCard />
            </div>
            <div className={`flex w-full}`} ref={securityRef}>
              <Security />
            </div>
            <div className={`flex w-full}`} ref={passportRef}>
              <Passport />
            </div>
            <div className={`flex w-full}`} ref={healthInsuranceRef}>
              <HealthInsurance />
            </div>
            <div className={`flex w-full}`} ref={websiteContentRef}>
              <WebsiteContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
