import { router } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExpenseForm } from "@/features/expenses/ExpenseForm";
import { hapticSuccess } from "@/shared/lib/haptics";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";

export default function NewExpenseModal() {
  const addExpense = useExpenseStore((s) => s.addExpense);

  function handleSave(input: { amount: number; categoryId: string; walletId: string; merchant: string | null }) {
    addExpense({ ...input, date: new Date().toISOString() });
    hapticSuccess();
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg pb-xl">
        <ExpenseForm onSave={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}
