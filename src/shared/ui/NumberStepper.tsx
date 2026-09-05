import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";

type Props = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export function NumberStepper({ label, hint, value, min, max, onChange, formatValue }: Props) {
  const colors = useThemeColors();
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View className="gap-sm">
      <Text variant="subtitle">{label}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <View className="min-h-11 flex-row items-center justify-between rounded-xl border border-border bg-surface px-xs">
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons name="remove" size={20} color={atMin ? colors.border : colors.text} />
        </Pressable>
        <Text variant="subtitle">{formatValue ? formatValue(value) : String(value)}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons name="add" size={20} color={atMax ? colors.border : colors.text} />
        </Pressable>
      </View>
    </View>
  );
}
