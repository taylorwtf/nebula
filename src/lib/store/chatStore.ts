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
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),

      addChat: () => set((state) => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          name: `Chat ${state.chats.length + 1}`,
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
        }

        chat.timestamp = Date.now();
        return { ...state };
      })
    }),
    {
      name: 'nebula-chat-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
); 