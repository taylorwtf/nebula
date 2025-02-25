'use client';

import { useState } from 'react';
import { useApiKey } from '../providers/ApiKeyProvider';

interface ApiKeySetupProps {
  onClose?: () => void;
}

export default function ApiKeySetup({ onClose }: ApiKeySetupProps) {
  const { setApiKey, setClientId, setIsConfigured } = useApiKey();
  
  // Local state for form
  const [key, setKey] = useState('');
  const [id, setId] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Validation function
  const validateInputs = () => {
    if (!key.trim()) {
      setError('API Key is required');
      return false;
    }
    if (!id.trim()) {
      setError('Client ID is required');
      return false;
    }
    return true;
  };

  // Test connection to validate API keys
  const testConnection = async () => {
    if (!validateInputs()) return;
    
    setIsValidating(true);
    setError('');
    
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key, clientId: id }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API key validation failed:', data);
        throw new Error(data.error || 'Invalid API credentials. Make sure your Nebula API key and Client ID are correct.');
      }
      
      // Success
      setApiKey(key);
      setClientId(id);
      setIsConfigured(true);
      if (onClose) onClose();
    } catch (err) {
      console.error('API key validation error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to validate API credentials. Please check your Nebula API key and Client ID.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  // Save without testing
  const saveWithoutTesting = () => {
    if (!validateInputs()) return;
    
    setApiKey(key);
    setClientId(id);
    setIsConfigured(true);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="glass-panel max-w-md w-full p-6 shadow-2xl animate-fadeIn relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 transition-colors rounded-full hover:bg-primary/10"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="nebula-heading text-2xl mb-4">Setup Your API Keys</h2>
        
        <div className="mb-6">
          <p className="text-sm text-white/70 mb-4">
            Your API keys are required to use this application. They will only be stored in 
            memory and will be lost when you close or refresh the page.
          </p>
          <div className="p-3 bg-primary/5 rounded border border-primary/10 text-sm">
            <strong className="text-primary-light">Security Note:</strong> Your keys never leave your browser and are not 
            stored anywhere. They're only used to make API requests directly from your device.
          </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); testConnection(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/80" htmlFor="apiKey">
              Nebula API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="glass-input w-full px-3 py-2 text-white"
                placeholder="sk..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-white/80" htmlFor="clientId">
              Nebula Client ID
            </label>
            <input
              id="clientId"
              type={showKey ? "text" : "password"}
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="glass-input w-full px-3 py-2 text-white"
              placeholder="Client ID..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="showKeys"
              type="checkbox"
              checked={showKey}
              onChange={() => setShowKey(!showKey)}
              className="h-4 w-4 text-primary rounded bg-[#12121a]/50 border-white/10"
            />
            <label htmlFor="showKeys" className="ml-2 text-sm text-white/70">
              Show keys
            </label>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/20 text-red-300 rounded border border-red-500/20 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isValidating}
              className="primary-button flex-1"
            >
              {isValidating ? 'Validating...' : 'Test & Save Keys'}
            </button>
            <button
              type="button"
              onClick={saveWithoutTesting}
              className="secondary-button flex-1"
            >
              Skip Testing
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-xs text-white/50">
          <p className="mb-2">Need help getting your API keys?</p> 
          <ol className="list-decimal ml-4 space-y-1">
            <li>Visit <a href="https://thirdweb.com/dashboard" target="_blank" rel="noreferrer" className="text-primary-light hover:underline">ThirdWeb Dashboard</a></li>
            <li>Go to <strong>Settings → API Keys</strong> section</li>
            <li>Create a new API key for Nebula</li>
            <li>Copy both the <strong>Secret Key</strong> (starts with "sk...") and the <strong>Client ID</strong></li>
            <li>Paste them in the fields above</li>
          </ol>
          <p className="mt-3">
            <a href="https://thirdweb.com/nebula" target="_blank" rel="noreferrer" className="text-primary-light hover:underline">Learn more about Nebula API</a>
          </p>
        </div>
      </div>
    </div>
  );
} 