"use client";

import React from 'react';
import { SignInContextProvider } from '@/providers/SignInStateProvider';

export default function Providers({ children }) {
  return (
    <SignInContextProvider>
      {children}
    </SignInContextProvider>
  );
}
