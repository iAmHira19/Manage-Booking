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
