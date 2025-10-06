"use client";
import React, { useEffect, useState } from "react";
import ChangePassword from "../component/(SetupComponents)/ChangePassword/ChangePassword";
import EmergencyContact from "../component/(SetupComponents)/EmergencyContact/EmergencyContact";
import PersonalInfo from "../component/(SetupComponents)/PersonalInfo/PersonalInfo";
import { useSignInContext } from "@/providers/SignInStateProvider";
import useBTCP from "@/hooks/useBTCP";
import { useRouter } from "next/navigation";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { isSignedIn, signOut, userId } = useSignInContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userData = useBTCP(userId);

  useEffect(() => {
    if (sessionStorage.getItem("signIn") !== "true") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  if (loading) {
    return (
      <p className="h-screen w-screen flex items-center justify-center">
        Loading
      </p>
    );
  }

  return (
    <div
      className="w-screen flex justify-between gap-x-20 px-4 md:px-10 py-4 md:py-16"
      onClick={() => console.log("userData: ", userData)}
    >
      <div className="w-1/5 hidden">
        <div className="border flex flex-col">
          <div className="w-full">
            <h3 className="font-gotham text-blue-900 text-lg border-b w-full px-3 py-5">
              Account Profile
            </h3>
          </div>
          <div className="w-full">
            <p
              className={`font-gotham ${
                currentStep === 0 ? "text-white bg-blue-900" : "text-blue-900"
              } text-lg border-b w-full px-3 py-1 cursor-pointer hover:bg-blue-900 hover:text-white`}
              onClick={() => setCurrentStep(0)}
            >
              Personal Info
            </p>
          </div>
          <div className="w-full">
            <p
              className={`font-gotham ${
                currentStep === 1 ? "text-white bg-blue-900" : "text-blue-900"
              } text-lg border-b w-full px-3 py-1 cursor-pointer hover:bg-blue-900 hover:text-white`}
              onClick={() => setCurrentStep(1)}
            >
              Change Password
            </p>
          </div>
          <div className="w-full">
            <p
              className={`font-gotham ${
                currentStep === 2 ? "text-white bg-blue-900" : "text-blue-900"
              } text-lg border-b w-full px-3 py-1 cursor-pointer hover:bg-blue-900 hover:text-white`}
              onClick={() => setCurrentStep(2)}
            >
              Emergency Contact
            </p>
          </div>
          <div className="w-full">
            <p
              className="font-gotham text-blue-950 text-lg border-b w-full px-3 py-1 cursor-pointer hover:bg-blue-900 hover:text-white"
              onClick={() => signOut()}
            >
              Logout
            </p>
          </div>
        </div>
      </div>
      <div className={`w-full ${currentStep === 0 ? "block" : "hidden"}`}>
        <PersonalInfo />
      </div>
      <div className={`w-full ${currentStep === 1 ? "block" : "hidden"}`}>
        <ChangePassword />
      </div>
      <div className={`w-full ${currentStep === 2 ? "block" : "hidden"}`}>
        <EmergencyContact />
      </div>
    </div>
  );
};

export default Page;
