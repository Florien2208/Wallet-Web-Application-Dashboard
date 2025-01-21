import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { X } from "lucide-react";
import { Category,  TransactionType } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { getCookie } from "@/utils/cookieUtils";
import { BASE_URL } from "@/constans/constant";

interface AddTransactionModalProps {
  onClose: () => void;
}

interface FormData {
  amount: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  date: string;
  account: "bank" | "mobile_money" | "cash";
  type: TransactionType;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    date: new Date().toISOString().split("T")[0],
    account: "bank",
    type: "expense",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/categories`, {
        headers: {
          Authorization: `Bearer ${getCookie("auth_token")}`,
        },
      });
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

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/categories/${categoryId}/subcategories`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("auth_token")}`,
          },
        }
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId || !formData.account) {
      return;
    }

    const transactionData = {
      amount: Number(formData.amount),
      description: formData.description,
      categoryId: formData.categoryId,
      subCategoryId: formData.subCategoryId || undefined,
      date: formData.date,
      account: formData.account,
      type: formData.type,
    };

    try {
      setIsSubmitting(true);
      await axios.post(`${BASE_URL}/api/v1/transactions`, transactionData, {
        headers: {
          Authorization: `Bearer ${getCookie("auth_token")}`,
        },
      });
      setNotification({
        type: "success",
        message: "Transaction added successfully!",
      });
      setTimeout(() => {
        setNotification(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to add transaction", error);
      setNotification({
        type: "error",
        message: "Failed to add transaction. Please try again.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
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
                <option value="expense">Expense</option>
                <option value="income">Income</option>
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
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {subCategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Subcategory (Optional)
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              disabled={isSubmitting}
            >
              <option value="bank">Bank Account</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
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
