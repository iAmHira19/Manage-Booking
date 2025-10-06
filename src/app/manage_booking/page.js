"use client";
import { useState, useEffect } from "react";

export default function ManageBooking() {
  const [lastName, setLastName] = useState("");
  const [reference, setReference] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI;

  // Countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1 & 2: Verify booking + generate OTP
  const handleSendOtp = async () => {
  setError("");

  if (!lastName || !reference) {
    setError("Please enter both last name and reference number");
    return;
  }
    console.log("Sending OTP with data:", { Key: reference, Value: lastName });


  setLoading(true);

  try {
    const formData = new URLSearchParams();
    formData.append("Key", reference);
    formData.append("Value", lastName);

    const res = await fetch(`${BASE_URI}/api/tpauthentication/generateOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (res.ok) {
      setOtpSent(true);
      setTimer(120);
    } else {
      const errText = await res.text();
      setError(errText || "Could not send OTP. Please try again.");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};



  // Step 3: Verify OTP
const handleVerifyOtp = async () => {
  setError("");

  if (!otp) {
    setError("Please enter OTP");
    return;
  }

  try {
    // Prepare payload matching backend KeyDubValue
    const payload = {
      Key: reference,   // Booking reference
      Value1: lastName, // Last name
      Value2: otp       // OTP
    };

    console.log("Sending payload to backend:", payload);

    const res = await fetch(`${BASE_URI}/api/tpauthentication/validateOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = (await res.text()).trim();

    // Remove wrapping quotes if present
    if (data.startsWith('"') && data.endsWith('"')) {
      data = data.slice(1, -1);
    }

    console.log("Backend response after removing quotes:", `"${data}"`);

    // Handle response
    switch (data) {
      case "InvalidInputError":
        setError("Please enter valid reference number and last name.");
        break;
      case "InvalidDetailsError":
        setError("Booking not found. Check your reference number and last name.");
        break;
      case "InvalidOTPError":
        setError("Invalid or expired OTP. Please try again.");
        break;
      case "OTP validated successfully.":
        alert("Booking retrieved successfully!");
        setOtpSent(false); // hide OTP input
        break;
      default:
        console.error("Unexpected backend response:", data);
        setError(`Unexpected response: ${data}`);
    }
  } catch (err) {
    console.error(err);
    setError("Error verifying OTP.");
  }
};
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[url(/img/Manage_Booking_Page/Manage-Booking.png)] bg-[rgba(0,0,0,0.1)] bg-blend-darken bg-center bg-cover">
      <div className="mx-auto p-5 font-sans w-full">
        <h1 className="text-2xl sm:text-4xl text-center text-orange-500 mb-2 uppercase font-gotham font-bold pb-3 sm:pb-7 tracking-wider">
          Manage your booking
        </h1>
        <p className="sm:w-[560px] mx-auto pb-7 text-center text-slate-600 font-gotham text-sm sm:text-lg font-normal sm:tracking-tight">
          Enter your details to see your itinerary, make changes and add extra
          services.
        </p>

        <div>
          {error && (
            <div className="mb-4 text-red-600 text-center font-gotham">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 md:w-full min-w-[95%] sm:min-w-[75%] max-w-[1120px] mx-auto bg-[#f9f9f9] rounded shadow p-5">
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-3 border border-gray-300 rounded text-base outline-none min-w-[40%] w-full font-gotham font-light"
            />
            <input
              type="text"
              placeholder="Cherry Booking reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="p-3 border border-gray-300 rounded text-base outline-none min-w-[40%] w-full font-gotham font-light"
            />

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`bg-orange-500 text-white p-2 sm:py-3 sm:px-5 font-light sm:font-bold rounded transition-colors duration-300 ease-in-out outline-none font-gotham whitespace-nowrap ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"
                }`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <button
                onClick={handleSendOtp}
                disabled={timer > 0}
                className={`bg-orange-500 text-white p-2 sm:py-3 sm:px-5 font-light sm:font-bold rounded transition-colors duration-300 ease-in-out outline-none font-gotham whitespace-nowrap ${
                  timer > 0
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-orange-600"
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            )}
          </div>

          {otpSent && (
            <div className="mt-5 flex flex-col items-center gap-2">
              {/* {maskedEmail && (
                <p className="text-slate-600 font-gotham text-sm">
                  OTP has been sent to:{" "}
                  <span className="font-bold">{maskedEmail}</span>
                </p>
              )} */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-3 border border-gray-300 rounded text-base outline-none w-[250px] font-gotham font-light"
                />
                <button
                  onClick={handleVerifyOtp}
                  className="bg-green-500 text-white p-2 sm:py-3 sm:px-5 font-light sm:font-bold rounded hover:bg-green-600 transition-colors duration-300 ease-in-out outline-none font-gotham"
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
