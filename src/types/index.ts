// src/types/index.ts
export interface Account {
  id: number;
  name: string;
  balance: number;
  type: "BANK" | "MOBILE" | "CASH";
}

// First, let's update the Category interface to make _id required
export interface Category {
  id: number;
  _id: string;  // Removed the optional marker (?)
  name: string;
  parentId?: number;
  subCategories?: Category[];
}

// Then update the Transaction interface to include the full references
export interface Transaction {
  id: number;
  _id: string;
  amount: number;
  description: string;
  categoryId: number;
  category: Category;  // This will now have a required _id field
  date: string;
  accountId: number;
  account: string;
  type: "income" | "expense";
}

// For completeness, let's define the TransactionListProps
export interface TransactionListProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
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