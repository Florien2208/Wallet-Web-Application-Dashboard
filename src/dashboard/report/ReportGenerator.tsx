import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  description?: string;
}

interface Report {
  startDate: string;
  endDate: string;
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
}

const ReportGenerator = () => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Simulating data fetch - replace with your actual data fetching logic
  React.useEffect(() => {
    // Replace this with your actual API call
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const generateReport = (): void => {
    const filteredTransactions = transactions.filter(
      (t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate
    );

    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const report: Report = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      transactions: filteredTransactions,
      totalIncome: filteredTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: filteredTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      categoryBreakdown,
    };

    setCurrentReport(report);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: target.value,
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: target.value,
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={generateReport}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Generate Report
            </button>
          </div>

          {currentReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium mb-2">Total Income</h3>
                  <p className="text-2xl text-green-600">
                    ${currentReport.totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium mb-2">Total Expenses</h3>
                  <p className="text-2xl text-red-600">
                    ${currentReport.totalExpenses.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <LineChart data={currentReport.transactions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10B981"
                      name="Transaction Amount"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg mb-4">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(currentReport.categoryBreakdown).map(
                    ([category, amount]) => (
                      <div
                        key={category}
                        className="flex justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">{category}</span>
                        <span className="text-gray-700">
                          ${amount.toFixed(2)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
