"use client";
import React, { useState, useRef } from "react";
import DataRetention from "../component/(PrivacyPolicyComponents)/DataRetention";
import { UserRights } from "../component/(PrivacyPolicyComponents)/UserRights";
import Security from "../component/(PrivacyPolicyComponents)/Security";
import { ThirdPartyLinks } from "../component/(PrivacyPolicyComponents)/ThirdPartyLinks";
import EffectiveDate from "../component/(PrivacyPolicyComponents)/EffectiveDate";
import InformationWeCollect from "../component/(PrivacyPolicyComponents)/InformationWeCollect";
import UseOfInfo from "../component/(PrivacyPolicyComponents)/UseOfInfo";
import SharingOfInfo from "../component/(PrivacyPolicyComponents)/ShareingOfInfo";
import ChildPrivacy from "../component/(PrivacyPolicyComponents)/ChildPrivacy";
import { PrivacyPolicyModifications } from "../component/(PrivacyPolicyComponents)/PrivacyPolicyModifications";
import ContactUS from "../component/(PrivacyPolicyComponents)/ContactUS";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const effectiveDateRef = useRef(null);
  const infoCollectRef = useRef(null);
  const useInfoRef = useRef(null);
  const shareInfoRef = useRef(null);
  const dataRetentionRef = useRef(null);
  const userRightsRef = useRef(null);
  const securityRef = useRef(null);
  const childPrivacyRef = useRef(null);
  const thirdPartyRef = useRef(null);
  const privacyPolicyRef = useRef(null);
  const contactUsRef = useRef(null);
  const handleScrollTo = (ref, step) => {
    setCurrentStep(step);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <>
      <div className="flex flex-col w-full">
        <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase font-gotham text-center pt-5 pb-2 XS:py-5 md:py-10 bg-[#f8f9fa] text-orange-500">
          Privacy Policies
        </h1>
        <div className="flex w-full justify-between bg-[#f8f9fa] relative min-h-screen gap-x-10">
          <div className="w-auto min-w-[10%] xl:min-w-[20%] hidden lg:flex flex-col bg-white h-fit max-h-[500px] overflow-y-scroll relative top-8 left-5 xl:left-20 gap-y-2 py-4">
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 0
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(effectiveDateRef, 0);
              }}
            >
              Introduction and Acceptance of Terms
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 1
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(infoCollectRef, 1);
              }}
            >
              Information We Collect
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 2
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(useInfoRef, 2);
              }}
            >
              How We Use Your Information
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 3
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(shareInfoRef, 3);
              }}
            >
              Sharing Your Information
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 4
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(dataRetentionRef, 4);
              }}
            >
              Data Retention
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 5
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(userRightsRef, 5);
              }}
            >
              Your Rights
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
              Data Security
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 7
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(childPrivacyRef, 7);
              }}
            >
              Children’s Privacy
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 8
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(thirdPartyRef, 8);
              }}
            >
              Third-Party Links
            </span>
            <span
              className={`p-3 cursor-pointer font-gotham font-light hover:bg-slate-100 hover:border-r-4 hover:border-orange-500 ${
                currentStep == 9
                  ? "border-r-4 border-orange-500 bg-slate-100"
                  : "bg-white border-r-0"
              } text-xl`}
              onClick={() => {
                handleScrollTo(contactUsRef, 9);
              }}
            >
              Contact Us
            </span>
          </div>
          <div className="w-full">
            <div className={`flex w-full}`} ref={effectiveDateRef}>
              <EffectiveDate />
            </div>
            <div className={`flex w-full}`} ref={infoCollectRef}>
              <InformationWeCollect />
            </div>
            <div className={`flex w-full}`} ref={useInfoRef}>
              <UseOfInfo />
            </div>
            <div className={`flex w-full}`} ref={shareInfoRef}>
              <SharingOfInfo />
            </div>
            <div className={`flex w-full}`} ref={dataRetentionRef}>
              <DataRetention />
            </div>
            <div className={`flex w-full}`} ref={userRightsRef}>
              <UserRights />
            </div>
            <div className={`flex w-full}`} ref={securityRef}>
              <Security />
            </div>
            <div className={`flex w-full}`} ref={childPrivacyRef}>
              <ChildPrivacy />
            </div>
            <div className={`flex w-full}`} ref={thirdPartyRef}>
              <ThirdPartyLinks />
            </div>
            <div className={`flex w-full}`} ref={privacyPolicyRef}>
              <PrivacyPolicyModifications />
            </div>
            <div className={`flex w-full}`} ref={contactUsRef}>
              <ContactUS />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
