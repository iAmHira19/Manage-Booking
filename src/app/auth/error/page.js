"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return "You're not signed up, please sign up first!";
      case "Configuration":
        return "There's a configuration error. Please contact support.";
      case "Verification":
        return "Unable to verify your account. Please try again.";
      default:
        return "An authentication error occurred. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6 h-screen bg-black">
      <p className="text-white font-gotham text-2xl text-center px-4">
        {getErrorMessage()}
      </p>
      <button
        className="px-4 py-2 border border-gray-300 rounded cursor-pointer bg-orange-500 text-white font-gotham font-semibold"
        onClick={() => (window.location.href = "/")}
      >
        Try Again
      </button>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
};

export default Page;
