import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AmountInput } from "@/components/expense/AmountInput";
import { CategoryPicker } from "@/components/expense/CategoryPicker";
import { MerchantSuggestions } from "@/components/expense/MerchantSuggestions";
import { WalletPicker } from "@/components/expense/WalletPicker";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/constants/theme";
import { hapticSuccess } from "@/lib/haptics";
import { parseAmount } from "@/lib/money";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useWalletStore } from "@/store/useWalletStore";

export default function EditExpenseModal() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const allExpenses = useExpenseStore((s) => s.expenses);
  const allCategories = useCategoryStore((s) => s.categories);
  const allWallets = useWalletStore((s) => s.wallets);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const expense = allExpenses.find((item) => item.id === id);
  const categories = useMemo(() => allCategories.filter((category) => !category.archived), [allCategories]);
  const wallets = useMemo(() => allWallets.filter((wallet) => !wallet.archived), [allWallets]);

  const [amountText, setAmountText] = useState(() => (expense ? String(expense.amount) : ""));
  const [categoryId, setCategoryId] = useState<string | null>(expense?.categoryId ?? null);
  const [walletId, setWalletId] = useState(expense?.walletId ?? "");
  const [merchant, setMerchant] = useState(expense?.merchant ?? "");

  if (!expense) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text variant="body">Expense not found</Text>
      </SafeAreaView>
    );
  }

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const amount = parseAmount(amountText);
  const canSave = amount > 0 && categoryId !== null && walletId !== "";

  function handleSelectCategory(nextId: string) {
    setCategoryId((current) => (current === nextId ? null : nextId));
  }

  function handleSave() {
    if (!canSave || categoryId === null) return;
    updateExpense(expense!.id, {
      amount,
      categoryId,
      walletId,
      merchant: merchant.trim() || null,
    });
    hapticSuccess();
    router.back();
  }

  function handleDelete() {
    Alert.alert("Delete expense", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteExpense(expense!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg pb-xl">
        <AmountInput value={amountText} onChangeText={setAmountText} />

        <View className="gap-sm">
          <Text variant="subtitle" className="px-lg">
            Category
          </Text>
          <CategoryPicker categories={categories} selectedId={categoryId} onSelect={handleSelectCategory} />
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

        <View className="gap-sm px-lg">
          <Button label="Save" onPress={handleSave} disabled={!canSave} />
          <Button label="Delete" variant="secondary" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
