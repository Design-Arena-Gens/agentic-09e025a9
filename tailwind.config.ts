import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"]
      },
      colors: {
        brand: {
          50: "#f5f7fa",
          100: "#e9eff5",
          200: "#cfdbe8",
          300: "#b5c7da",
          400: "#809bbd",
          500: "#4b6fa0",
          600: "#3c5980",
          700: "#2d4360",
          800: "#1e2c40",
          900: "#0f1620"
        }
      }
    }
  },
  plugins: []
};

export default config;
