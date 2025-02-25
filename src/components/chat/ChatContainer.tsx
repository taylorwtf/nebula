'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendNebulaRequest } from '@/lib/nebula';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatStore } from '@/lib/store/chatStore';
import { Chat } from '@/components/sidebar/ChatList';
import { useWallet, useChain } from "@thirdweb-dev/react";
import TransactionHandler from './TransactionHandler';
import { useApiKey } from '@/components/providers/ApiKeyProvider';
import { useApiKeySetup } from '@/components/setup/AppSetup';

interface ChatContainerProps {
  walletAddress: string;
}

export default function ChatContainer({ walletAddress }: ChatContainerProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { activeChat, addMessageToChat, isHydrated } = useChatStore();
  const [mounted, setMounted] = useState(false);
  const wallet = useWallet();
  const chainInfo = useChain();
  const chain = chainInfo?.chain;
  const { apiKey, clientId, isConfigured } = useApiKey();
  const { showApiKeySetup } = useApiKeySetup();
  
  // Add new state for transaction handling
  const [transactionData, setTransactionData] = useState<{
    to: string;
    value: string;
    data: string;
    chainId: number;
  } | undefined>(undefined);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTransaction = async (action: any) => {
    if (!action?.data) return;
    setTransactionData(action.data);
    setShowTransactionModal(true);
  };

  const handleTransactionConfirm = async () => {
    if (!transactionData || !activeChat) return;

    try {
      const signer = await wallet?.getSigner();
      if (!signer) {
        throw new Error('No wallet connected');
      }

      await signer.sendTransaction({
        to: transactionData.to,
        value: transactionData.value,
        data: transactionData.data,
        chainId: parseInt(transactionData.chainId.toString())
      });
      
      addMessageToChat(activeChat, {
        role: 'assistant',
        content: 'Transaction submitted successfully! Please wait for confirmation.'
      });
      
      setShowTransactionModal(false);
      setTransactionData(undefined);
    } catch (error) {
      console.error('Transaction error:', error);
      if (error instanceof Error && activeChat) {
        addMessageToChat(activeChat, {
          role: 'assistant',
          content: `Transaction failed: ${error.message}`
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || !walletAddress || !activeChat) return;

    // Check if API keys are configured
    if (!isConfigured) {
      // Show the API key setup popup automatically
      showApiKeySetup();
      
      // Also add a message to the chat
      addMessageToChat(activeChat, { 
        role: 'assistant', 
        content: 'Please set up your API keys to use this application. Your keys will be stored in memory only and will not be saved anywhere.' 
      });
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    addMessageToChat(activeChat, { role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      await sendNebulaRequest({
        message: userMessage,
        walletAddress,
        userId: walletAddress,
        stream: true,
        onStream: (chunk) => {
          addMessageToChat(activeChat, { role: 'assistant', content: chunk }, true);
        },
        onAction: async (action) => {
          console.log('Blockchain action received:', action);
          if (action.type === 'sign_transaction') {
            handleTransaction(action);
          }
        },
        apiKey: apiKey || undefined,
        clientId: clientId || undefined
      });
    } catch (error) {
      console.error('Error:', error);
      addMessageToChat(activeChat, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please check your API keys.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get messages for the active chat
  const messages = useChatStore(state => 
    state.chats.find(chat => chat.id === activeChat)?.messages || []
  );

  if (!mounted || !isHydrated) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div 
        className="flex-1 flex flex-col glass-panel mx-4 my-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-1 overflow-y-auto">
          <MessageList 
            messages={messages} 
            isLoading={isLoading}
          />
        </div>
        <div className="flex-none border-t border-white/5">
          <MessageInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={!walletAddress || !activeChat}
          />
        </div>
      </motion.div>

      <TransactionHandler
        isVisible={showTransactionModal}
        transactionData={transactionData}
        onClose={() => {
          setShowTransactionModal(false);
          setTransactionData(undefined);
          if (activeChat) {
            addMessageToChat(activeChat, {
              role: 'assistant',
              content: 'Transaction cancelled by user.'
            });
          }
        }}
        onSuccess={handleTransactionConfirm}
        onError={(error) => {
          if (activeChat) {
            addMessageToChat(activeChat, {
              role: 'assistant',
              content: `Transaction failed: ${error.message}`
            });
          }
          setShowTransactionModal(false);
          setTransactionData(undefined);
        }}
      />
    </div>
  );
} 