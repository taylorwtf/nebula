'use client';

import { ReactNode } from 'react';
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect, trustWallet, rainbowWallet } from "@thirdweb-dev/react";
import { Ethereum, Polygon, Optimism, Arbitrum, Base } from "@thirdweb-dev/chains";

const activeChain = Ethereum;
const supportedChains = [Ethereum, Polygon, Optimism, Arbitrum, Base];

interface ThirdwebProviderComponentProps {
  children: ReactNode;
}

export default function ThirdwebProviderComponent({ children }: ThirdwebProviderComponentProps) {
  const clientId = process.env.NEXT_PUBLIC_NEBULA_CLIENT_ID || "fallback-client-id";
  
  return (
    <ThirdwebProvider
      clientId={clientId}
      activeChain={activeChain}
      supportedChains={supportedChains}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        trustWallet(),
        rainbowWallet()
      ]}
      dAppMeta={{
        name: "Nebula Chat",
        description: "AI-powered blockchain interaction",
        logoUrl: "/nebula-logo.png",
        url: "https://nebula.chat",
        isDarkMode: true,
      }}
    >
      {children}
    </ThirdwebProvider>
  );
} 