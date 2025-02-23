import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Nebula Chat",
  description: "Chat with blockchain data using Nebula API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.variable} ${outfit.variable} font-sans h-full min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1 relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
