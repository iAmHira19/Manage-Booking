"use client";
import { CookieProvider } from "@/providers/CookieProvider";
import { FlightsReviewProvider } from "@/providers/flightsReviewProvider";
import { SearchPageProvider } from "@/providers/searchPageProvider";
import { SignInContextProvider } from "@/providers/SignInStateProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SessionProvider } from "next-auth/react";
import React, { memo, useEffect } from "react";

const Providers = ({ children }) => {
  // Set default language to English
  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }, []);

  return (
    <AntdRegistry>
      <CookieProvider>
        <SearchPageProvider>
          <FlightsReviewProvider>
            <SignInContextProvider>
              <SessionProvider>{children}</SessionProvider>
            </SignInContextProvider>
          </FlightsReviewProvider>
        </SearchPageProvider>
      </CookieProvider>
    </AntdRegistry>
  );
};

export default memo(Providers);
