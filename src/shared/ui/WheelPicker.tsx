import { useMemo, useState } from "react";
import { Modal, type NativeSyntheticEvent, type NativeScrollEvent, Pressable, ScrollView, View } from "react-native";

import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";

type Props = {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

const ITEM_HEIGHT = 40;

export function WheelPicker({ label, hint, value, min, max, onChange, formatValue }: Props) {
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(value);
  const options = useMemo(() => Array.from({ length: max - min + 1 }, (_, index) => min + index), [min, max]);

  function open() {
    setPending(value);
    setVisible(true);
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clampedIndex = Math.min(options.length - 1, Math.max(0, index));
    setPending(min + clampedIndex);
  }

  function confirm() {
    onChange(pending);
    setVisible(false);
  }

  const display = formatValue ? formatValue(value) : String(value);

  return (
    <View className="gap-sm">
      <Text variant="subtitle">{label}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <Pressable
        onPress={open}
        className="min-h-11 flex-row items-center justify-center rounded-xl border border-border bg-surface px-md"
      >
        <Text variant="subtitle">{display}</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setVisible(false)} />
        <View className="gap-md rounded-t-2xl bg-surface p-lg">
          <Text variant="subtitle" className="text-center">
            {label}
          </Text>
          <View className="h-[200px] overflow-hidden">
            <View
              pointerEvents="none"
              className="absolute inset-x-0 top-[80px] h-10 border-y border-border"
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentOffset={{ x: 0, y: (pending - min) * ITEM_HEIGHT }}
              contentContainerClassName="py-[80px]"
              onMomentumScrollEnd={handleMomentumEnd}
            >
              {options.map((option) => (
                <View key={option} className="h-10 items-center justify-center">
                  <Text variant="subtitle" className={option === pending ? "" : "text-muted"}>
                    {formatValue ? formatValue(option) : String(option)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <Button label="Done" onPress={confirm} />
        </View>
      </Modal>
    </View>
  );
}
