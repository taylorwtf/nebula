'use client';

import WalletButton from './WalletButton';

interface NavbarProps {
  onWalletConnect: (address: string) => void;
}

export default function Navbar({ onWalletConnect }: NavbarProps) {
  return (
    <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-teal-400 text-transparent bg-clip-text">
              Nebula Chat
            </span>
          </div>
          <div className="flex items-center">
            <WalletButton onAddressChange={onWalletConnect} />
          </div>
        </div>
      </div>
    </nav>
  );
} 