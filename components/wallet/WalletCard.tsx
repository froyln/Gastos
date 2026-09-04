import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { formatAmount } from "@/lib/money";
import type { Wallet } from "@/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TYPE_ICONS: Record<Wallet["type"], IconName> = {
  cash: "cash",
  debit: "card",
  credit: "card",
  prepaid: "wallet",
};

type Props = {
  wallet: Wallet;
  currency: string;
  onPress: () => void;
};

export function WalletCard({ wallet, currency, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center gap-sm">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${wallet.color}1A` }}
        >
          <Ionicons name={TYPE_ICONS[wallet.type]} size={18} color={wallet.color} />
        </View>
        <View className="flex-1">
          <Text variant="body">{wallet.name}</Text>
          <Text variant="caption">{wallet.type}</Text>
        </View>
        <Text variant="amount">{formatAmount(wallet.balance, currency)}</Text>
      </Card>
    </Pressable>
  );
}
