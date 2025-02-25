'use client';

import { ReactNode } from 'react';

interface ThirdwebProviderWrapperProps {
  children: ReactNode;
}

export default function ThirdwebProviderWrapper({ children }: ThirdwebProviderWrapperProps) {
  return <>{children}</>;
} 