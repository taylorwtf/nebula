'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [thinkingTime, setThinkingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>('');

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
    
    if (isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Scroll on new messages and content updates
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content !== lastContentRef.current) {
      lastContentRef.current = lastMessage?.content || '';
      scrollToBottom();
    }
  }, [messages]);

  // Scroll on loading state change
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Force scroll on container resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (messages.length > 0) {
        scrollToBottom();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [messages.length]);

  // Handle timer for thinking animation
  useEffect(() => {
    if (isLoading && messages[messages.length - 1]?.role === 'user') {
      // Start timer
      setThinkingTime(0);
      timerRef.current = setInterval(() => {
        setThinkingTime(prev => prev + 1);
      }, 1000);
    } else {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, messages]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const renderThinkingIndicator = () => (
    <motion.div 
      className="flex flex-col space-y-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="glass-panel py-3 px-4">
        <div className="flex items-center space-x-3 text-primary-light">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Thinking</span>
            <div className="flex items-center space-x-1">
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary-light"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary-light"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
              />
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-primary-light"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </div>
          </div>
          <span className="text-sm text-primary/60">{formatTime(thinkingTime)}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col min-h-0 p-4 overflow-y-auto scroll-smooth"
    >
      <AnimatePresence>
        {messages.length === 0 && !isLoading && (
          <motion.div 
            className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg font-medium bg-gradient-to-r from-primary-light via-accent-light to-primary-light bg-clip-text text-transparent">
              Welcome to Nebula Chat
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Connect your wallet to start chatting about blockchain data
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            message && (
              <motion.div 
                key={index}
                className="space-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  if (index === messages.length - 1) {
                    scrollToBottom();
                  }
                }}
              >
                <MessageBubble
                  content={message.content}
                  isUser={message.role === 'user'}
                />
                {!isLoading && 
                 thinkingTime > 0 && 
                 message.role === 'assistant' && 
                 index === messages.length - 1 && (
                  <motion.div 
                    className="flex justify-end mr-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-xs text-gray-500">Response time: {formatTime(thinkingTime)}</span>
                  </motion.div>
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="mr-auto">
            {renderThinkingIndicator()}
          </div>
        )}
      </div>
      <div ref={messagesEndRef} className="h-px" />
    </div>
  );
} 