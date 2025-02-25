'use client';

import { motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isUltraDark = theme === 'ultra-dark';
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center h-8 px-3 rounded-xl bg-surface-light/50 hover:bg-surface-light/80 transition-colors border border-white/5"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      aria-label={isUltraDark ? "Switch to dark theme" : "Switch to darker theme"}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-5 rounded-full bg-surface-dark overflow-hidden">
          {/* Toggle track with nebula gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 opacity-50" />
          
          {/* Toggle thumb/handle */}
          <motion.div 
            className={`absolute top-0.5 w-4 h-4 rounded-full shadow-md ${
              isUltraDark 
                ? 'bg-black border border-accent/30' 
                : 'bg-gradient-to-br from-primary to-accent'
            }`}
            initial={false}
            animate={{ 
              left: isUltraDark ? 'calc(100% - 1rem - 0.125rem)' : '0.125rem',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* Stars in the toggle */}
            {isUltraDark && (
              <>
                <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
                <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
              </>
            )}
          </motion.div>
        </div>
        
        <span className="text-xs font-medium">
          {isUltraDark ? 'Darker' : 'Dark'}
        </span>
      </div>
    </motion.button>
  );
} 