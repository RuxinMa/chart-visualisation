/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color palette for charts (colorblind-friendly)
        chart: {
          blue: '#0173B2',
          orange: '#DE8F05',
          green: '#029E73',
          purple: '#CC78BC',
          red: '#D55E00',
          cyan: '#56B4E9',
        }
      }
    },
  },
  plugins: [],
}