"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[60vw] max-w-[500px]">
        <DotLottieReact
          src="https://lottie.host/b72714d6-7570-4c9a-bbb0-74e5f00a7237/7hJWYme1eb.lottie"
          loop
          autoplay
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
