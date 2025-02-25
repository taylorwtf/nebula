'use client';

import { motion } from 'framer-motion';
import WalletButton from './WalletButton';
import ThemeToggle from './ThemeToggle';
import { useApiKey } from '../providers/ApiKeyProvider';
import { useApiKeySetup } from '../setup/AppSetup';
import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  onWalletConnect: (address: string) => void;
}

export default function Navbar({ onWalletConnect }: NavbarProps) {
  const { isConfigured, clearKeys } = useApiKey();
  const { showApiKeySetup } = useApiKeySetup();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);
  const [eyePositions, setEyePositions] = useState({ 
    leftEye: { x: 0, y: 0 },
    rightEye: { x: 0, y: 0 }
  });
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate eye positions based on mouse position
  useEffect(() => {
    if (!logoRef.current) return;
    
    const logoRect = logoRef.current.getBoundingClientRect();
    const logoCenter = {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2
    };
    
    // Calculate angle between mouse and logo center
    const angle = Math.atan2(
      mousePosition.y - logoCenter.y,
      mousePosition.x - logoCenter.x
    );
    
    // Maximum eye movement (in SVG coordinate space)
    const maxEyeMove = 5;
    
    // Calculate new positions with limited movement range
    const leftEyeX = Math.cos(angle) * maxEyeMove;
    const leftEyeY = Math.sin(angle) * maxEyeMove;
    const rightEyeX = Math.cos(angle) * maxEyeMove;
    const rightEyeY = Math.sin(angle) * maxEyeMove;
    
    setEyePositions({
      leftEye: { x: leftEyeX, y: leftEyeY },
      rightEye: { x: rightEyeX, y: rightEyeY }
    });
  }, [mousePosition]);
  
  const handleSettingsClick = () => {
    showApiKeySetup();
  };
  
  const handleResetKeys = () => {
    if (confirm('Are you sure you want to clear your API keys? You will need to enter them again.')) {
      clearKeys();
    }
  };
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-glass/90 backdrop-blur-xl border-b border-white/5"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center -ml-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-20 h-20" ref={logoRef}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" className="w-full h-full">
                  {/* Enhanced definitions */}
                  <defs>
                    {/* Core nebula gradient with more cosmic colors */}
                    <linearGradient id="nebulaCore" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#120838">
                        <animate attributeName="stop-color" values="#120838; #20124d; #120838" dur="7s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="40%" stopColor="#341677">
                        <animate attributeName="stop-color" values="#341677; #4b1d9f; #341677" dur="8s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="70%" stopColor="#7b2fad">
                        <animate attributeName="stop-color" values="#7b2fad; #9d50bb; #7b2fad" dur="9s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="#c13584">
                        <animate attributeName="stop-color" values="#c13584; #fd5949; #c13584" dur="10s" repeatCount="indefinite" />
                      </stop>
                    </linearGradient>
                    
                    {/* Outer cosmic glow */}
                    <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor="#341677" stopOpacity="0" />
                      <stop offset="70%" stopColor="#120838" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                    </radialGradient>
                    
                    {/* Eye void gradient */}
                    <radialGradient id="eyeVoid" cx="50%" cy="50%" r="100%">
                      <stop offset="0%" stopColor="#000000" />
                      <stop offset="85%" stopColor="#120838" />
                      <stop offset="100%" stopColor="#341677" />
                    </radialGradient>
                    
                    {/* Cosmic dust filter */}
                    <filter id="cosmicDust" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" />
                      <feDisplacementMap in="SourceGraphic" scale="3" />
                    </filter>
                    
                    {/* Star glow filter */}
                    <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Main nebula form - more organic and cloud-like */}
                  <path d="M150,60 
                           C190,50 230,70 240,110 
                           C255,160 230,200 190,220 
                           C150,240 100,230 70,190 
                           C40,150 60,90 100,70 
                           C120,60 140,65 150,60 Z" 
                        fill="url(#nebulaCore)" 
                        filter="url(#cosmicDust)">
                    <animate attributeName="d" 
                             values="M150,60 
                                     C190,50 230,70 240,110 
                                     C255,160 230,200 190,220 
                                     C150,240 100,230 70,190 
                                     C40,150 60,90 100,70 
                                     C120,60 140,65 150,60 Z;
                                     
                                     M150,65 
                                     C185,55 225,75 235,115 
                                     C250,165 225,205 185,225 
                                     C145,245 95,235 65,195 
                                     C35,155 55,95 95,75 
                                     C115,65 135,70 150,65 Z;
                                     
                                     M150,60 
                                     C190,50 230,70 240,110 
                                     C255,160 230,200 190,220 
                                     C150,240 100,230 70,190 
                                     C40,150 60,90 100,70 
                                     C120,60 140,65 150,60 Z" 
                             dur="20s" 
                             repeatCount="indefinite" />
                  </path>
                  
                  {/* Left eye - black hole style */}
                  <g transform={`translate(${eyePositions.leftEye.x}, ${eyePositions.leftEye.y})`}>
                    {/* Eye socket glow */}
                    <ellipse cx="110" cy="130" rx="38" ry="42" fill="#341677" opacity="0.3" filter="url(#starGlow)" />
                    
                    {/* Main eye void */}
                    <ellipse cx="110" cy="130" rx="35" ry="38" fill="url(#eyeVoid)">
                      <animate attributeName="rx" values="35; 36; 35" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="ry" values="38; 39; 38" dur="3s" repeatCount="indefinite" />
                    </ellipse>
                    
                    {/* Event horizon rim */}
                    <ellipse cx="110" cy="130" rx="35" ry="38" stroke="#9d50bb" strokeWidth="1" fill="none" opacity="0.7">
                      <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="4s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                  
                  {/* Right eye - black hole style */}
                  <g transform={`translate(${eyePositions.rightEye.x}, ${eyePositions.rightEye.y})`}>
                    {/* Eye socket glow */}
                    <ellipse cx="190" cy="130" rx="38" ry="42" fill="#341677" opacity="0.3" filter="url(#starGlow)" />
                    
                    {/* Main eye void */}
                    <ellipse cx="190" cy="130" rx="35" ry="38" fill="url(#eyeVoid)">
                      <animate attributeName="rx" values="35; 36; 35" dur="3.5s" repeatCount="indefinite" />
                      <animate attributeName="ry" values="38; 39; 38" dur="3.5s" repeatCount="indefinite" />
                    </ellipse>
                    
                    {/* Event horizon rim */}
                    <ellipse cx="190" cy="130" rx="35" ry="38" stroke="#9d50bb" strokeWidth="1" fill="none" opacity="0.7">
                      <animate attributeName="opacity" values="0.7; 0.3; 0.7" dur="4.5s" repeatCount="indefinite" />
                    </ellipse>
                  </g>
                  
                  {/* Stars scattered throughout */}
                  <g>
                    {/* Brighter stars with glow */}
                    <circle cx="70" cy="60" r="1" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="1; 0.3; 1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="230" cy="70" r="1.5" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="0.7; 1; 0.7" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="180" r="1" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="0.5; 1; 0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="210" cy="220" r="1" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="0.8; 0.2; 0.8" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="70" r="1.5" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="0.6; 1; 0.6" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="250" cy="150" r="1" fill="white" filter="url(#starGlow)">
                      <animate attributeName="opacity" values="1; 0.5; 1" dur="3s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Dimmer background stars */}
                    <circle cx="90" cy="240" r="0.5" fill="white" opacity="0.7" />
                    <circle cx="170" cy="260" r="0.5" fill="white" opacity="0.6" />
                    <circle cx="40" cy="120" r="0.5" fill="white" opacity="0.5" />
                    <circle cx="260" cy="100" r="0.5" fill="white" opacity="0.7" />
                    <circle cx="100" cy="50" r="0.5" fill="white" opacity="0.6" />
                    <circle cx="200" cy="40" r="0.5" fill="white" opacity="0.5" />
                  </g>
                  
                  {/* Energy streams */}
                  <path d="M90,160 C120,170 180,170 210,160" stroke="#9d50bb" strokeWidth="1" fill="none" opacity="0.5">
                    <animate attributeName="d" 
                             values="M90,160 C120,170 180,170 210,160;
                                     M90,165 C120,175 180,175 210,165;
                                     M90,160 C120,170 180,170 210,160" 
                             dur="7s" 
                             repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5; 0.7; 0.5" dur="5s" repeatCount="indefinite" />
                  </path>
                  
                  <path d="M70,140 C100,150 200,150 230,140" stroke="#c13584" strokeWidth="1" fill="none" opacity="0.4">
                    <animate attributeName="d" 
                             values="M70,140 C100,150 200,150 230,140;
                                     M70,145 C100,155 200,155 230,145;
                                     M70,140 C100,150 200,150 230,140" 
                             dur="8s" 
                             repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4; 0.6; 0.4" dur="6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
              <span className="nebula-heading text-2xl">Nebula Chat</span>
            </motion.div>
          </motion.div>

          {/* API Key Settings & Wallet Button */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* API Key Settings Button */}
            <div className="flex gap-2">
              <button
                onClick={handleSettingsClick}
                className="flex items-center text-sm px-4 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-light transition-colors border border-primary/10"
              >
                {isConfigured ? 'Update API Keys' : 'Set API Keys'}
              </button>
              
              {isConfigured && (
                <button
                  onClick={handleResetKeys}
                  className="flex items-center text-sm px-4 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors border border-red-500/10"
                >
                  Reset Keys
                </button>
              )}
            </div>
            
            {/* Wallet Button */}
            <WalletButton onAddressChange={onWalletConnect} />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
} 