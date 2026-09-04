import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/constants/theme";
import { formatPeriod } from "@/lib/date";
import type { Category, Wallet } from "@/types";

type Props = {
  period: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  wallets: Wallet[];
  selectedWalletId: string | null;
  onSelectWallet: (id: string | null) => void;
};

export function ExpenseFilters({
  period,
  onPrevPeriod,
  onNextPeriod,
  categories,
  selectedCategoryId,
  onSelectCategory,
  wallets,
  selectedWalletId,
  onSelectWallet,
}: Props) {
  const colors = useThemeColors();

  return (
    <View className="gap-sm py-sm">
      <View className="flex-row items-center justify-between px-lg">
        <Pressable onPress={onPrevPeriod} className="min-h-11 min-w-11 items-center justify-center">
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text variant="subtitle">{formatPeriod(period)}</Text>
        <Pressable onPress={onNextPeriod} className="min-h-11 min-w-11 items-center justify-center">
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-sm px-lg">
        <Pressable
          onPress={() => onSelectCategory(null)}
          className={`min-h-11 justify-center rounded-full border px-md ${
            selectedCategoryId === null ? "border-accent bg-accent" : "border-border bg-surface"
          }`}
        >
          <Text variant="body" className={selectedCategoryId === null ? "text-white" : "text-text"}>
            All categories
          </Text>
        </Pressable>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className={`min-h-11 justify-center rounded-full border px-md ${
              selectedCategoryId === category.id ? "border-accent bg-accent" : "border-border bg-surface"
            }`}
          >
            <Text variant="body" className={selectedCategoryId === category.id ? "text-white" : "text-text"}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-sm px-lg">
        <Pressable
          onPress={() => onSelectWallet(null)}
          className={`min-h-11 justify-center rounded-full border px-md ${
            selectedWalletId === null ? "border-accent bg-accent" : "border-border bg-surface"
          }`}
        >
          <Text variant="body" className={selectedWalletId === null ? "text-white" : "text-text"}>
            All wallets
          </Text>
        </Pressable>
        {wallets.map((wallet) => (
          <Pressable
            key={wallet.id}
            onPress={() => onSelectWallet(wallet.id)}
            className={`min-h-11 justify-center rounded-full border px-md ${
              selectedWalletId === wallet.id ? "border-accent bg-accent" : "border-border bg-surface"
            }`}
          >
            <Text variant="body" className={selectedWalletId === wallet.id ? "text-white" : "text-text"}>
              {wallet.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
