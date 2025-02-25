'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ChatList from './ChatList';
import { useChatStore } from '@/lib/store/chatStore';
import { useApiKey } from '@/components/providers/ApiKeyProvider';

interface SidebarProps {
  walletAddress: string;
}

export default function Sidebar({ walletAddress }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    chats, 
    activeChat, 
    addChat, 
    deleteChat, 
    clearAllChats, 
    setActiveChat, 
    updateChatName,
    isHydrated 
  } = useChatStore();
  const { isConfigured } = useApiKey();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!mounted || !isHydrated) {
    return null;
  }

  return (
    <motion.div
      className={`glass-panel border-r border-white/5 h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.h2
                className="text-sm font-medium text-white/70"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                Context Panel
              </motion.h2>
            )}
            <motion.button
              className="sidebar-collapse-btn ml-auto"
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                animate={{ rotate: isCollapsed ? 180 : 0 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="flex-1 p-4 space-y-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Wallet Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/50">Wallet Status</h3>
                <div className="glass-panel p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${walletAddress ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="font-medium text-primary-light">{formatAddress(walletAddress)}</span>
                  </div>
                </div>
              </div>
              
              {/* API Key Status Section */}
              {isConfigured && (
                <div className="space-y-2 animate-fadeIn">
                  <h3 className="text-sm font-medium text-white/50">API Status</h3>
                  <div className="glass-panel p-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-medium text-primary-light">API Keys Active</span>
                    </div>
                    <div className="mt-1 text-xs text-white/50">
                      Keys stored in memory only
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Management */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/50">Chats</h3>
                <ChatList
                  chats={chats}
                  activeChat={activeChat}
                  onNewChat={addChat}
                  onSelectChat={setActiveChat}
                  onDeleteChat={deleteChat}
                  onClearAllChats={clearAllChats}
                  onUpdateChatName={updateChatName}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 