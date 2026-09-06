import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateId } from "@/shared/lib/id";
import { isInPeriod } from "@/shared/lib/date";
import { roundAmount } from "@/shared/lib/money";
import { cancelRecurring, scheduleRecurring } from "@/features/recurring/notifications";
import { mmkvStorage } from "@/shared/lib/storage";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";
import type { Expense, RecurringPayment } from "@/shared/types";

type NewRecurringInput = {
  name: string;
  amount: number;
  categoryId: string;
  walletId: string;
  dayStart: number;
  dayEnd: number;
  notificationHour: number;
};

type RecurringChanges = Partial<NewRecurringInput>;

type RecurringState = {
  recurringPayments: RecurringPayment[];
  addRecurring: (input: NewRecurringInput) => RecurringPayment;
  updateRecurring: (id: string, changes: RecurringChanges) => void;
  deleteRecurring: (id: string) => void;
  setActive: (id: string, active: boolean) => void;
  markPaid: (id: string, period: string) => void;
};

function assertValidWindow(dayStart: number, dayEnd: number) {
  if (dayStart < 1 || dayStart > 31 || dayEnd < 1 || dayEnd > 31 || dayStart > dayEnd) {
    throw new Error("Invalid day window");
  }
}

export const useRecurringStore = create<RecurringState>()(
  persist(
    (set, get) => ({
      recurringPayments: [],
      addRecurring: (input) => {
        assertValidWindow(input.dayStart, input.dayEnd);

        const payment: RecurringPayment = {
          id: generateId(),
          name: input.name,
          amount: roundAmount(input.amount),
          categoryId: input.categoryId,
          walletId: input.walletId,
          dayStart: input.dayStart,
          dayEnd: input.dayEnd,
          notificationHour: input.notificationHour,
          active: true,
          lastPaidPeriod: null,
        };
        set((state) => ({ recurringPayments: [...state.recurringPayments, payment] }));
        scheduleRecurring(payment);
        return payment;
      },
      updateRecurring: (id, changes) => {
        let updated: RecurringPayment | undefined;
        set((state) => ({
          recurringPayments: state.recurringPayments.map((payment) => {
            if (payment.id !== id) return payment;
            const next = { ...payment, ...changes };
            assertValidWindow(next.dayStart, next.dayEnd);
            updated = next;
            return next;
          }),
        }));
        if (updated) scheduleRecurring(updated);
      },
      deleteRecurring: (id) => {
        set((state) => ({
          recurringPayments: state.recurringPayments.filter((payment) => payment.id !== id),
        }));
        cancelRecurring(id);
      },
      setActive: (id, active) => {
        let updated: RecurringPayment | undefined;
        set((state) => ({
          recurringPayments: state.recurringPayments.map((payment) => {
            if (payment.id !== id) return payment;
            updated = { ...payment, active };
            return updated;
          }),
        }));
        if (updated) scheduleRecurring(updated);
      },
      markPaid: (id, period) => {
        const payment = get().recurringPayments.find((item) => item.id === id);
        if (!payment || payment.lastPaidPeriod === period) return;

        useExpenseStore.getState().addExpense({
          amount: payment.amount,
          categoryId: payment.categoryId,
          walletId: payment.walletId,
          merchant: payment.name,
          note: null,
          date: new Date().toISOString(),
          recurringId: payment.id,
        });

        let updated: RecurringPayment | undefined;
        set((state) => ({
          recurringPayments: state.recurringPayments.map((item) => {
            if (item.id !== id) return item;
            updated = { ...item, lastPaidPeriod: period };
            return updated;
          }),
        }));
        if (updated) scheduleRecurring(updated);
      },
    }),
    { name: "tracker.recurring", storage: createJSONStorage(() => mmkvStorage) },
  ),
);

export function selectIsPaidInPeriod(
  expenses: Expense[],
  recurringId: string,
  period: string,
  monthStartDay: number,
): boolean {
  return expenses.some(
    (expense) => expense.recurringId === recurringId && isInPeriod(expense.date, period, monthStartDay),
  );
}
