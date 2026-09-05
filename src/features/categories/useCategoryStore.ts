import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateId } from "@/shared/lib/id";
import { mmkvStorage } from "@/shared/lib/storage";
import type { Category } from "@/shared/types";

type NewCategoryInput = {
  name: string;
  icon: string;
  color: string;
};

type CategoryState = {
  categories: Category[];
  setAll: (categories: Category[]) => void;
  addCategory: (input: NewCategoryInput) => Category;
  updateCategory: (id: string, changes: Partial<NewCategoryInput>) => void;
  archiveCategory: (id: string) => void;
  addMerchant: (categoryId: string, merchant: string) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      setAll: (categories) => set({ categories }),
      addCategory: (input) => {
        const category: Category = {
          id: generateId(),
          name: input.name,
          icon: input.icon,
          color: input.color,
          isDefault: false,
          archived: false,
          merchants: [],
        };
        set((state) => ({ categories: [...state.categories, category] }));
        return category;
      },
      updateCategory: (id, changes) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...changes } : category,
          ),
        })),
      archiveCategory: (id) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, archived: true } : category,
          ),
        })),
      addMerchant: (categoryId, merchant) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === categoryId && !category.merchants.includes(merchant)
              ? { ...category, merchants: [...category.merchants, merchant] }
              : category,
          ),
        })),
    }),
    { name: "tracker.categories", storage: createJSONStorage(() => mmkvStorage) },
  ),
);
