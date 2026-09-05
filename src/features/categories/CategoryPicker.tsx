import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { FlatList, Pressable } from "react-native";

import { Text } from "@/shared/ui/Text";
import type { Category } from "@/shared/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(category) => category.id}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-sm px-lg"
      renderItem={({ item }) => {
        const selected = item.id === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(item.id)}
            className={`min-h-11 flex-row items-center gap-xs rounded-full border px-md ${
              selected ? "border-accent bg-accent" : "border-border bg-surface"
            }`}
          >
            <Ionicons
              name={(item.icon as IconName) ?? "help-circle"}
              size={16}
              color={selected ? "#FFFFFF" : item.color}
            />
            <Text variant="body" className={selected ? "text-white" : "text-text"}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
