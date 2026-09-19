/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          darkest: '#050811',
          bg: '#080d1a',
          surface: '#0f172a',
          card: '#0e1629',
          cardElevated: '#14203b',
          border: '#1e2d4e',
          borderLight: '#2c3f68',
          cyan: '#06b6d4',
          neon: '#22d3ee',
          emerald: '#10b981',
          amber: '#f59e0b',
          crimson: '#ef4444',
          violet: '#8b5cf6',
          muted: '#64748b',
          text: '#e2e8f0',
          subtext: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.35)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.35)',
        'neon-crimson': '0 0 18px rgba(239, 68, 68, 0.4)',
        'neon-amber': '0 0 15px rgba(245, 158, 11, 0.35)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 45, 78, 0.6)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'glow-line': 'glowLine 2s ease-in-out infinite alternate'
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glowLine: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
