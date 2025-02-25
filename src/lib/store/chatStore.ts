import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Chat } from '@/components/sidebar/ChatList';

interface ChatStore {
  chats: Chat[];
  activeChat: string | null;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  addChat: () => void;
  deleteChat: (id: string) => void;
  clearAllChats: () => void;
  setActiveChat: (id: string | null) => void;
  addMessageToChat: (chatId: string, message: any, append?: boolean) => void;
  updateChatName: (chatId: string, newName: string) => void;
}

const generateChatName = (message: string): string => {
  const msg = message.toLowerCase();

  // 1. Contract Deployments
  const deployMatch = msg.match(/deploy (?:an? )?([^\n.]+?)(?:\s+contract)?(?:\s+(?:named|with|on|to))?\s*['""]?([^'"".\n]+)?/i);
  if (deployMatch) {
    const contractType = deployMatch[1];
    const contractName = deployMatch[2];
    return contractName ? `${contractName} ${contractType}` : `New ${contractType}`;
  }

  // 2. ENS or Address Interactions (transfers, queries)
  const ensMatch = msg.match(/\b\w+\.eth\b/i);
  if (ensMatch) {
    return ensMatch[0];
  }

  const addressMatch = msg.match(/0x[a-fA-F0-9]{40}/);
  if (addressMatch) {
    const addr = addressMatch[0];
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  // 3. Contract Analysis/Understanding
  const contractAnalysisMatch = msg.match(/(?:what|explain|analyze|show|get)\s+(?:is|are|the)?\s*(?:functions?|standards?|interface|details?)\s+(?:of|for|in|at|about)?\s+(?:contract\s+)?([^?.,\n]+)/i);
  if (contractAnalysisMatch) {
    return `Analyze ${contractAnalysisMatch[1]}`;
  }

  // 4. Token Research/Price Checks
  const tokenMatch = msg.match(/(?:price|address|supply|balance)\s+(?:of\s+)?([A-Z0-9]+)(?:\s+(?:on|in|at)\s+([A-Za-z]+))?/i);
  if (tokenMatch) {
    const token = tokenMatch[1];
    const chain = tokenMatch[2];
    return chain ? `${token} on ${chain}` : token;
  }

  // 5. Transaction Analysis
  const txMatch = msg.match(/(?:transaction|tx)\s+(?:details?|info|about)?\s+(?:for\s+)?(\w+)/i);
  if (txMatch) {
    return `Tx ${txMatch[1].slice(0, 8)}...`;
  }

  // 6. Network/Chain Queries
  const chainMatch = msg.match(/(?:gas|block|status|info)\s+(?:on|for|in|at)\s+([A-Za-z]+)/i);
  if (chainMatch) {
    return `${chainMatch[1]} Info`;
  }

  // 7. Wallet Queries
  const walletMatch = msg.match(/(?:balance|holdings?|nfts?|tokens?)\s+(?:of|in|for)\s+([^?.,\n]+)/i);
  if (walletMatch) {
    return `${walletMatch[1]} Portfolio`;
  }

  // 8. Smart Contract Interactions (minting, etc)
  const mintMatch = msg.match(/(?:mint|create|generate)\s+(?:an?\s+)?([^\n.]+?)(?:\s+(?:on|to|with))?\s*([^.,\n]+)?/i);
  if (mintMatch) {
    return `Mint ${mintMatch[1]}`;
  }

  // 9. General Development Queries
  const devMatch = msg.match(/how\s+(?:to|do\s+i)\s+([^?.,\n]+)/i);
  if (devMatch) {
    const topic = devMatch[1].slice(0, 30);
    return `Dev: ${topic}`;
  }

  // 10. Transfer/Payment Patterns (fallback)
  const sendToMatch = msg.match(/(?:send|transfer|pay)(?:\s+[\d.]+\s*\w+)?\s+to\s+([^,.\s]+)/i);
  if (sendToMatch && sendToMatch[1]) {
    return sendToMatch[1];
  }

  // If no specific patterns match, extract first 30 characters, ending at the last complete word
  const truncated = message.slice(0, 30).split(' ').slice(0, -1).join(' ');
  return truncated || 'New Chat';
};

// Check if window is defined (browser) or not (server)
const isServer = typeof window === 'undefined';

// Create store with SSR safety
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),

      addChat: () => set((state) => {
        const newChat: Chat = {
          id: isServer ? 'temp-id' : crypto.randomUUID(),
          name: 'New Chat',
          timestamp: Date.now(),
          messages: []
        };
        return {
          chats: [newChat, ...state.chats],
          activeChat: newChat.id
        };
      }),

      deleteChat: (id) => set((state) => ({
        chats: state.chats.filter(chat => chat.id !== id),
        activeChat: state.activeChat === id ? null : state.activeChat
      })),

      clearAllChats: () => set({ chats: [], activeChat: null }),

      setActiveChat: (id) => set({ activeChat: id }),

      addMessageToChat: (chatId, message, append = false) => set((state) => {
        const chat = state.chats.find(chat => chat.id === chatId);
        if (!chat) return state;

        if (append) {
          const lastMessage = chat.messages[chat.messages.length - 1];
          if (lastMessage && lastMessage.role === message.role) {
            lastMessage.content += message.content;
          } else {
            chat.messages.push(message);
          }
        } else {
          chat.messages.push(message);
          // Auto-name the chat based on the first user message
          if (chat.name === 'New Chat' && message.role === 'user') {
            chat.name = generateChatName(message.content);
          }
        }

        chat.timestamp = Date.now();
        return { ...state };
      }),

      updateChatName: (chatId, newName) => set((state) => {
        const chat = state.chats.find(chat => chat.id === chatId);
        if (!chat) return state;
        
        chat.name = newName;
        return { ...state };
      }),
    }),
    {
      name: 'nebula-chat-storage',
      storage: createJSONStorage(() => {
        // Use a safe storage that works on both client and server
        if (isServer) {
          // Return a mock storage for SSR
          return {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
          };
        }
        return localStorage;
      }),
      // Skip hydration in SSR context
      skipHydration: isServer,
      onRehydrateStorage: () => (state) => {
        if (!isServer && state) {
          state.setHydrated(true);
        }
      },
    }
  )
); 