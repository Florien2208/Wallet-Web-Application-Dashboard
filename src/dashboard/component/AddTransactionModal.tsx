import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import { Account, Category, Transaction, TransactionType } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { getCookie } from "@/utils/cookieUtils";

interface AddTransactionModalProps {
  accounts: Account[];
  categories: Category[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onClose: () => void;
}

interface FormData {
  amount: string;
  description: string;
  categoryId: string;
  date: string;
  accountId: string;
  type: TransactionType;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  accounts,
  

  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    description: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    accountId: "",
    type: "EXPENSE",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
   const [categories, setCategories] = useState<Category[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

   useEffect(() => {
     fetchCategories();
   }, []);
console.log("categories",categories)
   const fetchCategories = async () => {
     try {
       const response = await axios.get("/api/v1/categories", {
         headers: {
           Authorization: `Bearer ${getCookie("auth_token")}`,
         },
       });
       console.log("response", response);
       setCategories(response.data);
       if (response.data.length === 0) {
         setNotification({
           type: "error",
           message: "No categories found. Please create a category first.",
         });
       }
     } catch (error) {
       console.error("Failed to fetch categories", error);
       setNotification({
         type: "error",
         message: "Failed to fetch categories. Please try again.",
       });
     }
   };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.accountId) {
      return;
    }

    const transactionData = {
      amount:
        formData.type === "EXPENSE"
          ? -Number(formData.amount)
          : Number(formData.amount),
      description: formData.description,
      categoryId: String(formData.categoryId),
      date: formData.date,
      accountId: Number(formData.accountId),
      type: formData.type,
    };
console.log("transactionData", transactionData);
    try {
      setIsSubmitting(true);
      await axios.post("/api/v1/transactions", transactionData, {
        headers: {
          Authorization: `Bearer ${getCookie("auth_token")}`,
        },
      });
      setNotification({
        type: "success",
        message: "Transaction added successfully!",
      });
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to add transaction", error);
      setNotification({
        type: "error",
        message: "Failed to add transaction. Please try again.",
      });
      // Clear error notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
      setIsSubmitting(false);
    }


  
    
  };


  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {notification && (
          <Alert
            className={`mx-4 mt-4 ${
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

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
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
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
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
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
