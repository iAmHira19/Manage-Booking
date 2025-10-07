import Header from "@/app/component/(FirstPageComponents)/Header/Header";
import Footer from "@/app/component/(FirstPageComponents)/Footer/Footer";
import Script from "next/script";
export default function layout({ children }) {
  const isTestEnv = process.env.NEXT_PUBLIC_CHECKOUT_ENV === 'test';
  const scriptSrc = isTestEnv
  ? 'https://test-bankalfalah.gateway.mastercard.com/static/checkout/checkout.min.js'
  : 'https://bankalfalah.gateway.mastercard.com/static/checkout/checkout.min.js';
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header></Header>
        <div className="flex-1">{children}</div>
        <Footer showPaymentImages={false} />
        <Script
          src={scriptSrc}
          strategy="lazyOnload" // Load after page is interactive
          // onLoad={() => {
          //   console.log("External script loaded");
          //   // Access the library, e.g., window.SomeLibrary
          //   if (window.SomeLibrary) {
          //     window.SomeLibrary.init();
          //   }
          // }
          // }
          data-error="errorCallback"
          data-cancel="cancelCallback"
        />
      </div>
    </>
  );
}
