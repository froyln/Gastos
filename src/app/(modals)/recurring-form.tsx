import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, Switch, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryPicker } from "@/features/categories/CategoryPicker";
import { WalletPicker } from "@/features/wallets/WalletPicker";
import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";
import { hapticSuccess } from "@/shared/lib/haptics";
import { parseAmount } from "@/shared/lib/money";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useRecurringStore } from "@/features/recurring/useRecurringStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";

export default function RecurringFormModal() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const recurringPayments = useRecurringStore((s) => s.recurringPayments);
  const addRecurring = useRecurringStore((s) => s.addRecurring);
  const updateRecurring = useRecurringStore((s) => s.updateRecurring);
  const deleteRecurring = useRecurringStore((s) => s.deleteRecurring);
  const setActive = useRecurringStore((s) => s.setActive);

  const allCategories = useCategoryStore((s) => s.categories);
  const allWallets = useWalletStore((s) => s.wallets);
  const categories = useMemo(() => allCategories.filter((category) => !category.archived), [allCategories]);
  const wallets = useMemo(() => allWallets.filter((wallet) => !wallet.archived), [allWallets]);

  const payment = recurringPayments.find((item) => item.id === id);
  const isEditing = payment !== undefined;

  const [name, setName] = useState(payment?.name ?? "");
  const [amountText, setAmountText] = useState(payment ? String(payment.amount) : "");
  const [categoryId, setCategoryId] = useState<string | null>(payment?.categoryId ?? null);
  const [walletId, setWalletId] = useState(
    payment?.walletId ?? wallets.find((wallet) => wallet.isDefault)?.id ?? wallets[0]?.id ?? "",
  );
  const [dayStartText, setDayStartText] = useState(payment ? String(payment.dayStart) : "1");
  const [dayEndText, setDayEndText] = useState(payment ? String(payment.dayEnd) : "5");
  const [hourText, setHourText] = useState(payment ? String(payment.notificationHour) : "9");
  const [active, setActiveState] = useState(payment?.active ?? true);

  const amount = parseAmount(amountText);
  const dayStart = Math.round(Number(dayStartText)) || 0;
  const dayEnd = Math.round(Number(dayEndText)) || 0;
  const notificationHour = Math.min(23, Math.max(0, Math.round(Number(hourText)) || 0));

  const canSave =
    name.trim().length > 0 &&
    amount > 0 &&
    categoryId !== null &&
    walletId !== "" &&
    dayStart >= 1 &&
    dayStart <= 31 &&
    dayEnd >= 1 &&
    dayEnd <= 31 &&
    dayStart <= dayEnd;

  function handleSelectCategory(nextId: string) {
    setCategoryId((current) => (current === nextId ? null : nextId));
  }

  function handleSave() {
    if (!canSave || categoryId === null) return;

    if (payment) {
      updateRecurring(payment.id, { name: name.trim(), amount, categoryId, walletId, dayStart, dayEnd, notificationHour });
      if (active !== payment.active) setActive(payment.id, active);
    } else {
      addRecurring({ name: name.trim(), amount, categoryId, walletId, dayStart, dayEnd, notificationHour });
    }
    hapticSuccess();
    router.back();
  }

  function handleDelete() {
    if (!payment) return;
    Alert.alert("Delete recurring payment", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteRecurring(payment.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg p-lg">
        <View className="gap-sm">
          <Text variant="subtitle">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Rent, electricity, subscription..."
            placeholderTextColor={colors.muted}
            className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
          />
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Amount</Text>
          <TextInput
            value={amountText}
            onChangeText={setAmountText}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
          />
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Category</Text>
          <CategoryPicker categories={categories} selectedId={categoryId} onSelect={handleSelectCategory} />
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Wallet</Text>
          <WalletPicker wallets={wallets} selectedId={walletId} onSelect={setWalletId} />
        </View>

        <View className="flex-row gap-sm">
          <View className="flex-1 gap-sm">
            <Text variant="subtitle">Day start</Text>
            <TextInput
              value={dayStartText}
              onChangeText={setDayStartText}
              keyboardType="number-pad"
              className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
            />
          </View>
          <View className="flex-1 gap-sm">
            <Text variant="subtitle">Day end</Text>
            <TextInput
              value={dayEndText}
              onChangeText={setDayEndText}
              keyboardType="number-pad"
              className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
            />
          </View>
          <View className="flex-1 gap-sm">
            <Text variant="subtitle">Hour</Text>
            <TextInput
              value={hourText}
              onChangeText={setHourText}
              keyboardType="number-pad"
              className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
            />
          </View>
        </View>

        {isEditing ? (
          <View className="flex-row items-center justify-between">
            <Text variant="subtitle">Active</Text>
            <Switch value={active} onValueChange={setActiveState} trackColor={{ true: colors.accent, false: colors.border }} />
          </View>
        ) : null}

        <Button label="Save" onPress={handleSave} disabled={!canSave} />
        {isEditing ? <Button label="Delete" variant="secondary" onPress={handleDelete} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
