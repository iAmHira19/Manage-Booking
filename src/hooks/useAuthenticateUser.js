"use client";
import { useState } from "react";
import { getAuthenticationResponse as fetchAuthentication } from "@/services/getAuthenticationResponse";

const useAuthenticateUser = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthenticationResponse = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchAuthentication(email, password);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAuthenticationResponse, data, error, loading };
};

export default useAuthenticateUser;
