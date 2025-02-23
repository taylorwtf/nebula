'use client';

import { useEffect } from 'react';
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { motion } from 'framer-motion';

interface WalletButtonProps {
  onAddressChange: (address: string) => void;
}

export default function WalletButton({ onAddressChange }: WalletButtonProps) {
  const address = useAddress();

  useEffect(() => {
    onAddressChange(address || '');
  }, [address, onAddressChange]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        className="
          !py-2 !px-4
          !bg-glass hover:!bg-glass-light
          !border !border-white/10
          !text-white
          !rounded-xl
          !font-medium
          !text-sm
          transition-all
          duration-200
        "
      />
    </motion.div>
  );
} 