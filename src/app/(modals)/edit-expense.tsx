import { router, useLocalSearchParams } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExpenseForm } from "@/features/expenses/ExpenseForm";
import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { hapticSuccess } from "@/shared/lib/haptics";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";

export default function EditExpenseModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expense = useExpenseStore((s) => s.expenses.find((item) => item.id === id));
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  if (!expense) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text variant="body">Expense not found</Text>
      </SafeAreaView>
    );
  }

  function handleSave(input: { amount: number; categoryId: string; walletId: string; merchant: string | null }) {
    updateExpense(expense!.id, input);
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
        <ExpenseForm initialExpense={expense} onSave={handleSave}>
          <Button label="Delete" variant="secondary" onPress={handleDelete} />
        </ExpenseForm>
      </ScrollView>
    </SafeAreaView>
  );
}
