/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040605',
          900: '#060A08',
          800: '#0A120C',
          700: '#0E1810',
          600: '#122016',
        },
        forest: {
          900: '#0D2818',
          800: '#14532D',
          700: '#1A6B38',
          600: '#22894A',
          500: '#2DA85B',
        },
        turmeric: {
          500: '#EAB308',
          400: '#FCD34D',
          600: '#CA8A04',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        arabic: ['"Amiri"', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'expand': 'expand 0.3s ease-out',
        'shimmer': 'shimmer 3s linear infinite',
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
      },
    },
  },
  plugins: [],
};
