/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F4F0',
        obsidian: '#181615',
        champagne: '#C9B290',
        sand: '#D8C7B4',
        terracotta: '#C88A75',
        sage: '#A3B8AA',
        rose: '#D9A7B0',
        onyx: '#8E8B94'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Syne"', '"Cormorant Garamond"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.6s linear infinite',
        'ripple-pulse': 'ripplePulse 8s ease-in-out infinite'
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        ripplePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.28' },
          '50%': { transform: 'scale(1.06)', opacity: '0.45' }
        }
      }
    },
  },
  plugins: [],
};
