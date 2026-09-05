import type { Category, Wallet } from "@/shared/types";
import { generateId } from "@/shared/lib/id";
import { mmkv } from "@/shared/lib/storage";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";

export const seedCategories: Omit<Category, "id">[] = [
  { name: "Housing", icon: "home", color: "#2563EB", isDefault: true, archived: false, merchants: [] },
  { name: "Utilities", icon: "flash", color: "#F59E0B", isDefault: true, archived: false, merchants: [] },
  { name: "Food & Groceries", icon: "fast-food", color: "#16A34A", isDefault: true, archived: false, merchants: [] },
  { name: "Transportation", icon: "car", color: "#0891B2", isDefault: true, archived: false, merchants: [] },
  { name: "Entertainment", icon: "film", color: "#DB2777", isDefault: true, archived: false, merchants: [] },
  { name: "Health & Fitness", icon: "fitness", color: "#DC2626", isDefault: true, archived: false, merchants: [] },
  { name: "General Shopping", icon: "bag", color: "#7C3AED", isDefault: true, archived: false, merchants: [] },
];

export const seedWallets: Omit<Wallet, "id">[] = [
  { name: "Cash", type: "cash", color: "#16A34A", balance: 0, initialBalance: 0, isDefault: true, archived: false },
  { name: "Credit Card", type: "credit", color: "#DC2626", balance: 0, initialBalance: 0, isDefault: false, archived: false },
  { name: "Debit Card", type: "debit", color: "#2563EB", balance: 0, initialBalance: 0, isDefault: false, archived: false },
];

const SCHEMA_VERSION = 1;
const SCHEMA_VERSION_KEY = "tracker.schemaVersion";

export function runSeedIfNeeded(): void {
  if (mmkv.getNumber(SCHEMA_VERSION_KEY) !== undefined) return;

  useCategoryStore.getState().setAll(seedCategories.map((category) => ({ ...category, id: generateId() })));
  useWalletStore.getState().setAll(seedWallets.map((wallet) => ({ ...wallet, id: generateId() })));

  mmkv.set(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
}
