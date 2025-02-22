'use client';

import { useEffect, useRef, useState } from 'react';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-3 text-teal-400/80">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">Thinking</span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        <span className="text-sm text-teal-400/60">{formatTime(thinkingTime)}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
          <p className="text-lg font-medium">Welcome to Nebula Chat</p>
          <p className="text-sm mt-2">Connect your wallet to start chatting about blockchain data</p>
        </div>
      )}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="space-y-1">
            <MessageBubble
              content={message.content}
              isUser={message.role === 'user'}
            />
            {!isLoading && 
             thinkingTime > 0 && 
             message.role === 'assistant' && 
             index === messages.length - 1 && (
              <div className="flex justify-end mr-2">
                <span className="text-xs text-gray-500">Response time: {formatTime(thinkingTime)}</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="mr-auto">
            {renderThinkingIndicator()}
          </div>
        )}
      </div>
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
} 