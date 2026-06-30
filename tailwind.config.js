/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-neutral': 'var(--color-bg-neutral)',
        'pink-bubblegum': 'var(--color-pink-bubblegum)',
        chocolate: 'var(--color-chocolate)',
        'accent-cyan': 'var(--color-accent-cyan)',
        'accent-mustard': 'var(--color-accent-mustard)',
        'pastel-green': 'var(--color-pastel-green)',
        'glass-bg': 'var(--color-glass-bg)',
        'glass-border': 'var(--color-glass-border)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-default)',
      },
      transitionDuration: {
        hover: 'var(--duration-hover)',
      }
    },
  },
  plugins: [],
}
