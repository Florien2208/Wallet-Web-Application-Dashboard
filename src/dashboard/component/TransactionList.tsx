import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Transaction } from "../../types";
import { useDashboard } from "../layout/DashboardContext";

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  accounts?: Account[];
  categories?: Category[];
}

const TransactionList: React.FC<TransactionListProps> = (props) => {
  const contextData = useDashboard();

  // Use props if provided, otherwise fall back to context
  const transactions = props.transactions || contextData.transactions;
  const accounts = props.accounts || contextData.accounts;
  const categories = props.categories || contextData.categories;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getAccountName = (accountId: number) => {
    return accounts.find((a) => a.id === accountId)?.name || "Unknown Account";
  };

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((c) => c.id === categoryId)?.name || "Unknown Category"
    );
  };

  const sortedTransactions = [...transactions]
    .filter(
      (t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAccountName(t.accountId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        getCategoryName(t.categoryId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.currentTarget.value)
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortField === "date" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Account
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{transaction.description}</td>
                <td className="px-6 py-4 text-sm">
                  {getCategoryName(transaction.categoryId)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {getAccountName(transaction.accountId)}
                </td>
                <td
                  className={`px-6 py-4 text-sm text-right whitespace-nowrap ${
                    transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount >= 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
