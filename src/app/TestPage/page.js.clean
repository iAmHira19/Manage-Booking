"use client";
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { Spin } from 'antd';

// Dynamically import client-side components
const TestPageContent = dynamic(
  () => import('./TestPageContent'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }
);

// Main page component
export default function TestPage() {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    }>
      <TestPageContent />
    </Suspense>
  );
}
