import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateId } from "@/lib/id";
import { roundAmount } from "@/lib/money";
import { mmkvStorage } from "@/lib/storage";
import type { Wallet, WalletType } from "@/types";

type NewWalletInput = {
  name: string;
  type: WalletType;
  color: string;
  initialBalance: number;
};

type WalletState = {
  wallets: Wallet[];
  setAll: (wallets: Wallet[]) => void;
  addWallet: (input: NewWalletInput) => Wallet;
  updateWallet: (id: string, changes: Partial<Pick<Wallet, "name" | "type" | "color">>) => void;
  archiveWallet: (id: string) => void;
  adjustBalance: (id: string, delta: number) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallets: [],
      setAll: (wallets) => set({ wallets }),
      addWallet: (input) => {
        const wallet: Wallet = {
          id: generateId(),
          name: input.name,
          type: input.type,
          color: input.color,
          balance: roundAmount(input.initialBalance),
          initialBalance: roundAmount(input.initialBalance),
          isDefault: false,
          archived: false,
        };
        set((state) => ({ wallets: [...state.wallets, wallet] }));
        return wallet;
      },
      updateWallet: (id, changes) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) => (wallet.id === id ? { ...wallet, ...changes } : wallet)),
        })),
      archiveWallet: (id) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) => (wallet.id === id ? { ...wallet, archived: true } : wallet)),
        })),
      adjustBalance: (id, delta) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.id === id ? { ...wallet, balance: roundAmount(wallet.balance + delta) } : wallet,
          ),
        })),
    }),
    { name: "tracker.wallets", storage: createJSONStorage(() => mmkvStorage) },
  ),
);
