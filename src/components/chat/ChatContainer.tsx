'use client';

import { useState } from 'react';
import { sendNebulaRequest } from '@/lib/nebula';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContainerProps {
  walletAddress: string;
}

export default function ChatContainer({ walletAddress }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || !walletAddress) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      await sendNebulaRequest({
        message: userMessage,
        walletAddress,
        userId: walletAddress,
        stream: true,
        onStream: (chunk) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            // If the last message is not from the assistant, add a new one
            if (!lastMessage || lastMessage.role !== 'assistant') {
              return [...newMessages, { role: 'assistant', content: chunk }];
            }
            
            // Otherwise, append to the existing message
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: lastMessage.content + chunk
            };
            return newMessages;
          });
        },
        onAction: async (action) => {
          console.log('Blockchain action received:', action);
          if (action.type === 'sign_transaction') {
            // Add a new message for the transaction request
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `Transaction request received: ${JSON.stringify(action.data, null, 2)}`
            }]);
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-4">
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 shadow-xl">
          <div className="flex-1 overflow-y-auto p-4">
            <MessageList 
              messages={messages} 
              isLoading={isLoading}
            />
          </div>
          <div className="flex-none p-4 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
            <MessageInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              disabled={!walletAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 