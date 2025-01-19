import React from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

import { Account, Transaction, Category } from "../types";
import AccountCard from "./component/AccountCard";
import CashFlowChart from "./component/CashFlowChart";
import TransactionList from "./component/TransactionList";

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({
  accounts,
  transactions,
  categories,
}) => {
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  // Calculate monthly income and expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold">
                ${totalBalance.toLocaleString()}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${monthlyIncome.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${monthlyExpenses.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <p
                className={`text-2xl font-bold ${
                  monthlyIncome - monthlyExpenses >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${(monthlyIncome - monthlyExpenses).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      {/* Cash Flow Chart */}
      <CashFlowChart
        data={[
          { name: "Jan", income: 4000, expenses: 2400 },
          { name: "Feb", income: 3000, expenses: 1398 },
          { name: "Mar", income: 2000, expenses: 9800 },
          { name: "Apr", income: 2780, expenses: 3908 },
          { name: "May", income: 1890, expenses: 4800 },
          { name: "Jun", income: 2390, expenses: 3800 },
        ]}
      />

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <TransactionList
          transactions={recentTransactions}
          accounts={accounts}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default Dashboard;
