import React, { useState } from "react";
import { X } from "lucide-react";
import { Account, Category, Transaction, TransactionType } from "../../types";

interface AddTransactionModalProps {
  accounts: Account[];
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  accounts,
  categories,
  onAdd,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    accountId: "",
    type: "EXPENSE" as TransactionType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.accountId) {
      return;
    }

    onAdd({
      amount:
        formData.type === "EXPENSE"
          ? -Number(formData.amount)
          : Number(formData.amount),
      description: formData.description,
      categoryId: Number(formData.categoryId),
      date: formData.date,
      accountId: Number(formData.accountId),
      type: formData.type,
    });

    onClose();
  };

  const renderCategoryOptions = (
    categories: Category[],
    level = 0
  ): React.ReactNode[] => {
    return categories.flatMap((category) => [
      <option key={category.id} value={category.id}>
        {"  ".repeat(level) + category.name}
      </option>,
      ...(category.subCategories
        ? renderCategoryOptions(category.subCategories, level + 1)
        : []),
    ]);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: (e.target as HTMLSelectElement)
                      .value as TransactionType,
                  })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: (e.target as HTMLInputElement).value,
                  })
                }
                className="w-full p-2 border rounded"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: (e.target as HTMLInputElement).value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: (e.target as HTMLSelectElement).value,
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {renderCategoryOptions(categories)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              value={formData.accountId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountId: (e.target as HTMLSelectElement).value,
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} (${account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: (e.target as HTMLInputElement).value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
