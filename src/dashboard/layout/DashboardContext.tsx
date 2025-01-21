import React, { createContext, useContext, useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Account, Category, Budget, Transaction } from "@/types";

interface DashboardContextType {
  accounts: Account[];
  categories: Category[];
  budgets: Budget[];
  transactions: Transaction[];
  notifications: any[];
  isAddingTransaction: boolean;
  setIsAddingTransaction: (value: boolean) => void;
  handleAddCategory: (category: Omit<Category, "id">) => void;
  handleAddBudget: (budget: Omit<Budget, "id" | "spent">) => void;
  handleAddTransaction: (transaction: Omit<Transaction, "id">) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const { notifications, addNotification } = useNotifications();

  // Data state
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Main Bank Account", balance: 5420.5, type: "BANK" },
    { id: 2, name: "Mobile Money", balance: 850.75, type: "MOBILE" },
    { id: 3, name: "Cash Wallet", balance: 200.0, type: "CASH" },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Handlers
  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: categories.length + 1,
    };
    setCategories([...categories, newCategory]);
    addNotification({
      id: Date.now(),
      message: `Category "${category.name}" added successfully`,
      type: "success",
    });
  };

  const handleAddBudget = (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget = {
      ...budget,
      id: budgets.length + 1,
      spent: 0,
    };
    setBudgets([...budgets, newBudget]);
    addNotification({
      id: Date.now(),
      message: `Budget set for ${
        categories.find((c) => c.id === budget.categoryId)?.name
      }`,
      type: "success",
    });
  };

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: transactions.length + 1,
    };

    // Update account balance
    const updatedAccounts = accounts.map((account) => {
      if (account.id === transaction.accountId) {
        return {
          ...account,
          balance: account.balance + transaction.amount,
        };
      }
      return account;
    });

    // Update budget spent amount
    const relevantBudget = budgets.find(
      (b) =>
        b.categoryId === transaction.categoryId &&
        transaction.date >= b.startDate &&
        transaction.date <= b.endDate
    );

    if (relevantBudget && transaction.type === "expense") {
      const updatedBudget = {
        ...relevantBudget,
        spent: relevantBudget.spent + Math.abs(transaction.amount),
      };

      const percentSpent = (updatedBudget.spent / updatedBudget.amount) * 100;
      if (percentSpent >= updatedBudget.notificationThreshold) {
        addNotification({
          id: Date.now(),
          message: `Budget Alert: You've used ${percentSpent.toFixed(
            1
          )}% of your ${
            categories.find((c) => c.id === updatedBudget.categoryId)?.name
          } budget`,
          type: "warning",
        });
      }

      setBudgets(
        budgets.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
      );
    }

    setAccounts(updatedAccounts);
    setTransactions([...transactions, newTransaction]);
    addNotification({
      id: Date.now(),
      message: "Transaction added successfully",
      type: "success",
    });
  };

  const value = {
    accounts,
    categories,
    budgets,
    transactions,
    notifications,
    isAddingTransaction,
    setIsAddingTransaction,
    handleAddCategory,
    handleAddBudget,
    handleAddTransaction,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
