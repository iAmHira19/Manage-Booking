import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingAnim = ({ src }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] max-w-[400px]">
        <DotLottieReact
          src={src}
          loop
          autoplay
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default LoadingAnim;
