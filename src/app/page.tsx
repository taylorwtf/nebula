'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar/Navbar';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import { useChatStore } from '@/lib/store/chatStore';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const { activeChat } = useChatStore();

  return (
    <motion.div 
      className="flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar onWalletConnect={setWalletAddress} />
      <main className="flex-1 flex overflow-hidden pt-16">
        <Sidebar 
          walletAddress={walletAddress}
        />
        <div className="flex-1 overflow-hidden">
          <ChatContainer 
            key={activeChat || 'empty'}
            walletAddress={walletAddress} 
          />
        </div>
      </main>
    </motion.div>
  );
}
