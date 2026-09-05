import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/shared/ui/Button";
import { Text } from "@/shared/ui/Text";
import { useThemeColors } from "@/shared/theme";
import { hapticSuccess } from "@/shared/lib/haptics";
import { parseAmount } from "@/shared/lib/money";
import { requestPermissions } from "@/features/recurring/notifications";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const wallets = useWalletStore((s) => s.wallets);
  const setInitialBalance = useWalletStore((s) => s.setInitialBalance);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const [balances, setBalances] = useState<Record<string, string>>({});

  function handleFinish() {
    for (const wallet of wallets) {
      const text = balances[wallet.id];
      if (text !== undefined) {
        setInitialBalance(wallet.id, parseAmount(text));
      }
    }
    completeOnboarding();
    hapticSuccess();
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg p-lg">
        <View className="gap-xs">
          <Text variant="title">Welcome</Text>
          <Text variant="body">Set how much money is in each wallet to start tracking accurately.</Text>
        </View>

        <View className="gap-sm">
          {wallets.map((wallet) => (
            <View key={wallet.id} className="gap-xs">
              <Text variant="subtitle">{wallet.name}</Text>
              <TextInput
                value={balances[wallet.id] ?? ""}
                onChangeText={(text) => setBalances((current) => ({ ...current, [wallet.id]: text }))}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.muted}
                className="min-h-11 rounded-xl border border-border bg-surface px-md text-text"
              />
            </View>
          ))}
        </View>

        <View className="gap-xs">
          <Text variant="subtitle">Reminders</Text>
          <Text variant="caption">
            Get notified when a recurring bill's payment window opens or is about to close. You can skip this and
            enable it later in Settings.
          </Text>
          <Button label="Enable notifications" variant="secondary" onPress={() => requestPermissions()} />
        </View>

        <Button label="Get started" onPress={handleFinish} />
      </ScrollView>
    </SafeAreaView>
  );
}
