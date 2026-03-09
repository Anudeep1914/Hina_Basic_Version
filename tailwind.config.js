/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./electron/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0A10',
        'bg-secondary': '#0D0D15',
        'bg-card': '#14141C',
        'bg-input': '#1C1C24',
        'border': '#1E1E28',
        'border-light': '#2A2A35',
        'text-primary': '#E0E0F0',
        'text-secondary': '#9090A0',
        'text-muted': '#555565',
        'hina-pink': '#FF6B9D',
        'hina-purple': '#B57BFF',
        'green': '#4CAF50',
        'blue': '#4FC3F7',
        'orange': '#FFA726',
        'red': '#EF5350'
      }
    }
  },
  plugins: []
}
