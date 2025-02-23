'use client';

import { motion } from 'framer-motion';
import WalletButton from './WalletButton';

interface NavbarProps {
  onWalletConnect: (address: string) => void;
}

export default function Navbar({ onWalletConnect }: NavbarProps) {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-glass/90 backdrop-blur-xl border-b border-white/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/90" />
              <span className="nebula-heading text-2xl">Nebula Chat</span>
            </motion.div>
          </motion.div>

          {/* Wallet Button */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WalletButton onAddressChange={onWalletConnect} />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
} 