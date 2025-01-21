// src/types/index.ts
export interface Account {
  id: number;
  name: string;
  balance: number;
  type: "BANK" | "MOBILE" | "CASH";
}

export interface Category {
  id: number;
  _id?:string;
  name: string;
  parentId?: number;
  subCategories?: Category[];
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  date: string;
  accountId: number;
  type: "INCOME" | "EXPENSE";
}

export interface Budget {
  id: number;
  categoryId: number;
  amount: number;
  spent: number;
  startDate: string;
  endDate: string;
  notificationThreshold: number;
}

export interface Report {
  startDate: string;
  endDate: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
}
export interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}
export type AccountType = "bank" | "mobile_money" | "cash";
export type TransactionType = "income" | "expense";