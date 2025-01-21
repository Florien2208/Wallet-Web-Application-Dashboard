import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCookie } from "@/utils/cookieUtils";
import { BASE_URL } from "@/constans/constant";
import axios from "axios";

// Define all required interfaces
interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  subCategory?: SubCategory;
  account: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
}

// Define valid sort fields type
type SortableFields = "date" | "amount";

const TransactionList: React.FC<TransactionListProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortableFields>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, sortField, sortDirection]); // Added dependencies

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<Transaction[]>(
        `${BASE_URL}/api/v1/transactions`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("auth_token")}`,
          },
          params: {
            page: currentPage,
            limit: 20,
            sortField,
            sortDirection,
          },
        }
      );

      if (currentPage === 1) {
        setTransactions(response.data);
      } else {
        setTransactions((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.data.length === 20);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortableFields) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
    setTransactions([]);
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm((e.target as HTMLInputElement).value || "")
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {error && (
        <Alert className="m-4 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

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
                Subcategory
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
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">{transaction.description}</td>
                <td className="px-6 py-4 text-sm">
                  {transaction.category.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {transaction.subCategory?.name || "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {transaction.account.charAt(0).toUpperCase() +
                    transaction.account.slice(1).replace("_", " ")}
                </td>
                <td
                  className={`px-6 py-4 text-sm text-right whitespace-nowrap ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLoading && (
        <div className="p-4 text-center text-gray-500">
          Loading transactions...
        </div>
      )}

      {!isLoading && hasMore && (
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}

      {!isLoading && filteredTransactions.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
};

export default TransactionList;
