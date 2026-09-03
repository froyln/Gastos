import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { isInPeriod } from "@/lib/date";
import { generateId } from "@/lib/id";
import { roundAmount } from "@/lib/money";
import { mmkvStorage } from "@/lib/storage";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useWalletStore } from "@/store/useWalletStore";
import type { Expense, Income } from "@/types";

type NewExpenseInput = {
  amount: number;
  categoryId: string;
  walletId: string;
  merchant?: string | null;
  note?: string | null;
  date: string;
  recurringId?: string | null;
};

type ExpenseChanges = Partial<NewExpenseInput>;

type NewIncomeInput = {
  amount: number;
  walletId: string;
  source?: string | null;
  date: string;
};

type ExpenseState = {
  expenses: Expense[];
  incomes: Income[];
  setAll: (expenses: Expense[], incomes: Income[]) => void;
  addExpense: (input: NewExpenseInput) => Expense;
  updateExpense: (id: string, changes: ExpenseChanges) => void;
  deleteExpense: (id: string) => void;
  addIncome: (input: NewIncomeInput) => Income;
};

function assertValidAmount(amount: number) {
  if (!(amount > 0)) throw new Error("Amount must be greater than 0");
}

function assertValidDate(date: string) {
  if (new Date(date).getTime() > Date.now()) throw new Error("Date cannot be in the future");
}

function assertCategoryExists(categoryId: string) {
  if (!useCategoryStore.getState().categories.some((category) => category.id === categoryId)) {
    throw new Error("Category not found");
  }
}

function assertWalletExists(walletId: string) {
  if (!useWalletStore.getState().wallets.some((wallet) => wallet.id === walletId)) {
    throw new Error("Wallet not found");
  }
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      incomes: [],
      setAll: (expenses, incomes) => set({ expenses, incomes }),
      addExpense: (input) => {
        assertValidAmount(input.amount);
        assertValidDate(input.date);
        assertCategoryExists(input.categoryId);
        assertWalletExists(input.walletId);

        const expense: Expense = {
          id: generateId(),
          amount: roundAmount(input.amount),
          categoryId: input.categoryId,
          walletId: input.walletId,
          merchant: input.merchant ?? null,
          note: input.note ?? null,
          date: input.date,
          createdAt: new Date().toISOString(),
          recurringId: input.recurringId ?? null,
        };

        useWalletStore.getState().adjustBalance(expense.walletId, -expense.amount);
        if (expense.merchant) {
          useCategoryStore.getState().addMerchant(expense.categoryId, expense.merchant);
        }
        set((state) => ({ expenses: [...state.expenses, expense] }));
        return expense;
      },
      updateExpense: (id, changes) => {
        const current = get().expenses.find((expense) => expense.id === id);
        if (!current) throw new Error("Expense not found");

        const next: Expense = {
          ...current,
          ...changes,
          amount: changes.amount !== undefined ? roundAmount(changes.amount) : current.amount,
        };

        assertValidAmount(next.amount);
        assertValidDate(next.date);
        assertCategoryExists(next.categoryId);
        assertWalletExists(next.walletId);

        useWalletStore.getState().adjustBalance(current.walletId, current.amount);
        useWalletStore.getState().adjustBalance(next.walletId, -next.amount);
        if (next.merchant) {
          useCategoryStore.getState().addMerchant(next.categoryId, next.merchant);
        }

        set((state) => ({
          expenses: state.expenses.map((expense) => (expense.id === id ? next : expense)),
        }));
      },
      deleteExpense: (id) => {
        const current = get().expenses.find((expense) => expense.id === id);
        if (!current) return;

        useWalletStore.getState().adjustBalance(current.walletId, current.amount);
        set((state) => ({ expenses: state.expenses.filter((expense) => expense.id !== id) }));
      },
      addIncome: (input) => {
        assertValidAmount(input.amount);
        assertWalletExists(input.walletId);

        const income: Income = {
          id: generateId(),
          amount: roundAmount(input.amount),
          walletId: input.walletId,
          source: input.source ?? null,
          date: input.date,
          createdAt: new Date().toISOString(),
        };

        useWalletStore.getState().adjustBalance(income.walletId, income.amount);
        set((state) => ({ incomes: [...state.incomes, income] }));
        return income;
      },
    }),
    { name: "tracker.expenses", storage: createJSONStorage(() => mmkvStorage) },
  ),
);

export function selectExpensesInPeriod(expenses: Expense[], period: string, monthStartDay: number): Expense[] {
  return expenses.filter((expense) => isInPeriod(expense.date, period, monthStartDay));
}

export function selectExpensesByCategory(expenses: Expense[], categoryId: string): Expense[] {
  return expenses.filter((expense) => expense.categoryId === categoryId);
}
