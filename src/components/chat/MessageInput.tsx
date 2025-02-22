'use client';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return; // Allow Shift+Enter for new line
      }
      e.preventDefault();
      if (!value.trim() || isLoading || disabled) return;
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={disabled ? "Connect wallet to start chatting..." : "Ask about blockchain data..."}
        rows={1}
        className="flex-1 bg-gray-900/50 text-gray-100 rounded-lg px-4 py-3 border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-colors placeholder-gray-500 resize-none overflow-y-auto min-h-[52px] max-h-32"
        disabled={isLoading || disabled}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !value.trim()}
        className="px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed h-[52px]"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          'Send'
        )}
      </button>
    </form>
  );
}

// Add this CSS to handle webkit scrollbar styling
const style = document.createElement('style');
style.textContent = `
  textarea::-webkit-scrollbar {
    width: 8px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #4B5563;
    border-radius: 4px;
  }
`;
document.head.appendChild(style); 