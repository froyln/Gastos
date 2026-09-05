const plugin = require("tailwindcss/plugin");
const { light, dark } = require("./src/shared/colors");

function toRgbTriplet(hex) {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `${r} ${g} ${b}`;
}

function toCssVars(colors) {
  return Object.fromEntries(
    Object.entries(colors).map(([name, hex]) => [`--color-${name}`, toRgbTriplet(hex)])
  );
}

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": toCssVars(light),
        ".dark:root": toCssVars(dark),
      });
    }),
  ],
};
