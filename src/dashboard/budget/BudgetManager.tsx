// src/components/budgets/BudgetManager.tsx
import React, { useState } from "react";
import { Budget, Category } from "../../types";

interface BudgetManagerProps {
  categories: Category[];
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, "id" | "spent">) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  categories,
  budgets,
  onAddBudget,
}) => {
  const [newBudget, setNewBudget] = useState({
    categoryId: 0,
    amount: 0,
    startDate: "",
    endDate: "",
    notificationThreshold: 80,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Budget Management</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddBudget(newBudget);
        }}
        className="space-y-4 mb-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={newBudget.categoryId}
            onChange={(e) =>
              setNewBudget({
                ...newBudget,
                categoryId: Number(e.currentTarget.value),
              })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Budget Amount
          </label>
          <input
            type="number"
            value={newBudget.amount}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setNewBudget({ ...newBudget, amount: Number(target.value) });
            }}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={newBudget.startDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, startDate: e.currentTarget.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={newBudget.endDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, endDate: e.currentTarget.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Notification Threshold (%)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={newBudget.notificationThreshold}
            onChange={(e) =>
              setNewBudget({
                ...newBudget,
                notificationThreshold: Number(e.currentTarget.value),
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Budget
        </button>
      </form>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const category = categories.find((c) => c.id === budget.categoryId);
          const percentSpent = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentSpent > 100;
          const isNearThreshold = percentSpent >= budget.notificationThreshold;

          return (
            <div key={budget.id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{category?.name}</h3>
                <span
                  className={`text-sm ${
                    isOverBudget ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isOverBudget
                      ? "bg-red-600"
                      : isNearThreshold
                      ? "bg-yellow-600"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${Math.min(percentSpent, 100)}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {budget.startDate} - {budget.endDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BudgetManager;