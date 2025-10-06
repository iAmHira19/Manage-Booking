"use server";
import { signIn } from "@/auth";
import React from "react";
import { FaGoogle } from "react-icons/fa";

const SignInButton = () => {
  return (
    <button
      className="px-6 py-3 font-gotham rounded-lg shadow-lg bg-white hover:bg-gray-100 transition-all flex items-center justify-center gap-1 text-orange-400"
      onClick={async () => {
        await signIn("google");
      }}
    >
      <FaGoogle /> <span>Google</span>
    </button>
  );
};

export default SignInButton;
