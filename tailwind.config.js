/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        "forest-dark": "#0a1628",
        "forest-green": "#1a4731",
        "leaf-green": "#2d7a4f",
        "light-green": "#4caf7d",
        "glow-green": "#00ff88",
        gold: "#ffd700",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0,255,136,0.7)" },
        },
      },
    },
  },
  plugins: [],
};

