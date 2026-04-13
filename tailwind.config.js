/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        background: '#FCF9F9',
        surface: '#EBE4E5',
        'surface-elevated': '#FEFBFB',
        'surface-hover': '#E3DADB',
        'surface-active': '#DDD2D4',

        primary: '#A57784',
        'primary-foreground': '#FFFFFF',

        'primary-hover': '#9B6A77',
        'primary-active': '#7E5561',
        'primary-disabled': '#D6C7CB',

        selected: '#C3E8FC',
        'selected-foreground': '#2E3A40',
        'selected-hover': '#B4DDF6',
        'selected-active': '#A7D3EE',

        text: {
          primary: '#645C5D',
          heading: '#8A475A',
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

