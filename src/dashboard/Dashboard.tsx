import React from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import AccountCard from "./component/AccountCard";
import CashFlowChart from "./component/CashFlowChart";
import TransactionList from "./component/TransactionList";
import { useDashboard } from "./layout/DashboardContext";
import { Transaction } from "@/types";


const Dashboard: React.FC = () => {
  const { accounts, transactions, categories } = useDashboard();

  // Transform the transactions to match the required format
  const transformedTransactions: Transaction[] = transactions.map(
    (transaction) => ({
      ...transaction,
      _id: transaction.id.toString(),
      category: {
        ...categories.find((cat) => cat.id === transaction.categoryId)!,
        _id: categories
          .find((cat) => cat.id === transaction.categoryId)!
          .id.toString(),
      },
      account:
        accounts.find((acc) => acc.id === transaction.accountId)?.name || "",
    })
  );

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
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

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

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>
        <TransactionList transactions={transformedTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
