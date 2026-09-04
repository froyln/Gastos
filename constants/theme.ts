import { useColorScheme } from "react-native";

const lightColors = {
  background: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E5E5E5",
  text: "#111111",
  muted: "#6B7280",
  accent: "#2563EB",
  danger: "#DC2626",
};

const darkColors = {
  background: "#111111",
  surface: "#1C1C1E",
  border: "#2A2A2C",
  text: "#FAFAFA",
  muted: "#A1A1AA",
  accent: "#3B82F6",
  danger: "#F87171",
};

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkColors : lightColors;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
