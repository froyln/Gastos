/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      colors: {
        background: "#FAFAFA",
        surface: "#FFFFFF",
        border: "#E5E5E5",
        text: "#111111",
        muted: "#6B7280",
        accent: "#2563EB",
        danger: "#DC2626",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
