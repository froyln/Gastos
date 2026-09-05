import { useColorScheme } from "react-native";

import { dark, light } from "@/shared/colors";

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}
