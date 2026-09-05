import { TextInput, View } from "react-native";

import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";
import { useSettingsStore } from "@/features/settings/useSettingsStore";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export function AmountInput({ value, onChangeText }: Props) {
  const colors = useThemeColors();
  const currency = useSettingsStore((s) => s.currency);

  return (
    <View className="items-center gap-xs py-lg">
      <Text variant="caption">{currency}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        autoFocus
        placeholder="0.00"
        placeholderTextColor={colors.muted}
        className="min-w-32 text-center text-5xl font-bold text-text"
      />
    </View>
  );
}
