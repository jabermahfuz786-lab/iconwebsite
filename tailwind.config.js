/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matte: {
          950: '#040506',
          900: '#080A0C',
          800: '#0D0F12',
          700: '#0F1215',
          600: '#141A1E',
        },
        jet: {
          900: '#08090B',
          800: '#0D0F12',
          700: '#121619',
          600: '#1A1F23',
          500: '#222826',
        },
        neon: {
          50: '#F0FFF4',
          100: '#E0FFEC',
          200: '#B8FFD9',
          300: '#39FF14',
          400: '#00FF66',
          500: '#22CC10',
          600: '#1AA80D',
          700: '#13840A',
          800: '#0D6006',
          900: '#084004',
        },
        mint: {
          50: '#F0FFF4',
          100: '#E0FFEC',
          200: '#B8FFD9',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        bengali: ['"Hind Siliguri"', '"Noto Sans Bengali"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'expand': 'expand 0.3s ease-out',
        'shimmer': 'shimmer 3s linear infinite',
        'neon-pulse': 'neonPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-drift': 'neonDrift 25s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        expand: {
          '0%': { opacity: '0', maxHeight: '0' },
          '100%': { opacity: '1', maxHeight: '600px' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(57, 255, 20, 0.3), 0 0 16px rgba(57, 255, 20, 0.15)' },
          '50%': { boxShadow: '0 0 15px rgba(57, 255, 20, 0.5), 0 0 30px rgba(57, 255, 20, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};
