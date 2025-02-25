'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useChatStore } from '@/lib/store/chatStore';

// Dynamically import client-side components with no SSR
const Sidebar = dynamic(() => import('@/components/sidebar/Sidebar'), { ssr: false });
const ChatContainer = dynamic(() => import('@/components/chat/ChatContainer'), { ssr: false });
const Navbar = dynamic(() => import('@/components/navbar/Navbar'), { ssr: false });

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { addChat, activeChat, setHydrated, isHydrated } = useChatStore();
  
  // Handle hydration
  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);
  
  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Create a new chat if none exists
  useEffect(() => {
    if (isHydrated && !activeChat) {
      addChat();
    }
  }, [isHydrated, activeChat, addChat]);
  
  // Handle wallet connection
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };
  
  if (!mounted || !isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary-light">Loading...</div>
      </div>
    );
  }
  
  return (
    <main className="flex flex-col h-screen pt-16">
      <Navbar onWalletConnect={handleWalletConnect} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar walletAddress={walletAddress} />
        <div className="flex-1 overflow-hidden">
          <ChatContainer walletAddress={walletAddress} />
        </div>
      </div>
    </main>
  );
}
