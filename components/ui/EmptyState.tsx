import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View className="items-center justify-center gap-sm py-lg">
      <Text variant="subtitle" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text variant="caption" className="text-center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="mt-sm min-h-11 justify-center px-md">
          <Text variant="body" className="font-medium text-accent">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
