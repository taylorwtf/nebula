'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import ChatContainer from '@/components/chat/ChatContainer';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar onWalletConnect={setWalletAddress} />
      <main className="flex-1 overflow-hidden">
        <ChatContainer walletAddress={walletAddress} />
      </main>
    </div>
  );
}
