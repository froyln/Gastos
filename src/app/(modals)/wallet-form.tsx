import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";
import { hapticSuccess } from "@/shared/lib/haptics";
import { parseAmount, roundAmount } from "@/shared/lib/money";
import { useWalletStore } from "@/features/wallets/useWalletStore";
import type { WalletType } from "@/shared/types";

const WALLET_COLORS = ["#16A34A", "#DC2626", "#2563EB", "#F59E0B", "#7C3AED", "#0891B2"];
const WALLET_TYPES: WalletType[] = ["cash", "debit", "credit", "prepaid"];

export default function WalletFormModal() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const wallets = useWalletStore((s) => s.wallets);
  const addWallet = useWalletStore((s) => s.addWallet);
  const updateWallet = useWalletStore((s) => s.updateWallet);
  const adjustBalance = useWalletStore((s) => s.adjustBalance);
  const archiveWallet = useWalletStore((s) => s.archiveWallet);

  const wallet = wallets.find((item) => item.id === id);
  const isEditing = wallet !== undefined;

  const [name, setName] = useState(wallet?.name ?? "");
  const [type, setType] = useState<WalletType>(wallet?.type ?? "cash");
  const [color, setColor] = useState(wallet?.color ?? WALLET_COLORS[0]);
  const [balanceText, setBalanceText] = useState(wallet ? String(wallet.balance) : "0");

  const canSave = name.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const balance = parseAmount(balanceText);

    if (wallet) {
      updateWallet(wallet.id, { name: name.trim(), type, color });
      const delta = roundAmount(balance - wallet.balance);
      if (delta !== 0) adjustBalance(wallet.id, delta);
    } else {
      addWallet({ name: name.trim(), type, color, initialBalance: balance });
    }
    hapticSuccess();
    router.back();
  }

  function handleArchive() {
    if (!wallet) return;
    Alert.alert("Archive wallet", "It will be hidden from pickers. History stays intact.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Archive",
        style: "destructive",
        onPress: () => {
          archiveWallet(wallet.id);
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
            placeholder="Wallet name"
            placeholderTextColor={colors.muted}
            className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
          />
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Type</Text>
          <View className="flex-row flex-wrap gap-sm">
            {WALLET_TYPES.map((walletType) => (
              <Pressable
                key={walletType}
                onPress={() => setType(walletType)}
                className={`min-h-11 justify-center rounded-full border px-md ${
                  type === walletType ? "border-accent bg-accent" : "border-border bg-surface"
                }`}
              >
                <Text variant="body" className={type === walletType ? "text-white" : "text-text"}>
                  {walletType}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Color</Text>
          <View className="flex-row flex-wrap gap-sm">
            {WALLET_COLORS.map((swatch) => (
              <Pressable
                key={swatch}
                onPress={() => setColor(swatch)}
                className={`h-11 w-11 items-center justify-center rounded-full border-2 ${
                  color === swatch ? "border-text" : "border-transparent"
                }`}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </View>
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">{isEditing ? "Current balance" : "Initial balance"}</Text>
          <TextInput
            value={balanceText}
            onChangeText={setBalanceText}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.muted}
            className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
          />
        </View>

        <Button label="Save" onPress={handleSave} disabled={!canSave} />
        {isEditing ? <Button label="Archive" variant="secondary" onPress={handleArchive} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
