import type { ReactNode } from "react";
import { FlatList, Pressable } from "react-native";

import { Text } from "@/shared/ui/Text";

type Props<T> = {
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  renderLeft?: (item: T, selected: boolean) => ReactNode;
};

export function ChipList<T>({ items, selectedId, onSelect, getId, getLabel, renderLeft }: Props<T>) {
  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={getId}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-sm px-lg"
      renderItem={({ item }) => {
        const selected = getId(item) === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(getId(item))}
            className={`min-h-11 flex-row items-center gap-xs rounded-full border px-md ${
              selected ? "border-accent bg-accent" : "border-border bg-surface"
            }`}
          >
            {renderLeft?.(item, selected)}
            <Text variant="body" className={selected ? "text-white" : "text-text"}>
              {getLabel(item)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
