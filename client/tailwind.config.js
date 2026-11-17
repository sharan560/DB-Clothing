/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // DB Clothing Design System
        'db-white': '#FFFFFF',
        'db-off-white': '#FAF9F7',
        'db-ivory': '#F5F2ED',
        'db-cream': '#EDE8E0',
        'db-light-grey': '#E8E5E0',
        'db-mid-grey': '#9B9590',
        'db-grey': '#5C5751',
        'db-charcoal': '#2C2A27',
        'db-near-black': '#1A1917',
        'db-black': '#0D0C0B',
        'db-gold': 'var(--db-gold, #C5A880)',
        'db-neutral': {
          50: '#F9F8F6',
          100: '#F3F0EB',
          200: '#E6E1D8',
          300: '#D5CFC3',
          400: '#B0A898',
          500: '#8A8170',
          600: '#686050',
          700: '#4D473B',
          800: '#2C2A27',
          900: '#141312',
        },
        // Semantic
        'primary': '#1A1917',
        'primary-hover': '#2C2A27',
        'secondary': '#9B9590',
        'accent': '#C3A882',
        'success': '#4A7C59',
        'error': '#B85C4E',
      },
      fontFamily: {
        'editorial': ['var(--font-editorial, "Playfair Display")', 'Georgia', 'serif'],
        'sans': ['var(--font-sans, "Inter")', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.0', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      spacing: {
        'section': '6rem',
        'section-lg': '10rem',
        'container': '1440px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      backgroundImage: {
        'shimmer-gradient': 'linear-gradient(90deg, #f0ede8 25%, #e8e5e0 50%, #f0ede8 75%)',
        'radial-vignette': 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.85) 100%)',
      },
    },
  },
  plugins: [],
};
