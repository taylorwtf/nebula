'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'nebula' | 'ultra-dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with nebula theme, but check localStorage on mount
  const [theme, setTheme] = useState<ThemeMode>('nebula');
  
  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'nebula' || savedTheme === 'ultra-dark')) {
      setTheme(savedTheme);
      // Apply the theme class to the document
      if (savedTheme === 'ultra-dark') {
        document.documentElement.classList.add('ultra-dark');
      } else {
        document.documentElement.classList.remove('ultra-dark');
      }
    }
  }, []);
  
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'nebula' ? 'ultra-dark' : 'nebula';
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Apply the theme class to the document
      if (newTheme === 'ultra-dark') {
        document.documentElement.classList.add('ultra-dark');
      } else {
        document.documentElement.classList.remove('ultra-dark');
      }
      
      return newTheme;
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 