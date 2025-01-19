// src/components/categories/CategoryManager.tsx
import React, { useState } from "react";
import { Category } from "../../types";

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
}) => {
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
    parentId: undefined,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategory);
    setNewCategory({ name: "", parentId: undefined });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Category Management</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  name: e.currentTarget.value,
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Parent Category (Optional)
            </label>
            <select
              value={newCategory.parentId ?? ""}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  parentId: e.currentTarget.value
                    ? Number(e.currentTarget.value)
                    : undefined,
                })
              }
              className="w-full p-2 border rounded"
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {categories
          .filter((c) => !c.parentId)
          .map((category) => (
            <div key={category.id} className="border rounded p-4">
              <h3 className="font-medium">{category.name}</h3>
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {category.subCategories.map((sub) => (
                    <div key={sub.id} className="text-sm text-gray-600">
                      - {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
export default CategoryManager;