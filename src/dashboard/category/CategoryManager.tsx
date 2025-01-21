import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Category } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { getCookie } from "@/utils/cookieUtils";
import { BASE_URL } from "@/constans/constant";

// Add axios interceptor to include token in headers
axios.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    parentId: number | undefined;
  }>({
    name: "",
    parentId: undefined,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleAddCategory = async (category: {
    name: string;
    parentId: number | undefined;
  }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/categories`,
        category
      );
      setCategories([...categories, response.data]);
    } catch (error) {
      throw new Error("Failed to add category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAddCategory(newCategory);
      setNotification({
        type: "success",
        message: "Category added successfully!",
      });
      setNewCategory({ name: "", parentId: undefined });
      setIsModalOpen(false);
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to add category. Please try again.",
      });
      // Clear error notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Helper function to get subcategories

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Notification Alert */}
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

      {/* Add Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setNewCategory((prev) => ({
                    ...prev,
                    name: target.value,
                  }));
                }}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Parent Category (Optional)
              </label>
              <select
                value={newCategory.parentId || ""}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setNewCategory((prev) => ({
                    ...prev,
                    parentId: target.value ? Number(target.value) : undefined,
                  }));
                }}
                className="w-full p-2 border rounded-md"
              >
                <option value="">None</option>
                {categories
                  .filter((c) => !c.parentId)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Categories Display */}
      <div className="mt-6 space-y-4">
        {categories
          .filter((c) => !c.parentId)
          .map((category) => {
            return (
              <div
                key={category.id}
                className="border rounded-md p-4 bg-white shadow-sm"
              >
                <h3 className="text-lg font-semibold">{category.name}</h3>
                {/* {subCategories.length > 0 && (
                  <div className="mt-2 ml-4 space-y-1">
                    {subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="text-gray-600 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        {sub.name}
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryManager;
