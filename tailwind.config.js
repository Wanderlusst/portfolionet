/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Added for dark mode
  theme: {
    extend: {
      colors: {
        'gain': '#10b981',
        'loss': '#ef4444',
        'neutral': '#6b7280',
        // Supernatural Dark Theme Colors
        'dark-bg': '#000000', // Pure black background
        'dark-card': '#0a0a0a', // Deep black cards
        'dark-border': '#1a1a1a', // Subtle borders
        'dark-text': '#ffffff', // Pure white text
        'dark-text-secondary': '#a0a0a0', // Muted text
        'dark-accent': '#1e1e1e', // Accent elements
        'dark-hover': '#1a1a1a', // Hover states
        'dark-glow': '#00ffff', // Cyan glow effect
        'dark-purple': '#8b5cf6', // Purple accent
        'dark-blue': '#3b82f6', // Blue accent
        'dark-red': '#dc2626', // Red accent
        'dark-green': '#059669', // Green accent
      },
      boxShadow: {
        'supernatural': '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)',
        'dark-glow': '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.1)',
        'dark-card': '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'dark-hover': '0 12px 40px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(0, 255, 255, 0.1)',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)',
        'dark-radial': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)',
        'dark-mesh': 'linear-gradient(45deg, #000000 25%, transparent 25%), linear-gradient(-45deg, #000000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000000 75%), linear-gradient(-45deg, transparent 75%, #000000 75%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
