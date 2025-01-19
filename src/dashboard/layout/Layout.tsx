import React, { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";





import { Account, Category, Budget, Transaction } from "@/types";
import TransactionList from "../component/TransactionList";
import Dashboard from "../Dashboard";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AddTransactionModal from "../component/AddTransactionModal";
import BudgetManager from "../budget/BudgetManager";
import CategoryManager from "../category/CategoryManager";
import ReportGenerator from "../report/ReportGenerator";

const Layout: React.FC = () => {
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
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

    if (relevantBudget && transaction.type === "EXPENSE") {
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
      message: `Transaction added successfully`,
      type: "success",
    });
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            accounts={accounts}
            transactions={transactions}
            categories={categories}
          />
        );
      case "transactions":
        return (
          <TransactionList
            transactions={transactions}
            accounts={accounts}
            categories={categories}
          />
        );
      case "categories":
        return (
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
          />
        );
      case "budgets":
        return (
          <BudgetManager
            categories={categories}
            budgets={budgets}
            onAddBudget={handleAddBudget}
          />
        );
      case "reports":
        return <ReportGenerator transactions={transactions} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Navbar
        isSidebarOpen={isSidebarOpen}
        notifications={notifications}
        setIsAddingTransaction={setIsAddingTransaction}
      />
      <div className={`pt-24 pb-8 px-8 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {renderContent()}
      </div>
      {isAddingTransaction && (
        <AddTransactionModal
          accounts={accounts}
          categories={categories}
          onAdd={handleAddTransaction}
          onClose={() => setIsAddingTransaction(false)}
        />
      )}
    </div>
  );
};

export default Layout;
