'use client';

import { motion } from 'framer-motion';
import WalletButton from './WalletButton';
import { useApiKey } from '../providers/ApiKeyProvider';
import { useApiKeySetup } from '../setup/AppSetup';

interface NavbarProps {
  onWalletConnect: (address: string) => void;
}

export default function Navbar({ onWalletConnect }: NavbarProps) {
  const { isConfigured, clearKeys } = useApiKey();
  const { showApiKeySetup } = useApiKeySetup();
  
  const handleSettingsClick = () => {
    showApiKeySetup();
  };
  
  const handleResetKeys = () => {
    if (confirm('Are you sure you want to clear your API keys? You will need to enter them again.')) {
      clearKeys();
    }
  };
  
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

          {/* API Key Settings & Wallet Button */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* API Key Settings Button */}
            <div className="flex gap-2">
              <button
                onClick={handleSettingsClick}
                className="flex items-center text-sm px-4 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-light transition-colors border border-primary/10"
              >
                {isConfigured ? 'Update API Keys' : 'Set API Keys'}
              </button>
              
              {isConfigured && (
                <button
                  onClick={handleResetKeys}
                  className="flex items-center text-sm px-4 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors border border-red-500/10"
                >
                  Reset Keys
                </button>
              )}
            </div>
            
            {/* Wallet Button */}
            <WalletButton onAddressChange={onWalletConnect} />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
} 