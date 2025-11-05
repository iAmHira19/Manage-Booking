"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import useAuthenticateUser from "@/hooks/useAuthenticateUser";
import { useSignInContext } from "@/providers/SignInStateProvider";
import { cleanupUsername } from "@/utils/cleanupUsername";
import toast, { Toaster } from "react-hot-toast";
import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Footer from "@/app/component/(FirstPageComponents)/Footer/Footer";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignInPage() {
  const router = useRouter();
  const { getAuthenticationResponse, loading } = useAuthenticateUser();
  const {
    signInFn,
    setUsername: setUsernameContext,
    setUserId: setUserIdContext,
    setUserGroup: setUserGroupContext,
  } = useSignInContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepMe, setKeepMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotEmail, setShowForgotEmail] = useState(false);
  const [feFirst, setFeFirst] = useState("");
  const [feLast, setFeLast] = useState("");
  const [feEmail, setFeEmail] = useState("");
  const [feDob, setFeDob] = useState("");

  // Clear any prefilled values for security on mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async (values) => {
    const emailTrim = String(values.email || "").trim();
    const passwordTrim = String(values.password || "").trim();
    try {
      const user = await getAuthenticationResponse(emailTrim, passwordTrim);
      if (!user) {
        toast.error("Service unavailable. Try again later.");
        return;
      }
      if ((Array.isArray(user) && user.length === 0) || user?.message === "Invalid credentials") {
        toast.error("Invalid credentials");
        return;
      }
      const u = Array.isArray(user) ? user[0] : user;
      const originalName = u?.user_Name || u?.usr_Name || "";
      const cleaned = cleanupUsername(originalName);
      setUsernameContext(cleaned);
      setUserIdContext(u?.user_ID || u?.usr_ID || "Public");
      setUserGroupContext(u?.usr_Group || null);

      // Persist for session display (provider also syncs storages)
      try {
        sessionStorage.setItem("username", cleaned);
        sessionStorage.setItem("userId", u?.user_ID || u?.usr_ID || "Public");
        sessionStorage.setItem("userGroup", u?.usr_Group || "");
      } catch {}

      // Keep me logged in: we already write signIn to both storages in signInFn.
      // Optionally, ensure localStorage is set when keepMe is true.
      try {
        if (keepMe) localStorage.setItem("signIn", "true");
      } catch {}

      signInFn();
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  const SignInSchema = Yup.object({
    email: Yup.string().email("Enter a valid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
        <h1 className="text-3xl md:text-4xl font-gotham text-blue-900 text-center mb-2">Log in to CherryFlight</h1>
        <p className="text-center text-slate-600 font-gotham mb-8">
          Access your bookings, save traveler details, and enjoy faster checkout.
        </p>

        <div className="bg-white rounded border border-slate-200 shadow-sm p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Login form */}
          <div>
            <h2 className="text-xl font-gotham text-blue-900 mb-4">Login</h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SignInSchema}
              validateOnChange
              validateOnBlur
              onSubmit={handleLogin}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="flex flex-col gap-4" autoComplete="off">
                  <div>
                    <label className="block text-sm font-gotham text-blue-900 mb-1">Email <span className="text-red-600">*</span></label>
                    <Field
                      as="input"
                      type="email"
                      name="email"
                      className="w-full border border-slate-300 rounded px-3 py-2 font-gotham focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="you@example.com"
                      autoCapitalize="none"
                      autoCorrect="off"
                      autoComplete="off"
                    />
                    <ErrorMessage name="email" component="p" className="text-xs text-red-600 mt-1" />
                    <div className="mt-1 text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotEmail(true)}
                        className="text-xs text-blue-900 hover:text-blue-700 underline font-gotham"
                      >
                        Forget email
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-gotham text-blue-900 mb-1">Password <span className="text-red-600">*</span></label>
                    <div className="relative">
                      <Field
                        as="input"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full border border-slate-300 rounded px-3 py-2 pr-10 font-gotham focus:outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-xs text-red-600 mt-1" />
                    <div className="mt-1 text-right">
                      <Link href="/auth/signup-process" className="text-xs text-blue-900 hover:text-blue-700 underline font-gotham">
                        Forgot/Create password
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="keep"
                      type="checkbox"
                      checked={keepMe}
                      onChange={(e) => setKeepMe(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="keep" className="text-sm font-gotham text-slate-700">
                      Keep me logged in on this device
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className={`bg-orange-500 hover:bg-orange-600 transition text-white rounded px-4 py-2 font-gotham ${
                      loading || isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right: Sign up callout */}
          <div className="border border-slate-200 rounded p-4 md:p-6 text-center flex flex-col items-center justify-center">
            <h3 className="text-lg font-gotham text-blue-900 mb-2">Not a CherryFlight member yet?</h3>
            <p className="text-slate-600 font-gotham mb-4 max-w-[28ch]">
              Create your account to save traveler profiles and track your bookings.
            </p>
            <button
              onClick={() => router.push("/auth/signup-process")}
              className="mx-auto bg-orange-500 hover:bg-orange-600 transition text-white rounded px-5 py-2 font-gotham"
              type="button"
            >
              Join now
            </button>
          </div>
        </div>
      </div>
      {showForgotEmail && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-gotham text-blue-900 mb-1">Forgot my membership number</h3>
            <p className="text-sm text-slate-600 mb-4">Fill the form below and we&apos;ll use this information to help you find your membership number.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!feFirst || !feLast || !feEmail || !feDob) {
                  toast.error("Please complete all fields");
                  return;
                }
                toast.success("We will contact you with recovery details");
                setShowForgotEmail(false);
                setFeFirst("");
                setFeLast("");
                setFeEmail("");
                setFeDob("");
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="First name"
                value={feFirst}
                onChange={(e) => setFeFirst(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 font-gotham"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={feLast}
                onChange={(e) => setFeLast(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 font-gotham"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={feEmail}
                onChange={(e) => setFeEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 font-gotham"
                required
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={feDob}
                onChange={(e) => setFeDob(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 font-gotham"
                required
              />
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-gotham">Submit</button>
            </form>
            <button
              type="button"
              onClick={() => setShowForgotEmail(false)}
              className="mt-3 text-center text-sm text-blue-900 hover:text-blue-700 w-full"
            >
              Back to login
            </button>
          </div>
        </div>
      )}
      <Footer showPaymentImages={true} />
    </div>
  );
}

// "use client";
// import { signIn } from "next-auth/react";

// export default function CustomSignInPage() {
//   const handleGoogleSignIn = () => {
//     signIn("google", { callbackUrl: "/" }); // or your desired redirect path
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
//         <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome Back!</h1>
//         <p className="mb-6 text-gray-600">
//           Please sign in to continue to your dashboard.
//         </p>

//         <button
//           onClick={handleGoogleSignIn}
//           className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
//         >
//           <img
//             src="https://www.svgrepo.com/show/475656/google-color.svg"
//             alt="Google Logo"
//             className="w-5 h-5"
//           />
//           Sign in with Google
//         </button>

//         <p className="mt-6 text-sm text-gray-500">
//           By signing in, you agree to our{" "}
//           <a href="/terms" className="underline text-blue-600">
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a href="/privacy" className="underline text-blue-600">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }
