"use client";
import React from "react";
import CreditCardForm from "@/app/component/(ThirdPageComponents)/CreditCardForm/CreditCardForm";
import { useGetReservation } from "@/utils/getReservation";

export default function Page() {
  const { GetReservation, loadingReservation } = useGetReservation();
  // Minimal props - CreditCardForm has fallbacks for missing props
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Card Payment (Test Page)</h1>
      <CreditCardForm GetReservation={GetReservation} loadingTicket={loadingReservation} />
    </div>
  );
}
