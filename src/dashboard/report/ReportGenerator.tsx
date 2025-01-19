// src/components/reports/ReportGenerator.tsx
import React, { useState } from "react";
import { Report, Transaction } from "../../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

interface ReportGeneratorProps {
  transactions: Transaction[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ transactions }) => {
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const generateReport = (): Report => {
    const filteredTransactions = transactions.filter(
      (t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate
    );

    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return {
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
  };

  const [currentReport, setCurrentReport] = useState<Report | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Report Generator</h2>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => {
                if (e.target) {
                  setDateRange({
                    ...dateRange,
                    startDate: (e.target as HTMLInputElement).value,
                  });
                }
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => {
                if (e.target) {
                  setDateRange({
                    ...dateRange,
                    endDate: (e.target as HTMLInputElement).value,
                  });
                }
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={() => setCurrentReport(generateReport())}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      {currentReport && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentReport.transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Category Breakdown</h3>
            {Object.entries(currentReport.categoryBreakdown).map(
              ([category, amount]) => (
                <div
                  key={category}
                  className="flex justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{category}</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportGenerator;