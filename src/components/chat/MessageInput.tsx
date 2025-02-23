'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled
}: MessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Enhanced scrollbar styling
    const style = document.createElement('style');
    style.textContent = `
      textarea::-webkit-scrollbar {
        width: 6px;
      }
      textarea::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
      }
      textarea::-webkit-scrollbar-thumb {
        background: rgba(236, 72, 153, 0.3);
        border-radius: 3px;
        transition: all 0.2s ease;
      }
      textarea::-webkit-scrollbar-thumb:hover {
        background: rgba(236, 72, 153, 0.5);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!value.trim() || isLoading || disabled) return;
      onSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex gap-3 p-4"
    >
      <div className={`
        relative flex-1 group
        before:absolute before:inset-0 
        before:rounded-xl before:p-[1px]
        before:bg-gradient-to-r 
        before:from-pink-500/20 
        before:via-purple-500/20 
        before:to-blue-500/20
        before:opacity-0 
        before:transition-opacity
        ${isFocused ? 'before:opacity-100' : 'hover:before:opacity-50'}
      `}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={disabled ? "Connect wallet to start chatting..." : "Ask about blockchain data..."}
          rows={1}
          className="
            w-full bg-gray-900/30 backdrop-blur-xl
            text-gray-100 rounded-xl px-4 py-3
            border border-gray-800/50
            focus:outline-none
            transition-all duration-200
            placeholder-gray-500/70
            resize-none overflow-y-auto
            min-h-[52px] max-h-32
            relative z-10
          "
          disabled={isLoading || disabled}
          style={{ scrollbarWidth: 'thin' }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || disabled || !value.trim()}
        className="
          relative px-6 min-w-[120px]
          bg-gradient-to-r from-pink-500 to-purple-600
          disabled:from-gray-700 disabled:to-gray-800
          text-white rounded-xl
          transition-all duration-200
          flex items-center justify-center gap-2
          disabled:cursor-not-allowed
          h-[52px] font-medium
          hover:shadow-lg hover:shadow-pink-500/20
          disabled:shadow-none
          group
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </motion.div>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Send
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  );
} 