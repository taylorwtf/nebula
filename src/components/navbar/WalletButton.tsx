'use client';

import { useEffect } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

interface WalletButtonProps {
  onAddressChange: (address: string) => void;
}

export default function WalletButton({ onAddressChange }: WalletButtonProps) {
  const address = useAddress();

  useEffect(() => {
    onAddressChange(address || '');
  }, [address, onAddressChange]);

  return (
    <ConnectWallet
      theme="dark"
      btnTitle="Connect Wallet"
      className="!bg-gray-800 !text-pink-500 !border !border-gray-700 !rounded-lg hover:!bg-gray-700 transition-colors"
    />
  );
} 