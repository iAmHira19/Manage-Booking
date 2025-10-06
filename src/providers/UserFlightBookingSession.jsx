"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/utils/session";

export const SessionProvider = ({ children }) => {
  const [sessionValid, setSessionValid] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isValid = checkSession();
    setSessionValid(isValid);

    if (!isValid) {
      router.push("/login"); // Redirect to login or action page
    }
  }, [router]);

  if (!sessionValid) {
    return <div>Redirecting to login...</div>; // Loading or redirect message
  }

  return <>{children}</>;
};
