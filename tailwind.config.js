/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#faf9f5',
        'surface-card': '#ffffff',
        'surface-soft': '#faf8f5',
        'surface-dark': '#181715',
        'surface-dark-elevated': '#252320',
        'surface-dark-soft': '#1f1e1b',
        primary: {
          DEFAULT: '#cc785c',
          active: '#a9583e',
          disabled: '#e6dfd8',
        },
        ink: {
          DEFAULT: '#141413',
          body: '#3d3d3a',
          strong: '#252523',
        },
        muted: {
          DEFAULT: '#6c6a64',
          soft: '#8e8b82',
        },
        hairline: {
          DEFAULT: '#e6dfd8',
          soft: '#ebe6df',
        },
        'on-dark': {
          DEFAULT: '#faf9f5',
          soft: '#a09d96',
        },
        status: {
          teal: '#5db8a6',
          amber: '#e8a55a',
          success: '#5db872',
          warning: '#d4a017',
          error: '#c64545',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Copernicus', 'Tiempos Headline', 'Georgia', 'serif'],
        sans: ['Inter', 'StyreneB', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      spacing: {
        section: '96px',
      },
      letterSpacing: {
        'tight-serif': '-0.025em',
        'display': '-0.035em',
      },
    },
  },
  plugins: [],
}
