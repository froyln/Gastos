import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { TextInput, View } from "react-native";

import { AmountInput } from "@/features/expenses/AmountInput";
import { CategoryPicker } from "@/features/categories/CategoryPicker";
import { MerchantSuggestions } from "@/features/expenses/MerchantSuggestions";
import { WalletPicker } from "@/features/wallets/WalletPicker";
import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";
import { parseAmount } from "@/shared/lib/money";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";
import type { Expense } from "@/shared/types";

type SaveInput = {
  amount: number;
  categoryId: string;
  walletId: string;
  merchant: string | null;
};

type Props = {
  initialExpense?: Expense;
  onSave: (input: SaveInput) => void;
  children?: ReactNode;
};

export function ExpenseForm({ initialExpense, onSave, children }: Props) {
  const colors = useThemeColors();
  const allCategories = useCategoryStore((s) => s.categories);
  const allWallets = useWalletStore((s) => s.wallets);
  const categories = useMemo(() => allCategories.filter((category) => !category.archived), [allCategories]);
  const wallets = useMemo(() => allWallets.filter((wallet) => !wallet.archived), [allWallets]);

  const [amountText, setAmountText] = useState(() => (initialExpense ? String(initialExpense.amount) : ""));
  const [categoryId, setCategoryId] = useState<string | null>(initialExpense?.categoryId ?? null);
  const [walletId, setWalletId] = useState(
    initialExpense?.walletId ?? wallets.find((wallet) => wallet.isDefault)?.id ?? wallets[0]?.id ?? "",
  );
  const [merchant, setMerchant] = useState(initialExpense?.merchant ?? "");

  const selectedCategory = categories.find((category) => category.id === categoryId);
  const amount = parseAmount(amountText);
  const canSave = amount > 0 && categoryId !== null && walletId !== "";

  function handleSelectCategory(id: string) {
    setCategoryId((current) => (current === id ? null : id));
  }

  function handleSave() {
    if (!canSave || categoryId === null) return;
    onSave({ amount, categoryId, walletId, merchant: merchant.trim() || null });
  }

  return (
    <>
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
        {children}
      </View>
    </>
  );
}
