import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { mmkvStorage } from "@/shared/lib/storage";
import type { Settings } from "@/shared/types";

type SettingsState = Settings & {
  setTheme: (theme: Settings["theme"]) => void;
  setCurrency: (currency: string) => void;
  setMonthStartDay: (day: number) => void;
  completeOnboarding: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      currency: "USD",
      monthStartDay: 1,
      onboardingDone: false,
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setMonthStartDay: (day) => set({ monthStartDay: Math.min(28, Math.max(1, day)) }),
      completeOnboarding: () => set({ onboardingDone: true }),
    }),
    { name: "tracker.settings", storage: createJSONStorage(() => mmkvStorage) },
  ),
);
