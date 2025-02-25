'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ApiKeyProvider } from "../components/providers/ApiKeyProvider";
import dynamic from 'next/dynamic';

// Dynamically import ThirdWeb provider with no SSR
const ThirdwebProviderComponent = dynamic(
  () => import('../components/providers/ThirdwebProviderComponent'),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <ApiKeyProvider>
      {mounted ? (
        <ThirdwebProviderComponent>
          {children}
        </ThirdwebProviderComponent>
      ) : (
        <>{children}</>
      )}
    </ApiKeyProvider>
  );
} 