'use client';

import { ThirdwebProvider } from "@thirdweb-dev/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_NEBULA_CLIENT_ID}
      activeChain="ethereum"
    >
      {children}
    </ThirdwebProvider>
  );
} 