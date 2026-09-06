import { View } from "react-native";

import { ChipList } from "@/shared/ui/ChipList";
import type { Wallet } from "@/shared/types";

type Props = {
  wallets: Wallet[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function WalletPicker({ wallets, selectedId, onSelect }: Props) {
  return (
    <ChipList
      items={wallets}
      selectedId={selectedId}
      onSelect={onSelect}
      getId={(wallet) => wallet.id}
      getLabel={(wallet) => wallet.name}
      renderLeft={(wallet) => <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: wallet.color }} />}
    />
  );
}
