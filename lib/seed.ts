import { seedCategories, seedWallets } from "@/constants/seed";
import { generateId } from "@/lib/id";
import { mmkv } from "@/lib/storage";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useWalletStore } from "@/store/useWalletStore";

const SCHEMA_VERSION = 1;
const SCHEMA_VERSION_KEY = "tracker.schemaVersion";

export function runSeedIfNeeded(): void {
  if (mmkv.getNumber(SCHEMA_VERSION_KEY) !== undefined) return;

  useCategoryStore.getState().setAll(seedCategories.map((category) => ({ ...category, id: generateId() })));
  useWalletStore.getState().setAll(seedWallets.map((wallet) => ({ ...wallet, id: generateId() })));

  mmkv.set(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
}
