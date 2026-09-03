import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { generateId } from "@/lib/id";
import { roundAmount } from "@/lib/money";
import { mmkvStorage } from "@/lib/storage";
import type { RecurringPayment } from "@/types";

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
  setAll: (recurringPayments: RecurringPayment[]) => void;
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
    (set) => ({
      recurringPayments: [],
      setAll: (recurringPayments) => set({ recurringPayments }),
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
        return payment;
      },
      updateRecurring: (id, changes) =>
        set((state) => ({
          recurringPayments: state.recurringPayments.map((payment) => {
            if (payment.id !== id) return payment;
            const next = { ...payment, ...changes };
            assertValidWindow(next.dayStart, next.dayEnd);
            return next;
          }),
        })),
      deleteRecurring: (id) =>
        set((state) => ({
          recurringPayments: state.recurringPayments.filter((payment) => payment.id !== id),
        })),
      setActive: (id, active) =>
        set((state) => ({
          recurringPayments: state.recurringPayments.map((payment) =>
            payment.id === id ? { ...payment, active } : payment,
          ),
        })),
      markPaid: (id, period) =>
        set((state) => ({
          recurringPayments: state.recurringPayments.map((payment) =>
            payment.id === id ? { ...payment, lastPaidPeriod: period } : payment,
          ),
        })),
    }),
    { name: "tracker.recurring", storage: createJSONStorage(() => mmkvStorage) },
  ),
);
