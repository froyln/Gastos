import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import { ChipList } from "@/shared/ui/ChipList";
import type { Category } from "@/shared/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function CategoryPicker({ categories, selectedId, onSelect }: Props) {
  return (
    <ChipList
      items={categories}
      selectedId={selectedId}
      onSelect={onSelect}
      getId={(category) => category.id}
      getLabel={(category) => category.name}
      renderLeft={(category, selected) => (
        <Ionicons
          name={(category.icon as IconName) ?? "help-circle"}
          size={16}
          color={selected ? "#FFFFFF" : category.color}
        />
      )}
    />
  );
}
