import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboard } from "../layout/DashboardContext";
import { Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCookie } from "@/utils/cookieUtils";

// Define interfaces for type safety
interface Budget {
  id: string;
  categoryId: number;
  amount: number;
  spent: number;
  startDate: string;
  endDate: string;
  notificationThreshold: number;
}

interface NewBudget {
  categoryId: number;
  amount: number;
  startDate: string;
  endDate: string;
  notificationThreshold: number;
}

interface Category {
  id: number;
  name: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BudgetManager: React.FC = () => {
  const { categories } = useDashboard() as { categories: Category[] };
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [newBudget, setNewBudget] = useState<NewBudget>({
    categoryId: 0,
    amount: 0,
    startDate: "",
    endDate: "",
    notificationThreshold: 80,
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async (): Promise<void> => {
    try {
      const token = getCookie("auth_token");
      const response = await fetch(
        "https://wallet-web-application-dashboard-backend.onrender.com/api/v1/budgets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const validatedBudgets = data.map(
        (budget: any): Budget => ({
          id: budget.id || budget._id,
          categoryId: budget.categoryId,
          amount: Number(budget.amount) || 0,
          spent: Number(budget.spent) || 0,
          startDate: budget.startDate,
          endDate: budget.endDate,
          notificationThreshold: Number(budget.notificationThreshold) || 80,
        })
      );

      setBudgets(validatedBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setNotification({
        type: "error",
        message: "Failed to fetch budgets. Please try again later.",
      });
    }
  };

  const handleAddBudget = async (budget: NewBudget): Promise<void> => {
    try {
      const token = getCookie("auth_token");
      const response = await fetch(
        "https://wallet-web-application-dashboard-backend.onrender.com/api/v1/budgets",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(budget),
        }
      );

      if (response.ok) {
        setNotification({
          type: "success",
          message: "Budget added successfully!",
        });
        setIsModalOpen(false);
        fetchBudgets();
      } else {
        setNotification({ type: "error", message: "Failed to add budget." });
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      setNotification({ type: "error", message: "Failed to add budget." });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target as HTMLInputElement;
    setNewBudget((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "notificationThreshold"
          ? Number(value)
          : value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-4">Budget Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Budget
        </button>
      </div>
      {notification && (
        <Alert
          className={`mb-4 ${
            notification.type === "success" ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <AlertDescription
            className={
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }
          >
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleAddBudget(newBudget);
              setNewBudget({
                categoryId: 0,
                amount: 0,
                startDate: "",
                endDate: "",
                notificationThreshold: 80,
              });
            }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Budget Amount
              </label>
              <input
                type="number"
                name="amount"
                value={newBudget.amount}
                required
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={newBudget.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={newBudget.endDate}
                  onChange={handleInputChange}
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
                name="notificationThreshold"
                min="1"
                max="100"
                required
                value={newBudget.notificationThreshold}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Add Budget
            </button>
          </form>
        </DialogContent>
      </Dialog>

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
                {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
