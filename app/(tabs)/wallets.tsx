import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/ui/EmptyState";
import { Text } from "@/components/ui/Text";
import { WalletCard } from "@/components/wallet/WalletCard";
import { useThemeColors } from "@/constants/theme";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useWalletStore } from "@/store/useWalletStore";
import type { Wallet } from "@/types";

export default function WalletsScreen() {
  const colors = useThemeColors();
  const allWallets = useWalletStore((s) => s.wallets);
  const currency = useSettingsStore((s) => s.currency);
  const wallets = useMemo(() => allWallets.filter((wallet) => !wallet.archived), [allWallets]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-lg pt-lg">
        <Text variant="title">Wallets</Text>
        <Pressable
          onPress={() => router.push("/modal/wallet-form")}
          className="min-h-11 min-w-11 items-center justify-center"
        >
          <Ionicons name="add-circle" size={28} color={colors.accent} />
        </Pressable>
      </View>
      {wallets.length === 0 ? (
        <EmptyState
          title="No wallets yet"
          description="Add a wallet to start tracking balances."
          actionLabel="Add wallet"
          onAction={() => router.push("/modal/wallet-form")}
        />
      ) : (
        <FlatList
          data={wallets}
          keyExtractor={(item: Wallet) => item.id}
          contentContainerClassName="gap-sm p-lg"
          renderItem={({ item }) => (
            <WalletCard
              wallet={item}
              currency={currency}
              onPress={() => router.push({ pathname: "/modal/wallet-form", params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
