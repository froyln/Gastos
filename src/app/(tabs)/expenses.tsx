import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExpenseFilters } from "@/features/expenses/ExpenseFilters";
import { ExpenseRow } from "@/features/expenses/ExpenseRow";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Text } from "@/shared/ui/Text";
import { currentPeriod, formatDate, isInPeriod, shiftPeriod } from "@/shared/lib/date";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";
import type { Expense } from "@/shared/types";

export default function ExpensesScreen() {
  const allExpenses = useExpenseStore((s) => s.expenses);
  const allCategories = useCategoryStore((s) => s.categories);
  const allWallets = useWalletStore((s) => s.wallets);
  const currency = useSettingsStore((s) => s.currency);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);

  const [period, setPeriod] = useState(() => currentPeriod(monthStartDay));
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);

  const categories = useMemo(() => allCategories.filter((category) => !category.archived), [allCategories]);
  const wallets = useMemo(() => allWallets.filter((wallet) => !wallet.archived), [allWallets]);
  const categoryById = useMemo(() => new Map(allCategories.map((category) => [category.id, category])), [allCategories]);
  const walletById = useMemo(() => new Map(allWallets.map((wallet) => [wallet.id, wallet])), [allWallets]);

  const sections = useMemo(() => {
    const filtered = allExpenses
      .filter((expense) => isInPeriod(expense.date, period, monthStartDay))
      .filter((expense) => categoryId === null || expense.categoryId === categoryId)
      .filter((expense) => walletId === null || expense.walletId === walletId)
      .sort((a, b) => b.date.localeCompare(a.date));

    const groups = new Map<string, Expense[]>();
    for (const expense of filtered) {
      const day = expense.date.slice(0, 10);
      const group = groups.get(day) ?? [];
      group.push(expense);
      groups.set(day, group);
    }

    return Array.from(groups.values()).map((data) => ({ title: formatDate(data[0].date), data }));
  }, [allExpenses, period, monthStartDay, categoryId, walletId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ExpenseFilters
        period={period}
        onPrevPeriod={() => setPeriod((current) => shiftPeriod(current, -1))}
        onNextPeriod={() => setPeriod((current) => shiftPeriod(current, 1))}
        categories={categories}
        selectedCategoryId={categoryId}
        onSelectCategory={setCategoryId}
        wallets={wallets}
        selectedWalletId={walletId}
        onSelectWallet={setWalletId}
      />
      {sections.length === 0 ? (
        <EmptyState title="No expenses" description="Nothing recorded for this period yet." />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item: Expense) => item.id}
          contentContainerClassName="gap-xs px-lg pb-xl"
          renderSectionHeader={({ section }) => (
            <Text variant="caption" className="bg-background pb-xs pt-md">
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({ pathname: "/edit-expense", params: { id: item.id } })}>
              <ExpenseRow
                expense={item}
                category={categoryById.get(item.categoryId)}
                wallet={walletById.get(item.walletId)}
                currency={currency}
              />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
