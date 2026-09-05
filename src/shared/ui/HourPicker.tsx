import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, View } from "react-native";

import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { WheelPicker } from "@/shared/ui/WheelPicker";

type Props = {
  label: string;
  hint?: string;
  hour: number;
  onChange: (hour: number) => void;
};

function hourToDate(hour: number): Date {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date;
}

export function HourPicker({ label, hint, hour, onChange }: Props) {
  const [visible, setVisible] = useState(false);

  if (Platform.OS === "web") {
    return (
      <WheelPicker
        label={label}
        hint={hint}
        value={hour}
        min={0}
        max={23}
        onChange={onChange}
        formatValue={(value) => `${String(value).padStart(2, "0")}:00`}
      />
    );
  }

  function handleValueChange(_event: DateTimePickerChangeEvent, date: Date) {
    onChange(date.getHours());
    if (Platform.OS === "android") setVisible(false);
  }

  return (
    <View className="gap-sm">
      <Text variant="subtitle">{label}</Text>
      {hint ? <Text variant="caption">{hint}</Text> : null}
      <Pressable
        onPress={() => setVisible(true)}
        className="min-h-11 flex-row items-center justify-center rounded-xl border border-border bg-surface px-md"
      >
        <Text variant="subtitle">{`${String(hour).padStart(2, "0")}:00`}</Text>
      </Pressable>

      {visible && Platform.OS === "android" ? (
        <DateTimePicker
          value={hourToDate(hour)}
          mode="time"
          is24Hour
          display="default"
          onValueChange={handleValueChange}
          onDismiss={() => setVisible(false)}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
          <Pressable className="flex-1 bg-black/40" onPress={() => setVisible(false)} />
          <View className="gap-md rounded-t-2xl bg-surface p-lg">
            <DateTimePicker
              value={hourToDate(hour)}
              mode="time"
              is24Hour
              display="spinner"
              onValueChange={handleValueChange}
            />
            <Button label="Done" onPress={() => setVisible(false)} />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
