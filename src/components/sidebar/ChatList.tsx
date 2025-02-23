'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export interface Chat {
  id: string;
  name: string;
  timestamp: number;
  messages: any[]; // Type can be refined based on your message structure
}

interface ChatListProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onClearAllChats: () => void;
}

export default function ChatList({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onClearAllChats
}: ChatListProps) {
  const [isHoveringId, setIsHoveringId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* New Chat Button */}
      <motion.button
        onClick={onNewChat}
        className="secondary-button w-full text-sm justify-center gap-2 flex items-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Chat
      </motion.button>

      {/* Chat List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`
                glass-panel p-3 cursor-pointer group
                ${activeChat === chat.id ? 'border-primary/20' : 'hover:border-white/10'}
              `}
              onClick={() => onSelectChat(chat.id)}
              onMouseEnter={() => setIsHoveringId(chat.id)}
              onMouseLeave={() => setIsHoveringId(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{chat.name}</p>
                  <p className="text-xs text-white/50">{formatDate(chat.timestamp)}</p>
                </div>
                <AnimatePresence>
                  {isHoveringId === chat.id && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="text-white/50 hover:text-white/80 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clear All Button */}
      {chats.length > 0 && (
        <motion.button
          onClick={onClearAllChats}
          className="secondary-button w-full text-sm justify-center text-white/50 hover:text-white/80"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Clear All Chats
        </motion.button>
      )}
    </div>
  );
} 