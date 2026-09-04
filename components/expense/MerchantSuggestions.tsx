import { FlatList, Pressable } from "react-native";

import { Text } from "@/components/ui/Text";

type Props = {
  merchants: string[];
  onSelect: (merchant: string) => void;
};

export function MerchantSuggestions({ merchants, onSelect }: Props) {
  if (merchants.length === 0) return null;

  return (
    <FlatList
      horizontal
      data={merchants}
      keyExtractor={(merchant) => merchant}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-sm px-lg"
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          className="min-h-11 justify-center rounded-full border border-border bg-surface px-md"
        >
          <Text variant="caption">{item}</Text>
        </Pressable>
      )}
    />
  );
}
