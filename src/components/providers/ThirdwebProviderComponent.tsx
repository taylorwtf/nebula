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
  if (!process.env.NEXT_PUBLIC_NEBULA_CLIENT_ID) {
    throw new Error('NEXT_PUBLIC_NEBULA_CLIENT_ID is required');
  }

  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_NEBULA_CLIENT_ID}
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