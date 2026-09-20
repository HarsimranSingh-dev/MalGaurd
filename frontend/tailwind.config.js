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
        // Warm off-white + charcoal + muted green color palette
        surface: {
          canvas:    '#f8f7f4',   // neutral primary background
          base:      '#f1ede6',   // sidebar / header / secondary section background
          panel:     '#ffffff',   // solid cards / panels
          elevated:  '#f5f2eb',   // elevated elements
          well:      '#f3efe8',   // code wells / table headers
          hover:     '#eae5dc',   // hover bg
        },
        // Border system - subtle, warm, neutral
        edge: {
          subtle:    '#eeeae2',
          default:   '#e5e0d8',
          strong:    '#d4cec4',
          focus:     '#226343',
        },
        // Accent: restrained muted forest green — professional, distinctive, natural
        accent: {
          50:  '#f2f8f4',
          100: '#e3f1e8',
          200: '#c5e3d1',
          300: '#97cdad',
          400: '#64b084',
          500: '#226343',   // main accent
          600: '#1b5036',   // button hover
          700: '#153e2a',
          800: '#103020',
          900: '#0a1f15',
        },
        // Semantic status tokens - solid, high-contrast, professional
        soc: {
          crimson:      '#a81c1c',
          crimsonMuted: '#fdf2f2',
          amber:        '#9a5b04',
          amberMuted:   '#fef8eb',
          emerald:      '#1b5e39',
          emeraldMuted: '#edf7f0',
          text:         '#1c1e21',   // primary dark readable text
          subtext:      '#525866',   // secondary text
          muted:        '#7c828d',   // subtle muted text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'panel':  '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'panel-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'card-glow': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'neon-cyan': '0 1px 3px 0 rgba(0, 0, 0, 0.05)' // override neon cyan shadow
      }
    },
  },
  plugins: [],
}
