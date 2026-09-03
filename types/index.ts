export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  archived: boolean;
  merchants: string[];
};

export type WalletType = "cash" | "debit" | "credit" | "prepaid";

export type Wallet = {
  id: string;
  name: string;
  type: WalletType;
  color: string;
  balance: number;
  initialBalance: number;
  isDefault: boolean;
  archived: boolean;
};

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  walletId: string;
  merchant: string | null;
  note: string | null;
  date: string;
  createdAt: string;
  recurringId: string | null;
};

export type Income = {
  id: string;
  amount: number;
  walletId: string;
  source: string | null;
  date: string;
  createdAt: string;
};

export type RecurringPayment = {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  walletId: string;
  dayStart: number;
  dayEnd: number;
  notificationHour: number;
  active: boolean;
  lastPaidPeriod: string | null;
};

export type Budget = {
  id: string;
  categoryId: string | null;
  amount: number;
  period: string;
};

export type Settings = {
  theme: "system" | "light" | "dark";
  currency: string;
  monthStartDay: number;
  onboardingDone: boolean;
};
