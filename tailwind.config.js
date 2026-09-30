/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          900: '#0A0604',
          800: '#120A06',
          700: '#1E110B',
          600: '#2A1810',
          500: '#3A2418',
        },
        amber: {
          50: '#FFF8F0',
          100: '#F5D5A0',
          200: '#F5D5A0',
          300: '#E6A15C',
          400: '#D4A373',
          500: '#C08B5B',
          600: '#A6724A',
          700: '#855A38',
          800: '#634228',
          900: '#412A18',
        },
        rose: {
          gold: '#D4A373',
        },
        cream: {
          50: '#FDFBFA',
          100: '#F5E6D3',
          200: '#E8D5C0',
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
        'warm-pulse': 'warmPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'warm-drift': 'warmDrift 25s ease-in-out infinite alternate',
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
        warmPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(230, 161, 92, 0.3), 0 0 16px rgba(230, 161, 92, 0.15)' },
          '50%': { boxShadow: '0 0 15px rgba(230, 161, 92, 0.5), 0 0 30px rgba(230, 161, 92, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};
