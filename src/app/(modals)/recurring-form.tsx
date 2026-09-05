import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, Switch, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryPicker } from "@/features/categories/CategoryPicker";
import { WalletPicker } from "@/features/wallets/WalletPicker";
import { Button } from "@/shared/ui/Button";
import { HourPicker } from "@/shared/ui/HourPicker";
import { Text } from "@/shared/ui/Text";
import { WheelPicker } from "@/shared/ui/WheelPicker";
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
  const [dayStart, setDayStart] = useState(payment?.dayStart ?? 1);
  const [dayEnd, setDayEnd] = useState(payment?.dayEnd ?? 5);
  const [notificationHour, setNotificationHour] = useState(payment?.notificationHour ?? 9);
  const [active, setActiveState] = useState(payment?.active ?? true);

  const amount = parseAmount(amountText);

  const canSave =
    name.trim().length > 0 &&
    amount > 0 &&
    categoryId !== null &&
    walletId !== "" &&
    dayStart <= dayEnd;

  function handleDayStartChange(next: number) {
    setDayStart(next);
    if (next > dayEnd) setDayEnd(next);
  }

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

        <View className="gap-sm">
          <WheelPicker
            label="Day start"
            hint="Remind me the payment window opened"
            value={dayStart}
            min={1}
            max={31}
            onChange={handleDayStartChange}
          />
          <WheelPicker
            label="Day end"
            hint="Remind me again if still unpaid by this day"
            value={dayEnd}
            min={dayStart}
            max={31}
            onChange={setDayEnd}
          />
          <HourPicker label="Reminder hour" hint="24-hour local time" hour={notificationHour} onChange={setNotificationHour} />
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
