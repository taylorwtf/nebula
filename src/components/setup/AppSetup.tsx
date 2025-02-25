'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useApiKey } from '../providers/ApiKeyProvider';
import ApiKeySetup from './ApiKeySetup';

// Create a context for the API key setup function
interface ApiKeySetupContextType {
  showApiKeySetup: () => void;
}

export const ApiKeySetupContext = createContext<ApiKeySetupContextType | null>(null);

// Custom hook to use the API key setup context
export function useApiKeySetup() {
  const context = useContext(ApiKeySetupContext);
  if (!context) {
    throw new Error('useApiKeySetup must be used within an AppSetup component');
  }
  return context;
}

interface AppSetupProps {
  children: React.ReactNode;
}

export default function AppSetup({ children }: AppSetupProps) {
  const { isConfigured } = useApiKey();
  const [showSetup, setShowSetup] = useState(false);
  
  // Show setup modal after a short delay if API keys are not configured
  useEffect(() => {
    if (!isConfigured) {
      // Short delay to avoid flashing the setup modal during initial load
      const timer = setTimeout(() => {
        setShowSetup(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isConfigured]);
  
  // Add event listener for beforeunload to warn users about losing their API keys
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isConfigured) {
        // Standard way to show a confirmation dialog before page unload
        e.preventDefault();
        // Custom message (note: most modern browsers show a generic message instead)
        e.returnValue = 'Your API keys are stored in memory and will be lost if you leave. Are you sure?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isConfigured]);
  
  // This function will be exposed via context to show the API key setup modal
  const showApiKeySetup = () => {
    setShowSetup(true);
  };
  
  return (
    <ApiKeySetupContext.Provider value={{ showApiKeySetup }}>
      {children}
      
      {/* API Key Setup Modal (Portal) */}
      {showSetup && <ApiKeySetup onClose={() => setShowSetup(false)} />}
    </ApiKeySetupContext.Provider>
  );
} 