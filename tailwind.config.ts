import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        // Core theme colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#EC4899', // pink-500
          light: '#F9A8D4', // pink-300
          dark: '#BE185D', // pink-700
        },
        accent: {
          DEFAULT: '#7C3AED', // purple-600
          light: '#A78BFA', // purple-400
          dark: '#5B21B6', // purple-800
        },
        glass: {
          DEFAULT: 'rgba(17, 17, 27, 0.7)',
          light: 'rgba(17, 17, 27, 0.5)',
          dark: 'rgba(17, 17, 27, 0.9)',
        },
        surface: {
          DEFAULT: '#1E1E2E',
          light: '#27273A',
          dark: '#11111B',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
        'gradient-border': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(236, 72, 153, 0.3)',
        'glow-strong': '0 0 30px -5px rgba(236, 72, 153, 0.5)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#fff',
            a: {
              color: '#EC4899',
              '&:hover': {
                color: '#F9A8D4',
              },
            },
            strong: {
              color: '#fff',
            },
            h1: {
              color: '#fff',
              fontWeight: '700',
            },
            h2: {
              color: '#fff',
              fontWeight: '600',
            },
            h3: {
              color: '#fff',
              fontWeight: '600',
            },
            h4: {
              color: '#fff',
              fontWeight: '500',
            },
            code: {
              color: '#2dd4bf',
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgba(17, 17, 27, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
} satisfies Config;
