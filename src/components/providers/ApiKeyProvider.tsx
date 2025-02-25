'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the context type
interface ApiKeyContextType {
  apiKey: string | null;
  clientId: string | null;
  isConfigured: boolean;
  setApiKey: (key: string) => void;
  setClientId: (id: string) => void;
  setIsConfigured: (configured: boolean) => void;
  clearKeys: () => void;
}

// Create context with default values
const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

// Custom hook for using the API key context
export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}

// Provider component
export function ApiKeyProvider({ children }: { children: ReactNode }) {
  // State for API credentials - kept only in memory
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle mounting state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Function to clear credentials (for logout/session end)
  const clearKeys = () => {
    setApiKey(null);
    setClientId(null);
    setIsConfigured(false);
  };
  
  // Create a stable context value
  const contextValue = {
    apiKey, 
    setApiKey, 
    clientId, 
    setClientId, 
    isConfigured, 
    setIsConfigured, 
    clearKeys
  };
  
  return (
    <ApiKeyContext.Provider value={contextValue}>
      {children}
    </ApiKeyContext.Provider>
  );
} 