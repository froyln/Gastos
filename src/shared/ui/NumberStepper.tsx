import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
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

const HOLD_DELAY_MS = 350;
const REPEAT_INTERVAL_MS = 80;

export function NumberStepper({ label, hint, value, min, max, onChange, formatValue }: Props) {
  const colors = useThemeColors();
  const atMin = value <= min;
  const atMax = value >= max;

  const valueRef = useRef(value);
  valueRef.current = value;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopRepeat() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }

  useEffect(() => stopRepeat, []);

  function step(direction: 1 | -1) {
    const next = Math.min(max, Math.max(min, valueRef.current + direction));
    if (next !== valueRef.current) {
      valueRef.current = next;
      onChange(next);
    }
    return next;
  }

  function startRepeat(direction: 1 | -1) {
    step(direction);
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const next = step(direction);
        if (next === min || next === max) stopRepeat();
      }, REPEAT_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  }

  return (
    <View className="gap-sm">
      <Text variant="subtitle">{label}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <View className="min-h-11 flex-row items-center justify-between rounded-xl border border-border bg-surface px-xs">
        <Pressable
          onPressIn={() => startRepeat(-1)}
          onPressOut={stopRepeat}
          disabled={atMin}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons name="remove" size={20} color={atMin ? colors.border : colors.text} />
        </Pressable>
        <Text variant="subtitle">{formatValue ? formatValue(value) : String(value)}</Text>
        <Pressable
          onPressIn={() => startRepeat(1)}
          onPressOut={stopRepeat}
          disabled={atMax}
          className="h-11 w-11 items-center justify-center"
        >
          <Ionicons name="add" size={20} color={atMax ? colors.border : colors.text} />
        </Pressable>
      </View>
    </View>
  );
}
