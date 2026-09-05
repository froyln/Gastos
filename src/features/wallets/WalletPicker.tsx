import { FlatList, Pressable, View } from "react-native";

import { Text } from "@/shared/ui/Text";
import type { Wallet } from "@/shared/types";

type Props = {
  wallets: Wallet[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function WalletPicker({ wallets, selectedId, onSelect }: Props) {
  return (
    <FlatList
      horizontal
      data={wallets}
      keyExtractor={(wallet) => wallet.id}
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
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <Text variant="body" className={selected ? "text-white" : "text-text"}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
