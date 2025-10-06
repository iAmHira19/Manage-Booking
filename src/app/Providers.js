"use client";
import { CookieProvider } from "@/providers/CookieProvider";
import { FlightsReviewProvider } from "@/providers/flightsReviewProvider";
import { SearchPageProvider } from "@/providers/searchPageProvider";
import { SignInContextProvider } from "@/providers/SignInStateProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SessionProvider } from "next-auth/react";
import React, { memo } from "react";

const Providers = ({ children }) => {
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
