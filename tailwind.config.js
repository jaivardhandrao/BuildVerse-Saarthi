/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom blue palette with softer tones
        blue: {
          50: '#f0f6ff',   // Extremely light blue (background)
          100: '#e6f2ff',  // Very light blue
          200: '#b3d9ff',  // Light blue
          300: '#80bfff',  // Soft blue
          400: '#4da6ff',  // Gentle blue
          500: '#1a8cff',  // Primary blue
          600: '#0073e6',  // Deeper blue
          700: '#005cb3',  // Dark blue
          800: '#004080',  // Very dark blue
          900: '#002b57',  // Darkest blue
        },
        gray: {
          50: '#f9fafb',   // Almost white
          100: '#f3f4f6',  // Very light gray
          200: '#e5e7eb',  // Light gray
          300: '#d1d5db',  // Soft gray
          400: '#9ca3af',  // Medium gray
          500: '#6b7280',  // Dark gray
          600: '#4b5563',  // Darker gray
          700: '#374151',  // Very dark gray
          800: '#1f2937',  // Almost black
          900: '#111827',  // Darkest gray
        }
      },
      boxShadow: {
        // Softer, more subtle shadows
        DEFAULT: '0 1px 3px 0 rgba(0, 92, 179, 0.1), 0 1px 2px 0 rgba(0, 92, 179, 0.06)',
        md: '0 4px 6px -1px rgba(0, 92, 179, 0.1), 0 2px 4px -1px rgba(0, 92, 179, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 92, 179, 0.1), 0 4px 6px -2px rgba(0, 92, 179, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 92, 179, 0.1), 0 10px 10px -5px rgba(0, 92, 179, 0.04)',
      },
      transitionProperty: {
        // Smoother transitions
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'shadow': 'box-shadow',
      },
      transitionDuration: {
        // Slightly slower, more elegant transitions
        DEFAULT: '300ms',
      },
      borderRadius: {
        // Softer, more modern rounded corners
        DEFAULT: '0.375rem',  // 6px
        'lg': '0.5rem',       // 8px
        'xl': '0.75rem',      // 12px
      }
    },
  },
  plugins: [],
}; 