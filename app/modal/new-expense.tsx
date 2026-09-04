import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AmountInput } from "@/components/expense/AmountInput";
import { CategoryPicker } from "@/components/expense/CategoryPicker";
import { MerchantSuggestions } from "@/components/expense/MerchantSuggestions";
import { WalletPicker } from "@/components/expense/WalletPicker";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { parseAmount } from "@/lib/money";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useWalletStore } from "@/store/useWalletStore";

export default function NewExpenseModal() {
  const categories = useCategoryStore((s) => s.categories.filter((category) => !category.archived));
  const wallets = useWalletStore((s) => s.wallets.filter((wallet) => !wallet.archived));
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [amountText, setAmountText] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState(() => wallets.find((wallet) => wallet.isDefault)?.id ?? wallets[0]?.id ?? "");
  const [merchant, setMerchant] = useState("");

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const amount = parseAmount(amountText);
  const canSave = amount > 0 && categoryId !== null && walletId !== "";

  function handleSave() {
    if (!canSave || categoryId === null) return;
    addExpense({
      amount,
      categoryId,
      walletId,
      merchant: merchant.trim() || null,
      date: new Date().toISOString(),
    });
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg pb-xl">
        <AmountInput value={amountText} onChangeText={setAmountText} />

        <View className="gap-sm">
          <Text variant="subtitle" className="px-lg">
            Category
          </Text>
          <CategoryPicker categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
        </View>

        <View className="gap-sm">
          <Text variant="subtitle" className="px-lg">
            Wallet
          </Text>
          <WalletPicker wallets={wallets} selectedId={walletId} onSelect={setWalletId} />
        </View>

        <View className="gap-sm px-lg">
          <Text variant="subtitle">Merchant</Text>
          <TextInput
            value={merchant}
            onChangeText={setMerchant}
            placeholder="Optional"
            placeholderTextColor={colors.muted}
            className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
          />
        </View>
        {selectedCategory ? <MerchantSuggestions merchants={selectedCategory.merchants} onSelect={setMerchant} /> : null}

        <View className="px-lg">
          <Button label="Save" onPress={handleSave} disabled={!canSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
