/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        background: '#F6F5F6',
        surface: '#D3D5DB',
        'surface-elevated': '#FEFBFB',
        'surface-hover': '#CDCFD6',
        'surface-active': '#CACCD3',

        primary: '#848C9F',
        'primary-foreground': '#FFFFFF',

        'primary-hover': '#7B8498',
        'primary-active': '#6B7489',
        'primary-disabled': '#B2B7C3',

        selected: '#848C9F',
        'selected-foreground': '#FFFFFF',
        'selected-hover': '#7B8498',
        'selected-active': '#6B7489',

        text: {
          primary: '#645C5D',
          heading: '#737E9C',
          muted: '#8C8884',
          subtle: '#A8A3A0',
          inverse: '#FFFFFF',
        },

        border: 'rgba(100,92,93,0.2)',
        'border-strong': 'rgba(100,92,93,0.35)',
      },
    },
  },
  plugins: [],
}

