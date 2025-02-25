'use client';

import { useEffect } from 'react';
import { ConnectWallet, useAddress, useWallet } from "@thirdweb-dev/react";
import { motion } from 'framer-motion';
import { setConnectedWallet } from '@/services/wallet';

interface WalletButtonProps {
  onAddressChange: (address: string) => void;
}

export default function WalletButton({ onAddressChange }: WalletButtonProps) {
  const address = useAddress();
  const wallet = useWallet();

  useEffect(() => {
    onAddressChange(address || '');
    
    // Set the connected wallet in the cache when it changes
    if (wallet) {
      setConnectedWallet(wallet);
    }
  }, [address, wallet, onAddressChange]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0"
    >
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        className="
          !py-1.5 md:!py-2 !px-2 md:!px-4
          !bg-glass hover:!bg-glass-light
          !border !border-white/10
          !text-white
          !rounded-xl
          !font-medium
          !text-xs md:!text-sm
          transition-all
          duration-200
          !min-w-0
        "
        // In ThirdWeb v4, the ConnectWallet component automatically shows:
        // 1. ENS name (if available)
        // 2. User avatar (ENS or default)
        // 3. ETH balance
        // These features are enabled by default
      />
    </motion.div>
  );
} 