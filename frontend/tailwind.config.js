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
        // New neutral-charcoal surface system (no blue tint)
        surface: {
          canvas:    '#0e0f11',   // deepest bg
          base:      '#141618',   // sidebar / header
          panel:     '#191b1e',   // cards / panels
          elevated:  '#1e2126',   // raised elements
          well:      '#0b0c0e',   // code wells / terminals
          hover:     '#222629',   // hover bg
        },
        // Border system
        edge: {
          subtle:    '#21252c',   // barely visible
          default:   '#272c34',   // standard
          strong:    '#313840',   // interactive
          focus:     '#3e4650',   // hover/focus
        },
        // Accent: muted sage green — professional, distinctive, not neon
        accent: {
          50:  '#edf5f0',
          100: '#d4e9dc',
          200: '#a8d4bc',
          300: '#78bd99',
          400: '#52a97a',   // light text on dark
          500: '#3f9166',   // main accent
          600: '#347856',   // button background
          700: '#2a6346',   // button hover
          800: '#1f4e38',
          900: '#143224',
        },
        // Semantic — kept functional, same as before
        soc: {
          crimson:      '#e11d48',
          crimsonMuted: 'rgba(225, 29, 72, 0.10)',
          amber:        '#d97706',
          amberMuted:   'rgba(217, 119, 6, 0.10)',
          emerald:      '#059669',
          emeraldMuted: 'rgba(5, 150, 105, 0.10)',
          text:         '#dde1e7',
          subtext:      '#8b909a',
          muted:        '#565c68',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'panel':  '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'panel-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.6), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'card-glow': '0 1px 3px 0 rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
