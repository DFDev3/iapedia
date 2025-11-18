import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";


interface Tool {
  id: number;
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  bannerUrl?: string;
  categoryId: number;
  planType: string;
  isTrending: boolean;
  isNew: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  createdAt: string;
}

export function AdminPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddCategoryFormVisible, setIsAddCategoryFormVisible] =
    useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [addToolForm, setAddToolForm] = useState({
    name: '',
    description: '',
    url: '',
    bannerUrl: '',
    imageUrl: '',
    categoryId: '',
    planType: '',
    isTrending: false,
    isNew: false,
  });

  // Query
  useEffect(() => {
    fetch("http://localhost:4000/api/tools")
      .then((res) => res.json())
      .then((data) => setTools(data))
      .catch((err) => console.error("Error fetching tools:", err));

    fetch("http://localhost:4000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddTool = async () => {
    setIsAddFormVisible(false);
    const { name, description, url, bannerUrl, imageUrl, categoryId, planType, isTrending, isNew } = addToolForm;
    const categoryIdNum = parseInt(categoryId);
    if (!name || !description || !categoryIdNum) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          bannerUrl,
          imageUrl,
          url,
          categoryId: categoryIdNum,
          planType,
          isTrending,
          isNew,
        }),
      });

      if (!res.ok) throw new Error("Failed to add tool");

      const newTool = await res.json();
      setTools((prev) => [...prev, newTool]);
      alert("Tool added successfully.");
      setIsAddFormVisible(false);
      setAddToolForm({
        name: '',
        description: '',
        url: '',
        bannerUrl: '',
        imageUrl: '',
        categoryId: '',
        planType: '',
        isTrending: false,
        isNew: false,
      });
    } catch (err) {
      console.error("Error adding tool:", err);
      alert(
        "Error adding tool: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
  };

  // const handleDeleteTool = (id: number) => {
  //   // TODO: Implement delete functionality
  //   //setTools(tools.filter(tool => tool.id !== id));
  // };

  const handleSaveEdit = async () => {
    if (!editingTool) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/tools/${editingTool.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingTool),
        }
      );

      if (!response.ok) throw new Error("Failed to update tool");

      const updatedTool = await response.json();

      // Optionally refresh tool list or update local state
      setTools((prev) =>
        prev.map((tool) => (tool.id === updatedTool.id ? updatedTool : tool))
      );

      // Reset form
      setEditingTool(null);
    } catch (error) {
      console.error("Error updating tool:", error);
    }
  };

  const handleAddCategory = () => {
    // TODO: Implement add functionality
    setIsAddCategoryFormVisible(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  // const handleDeleteCategory = (id: number) => {
  //   // TODO: Implement delete functionality
  //   //setCategories(categories.filter(category => category.id !== id));
  // };

  const handleSaveCategoryEdit = () => {
    // TODO: Implement save edit functionality
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard - Tools Management
        </h1>
        {/* <button
          onClick={async () => {
            await fetch("http://localhost:4000/api/tools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Sample Tool 3",
                description: "Demo record created from frontend",
                url: "http://example.com",
                iconUrl: ".",
                bannerUrl: ".",
                planType: "FREE",
                categoryId: 1, // must exist
                isTrending: false,
                isNew: true,
              }),
            });
            alert("Tool added. Reload the page to see it.");
          }}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Test Tool
        </button> */}

        <Button
          onClick={() => setIsAddFormVisible(!isAddFormVisible)}
          variant="default"
        >
          Add Tool
        </Button>
      </div>

      {isAddFormVisible && (
        <div className="mb-8 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Add New Tool</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Tool name"
                value={addToolForm.name}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Tool description"
                value={addToolForm.description}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium">
                Website Url
              </label>
              <Input
                id="url"
                type="text"
                placeholder="Website Url"
                value={addToolForm.url}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="bannerUrl" className="block text-sm font-medium">
                Banner URL
              </label>
              <Input
                id="bannerUrl"
                type="text"
                placeholder="Banner URL"
                value={addToolForm.bannerUrl}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, bannerUrl: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="ImageUrl" className="block text-sm font-medium">
                Image URL
              </label>
              <Input
                id="imageUrl"
                type="text"
                placeholder="Image URL"
                value={addToolForm.imageUrl}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="categoryId"
                value={addToolForm.categoryId}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="planType" className="block text-sm font-medium">
                Plan Type
              </label>
              <select
                id="planType"
                value={addToolForm.planType}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, planType: e.target.value }))}
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select a plan type</option>
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
                <option value="FREEMIUM">Freemium</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isTrending"
                type="checkbox"
                checked={addToolForm.isTrending}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, isTrending: e.target.checked }))}
              />
              <label htmlFor="isTrending" className="text-sm">
                Trending
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isNew"
                type="checkbox"
                checked={addToolForm.isNew}
                onChange={(e) => setAddToolForm(prev => ({ ...prev, isNew: e.target.checked }))}
              />
              <label htmlFor="isNew" className="text-sm">
                New
              </label>
            </div>
            <Button
              onClick={handleAddTool}
              className="w-full"
            >
              Add Tool
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Tools</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Plan Type</th>
              <th className="text-left p-2">Trending</th>
              <th className="text-left p-2">New</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.id} className="border-b">
                <td className="p-2">{tool.id}</td>
                <td className="p-2">{tool.name}</td>
                <td className="p-2">{tool.description}</td>
                <td className="p-2">{tool.planType}</td>
                <td className="p-2">{tool.isTrending ? "Yes" : "No"}</td>
                <td className="p-2">{tool.isNew ? "Yes" : "No"}</td>
                <td className="p-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTool(tool)}
                      className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
                    >
                      Edit
                    </button>
                    <button
                      // onClick={() => handleDeleteTool(tool.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editingTool && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Edit Tool</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="edit-name"
                className="w-full p-2 border rounded text-black"
                type="text"
                value={editingTool.name || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium"
              >
                Description
              </label>
              <input
                id="edit-description"
                type="text"
                value={editingTool.description || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div>
              <label htmlFor="edit-url" className="block text-sm font-medium">
                Website Url
              </label>
              <input
                id="edit-url"
                type="text"
                value={editingTool.url || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, url: e.target.value } : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div>
              <label
                htmlFor="edit-bannerUrl"
                className="block text-sm font-medium"
              >
                Banner URL
              </label>
              <input
                id="edit-bannerUrl"
                type="text"
                value={editingTool.bannerUrl || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, imageUrl: e.target.value } : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div>
              <label
                htmlFor="edit-imageUrl"
                className="block text-sm font-medium"
              >
                Image URL
              </label>
              <input
                id="edit-imageUrl"
                type="text"
                value={editingTool.imageUrl || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev
                      ? { ...prev, categoryId: Number(e.target.value) }
                      : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div>
              <label
                htmlFor="edit-categoryId"
                className="block text-sm font-medium"
              >
                Category
              </label>
              <select
                id="edit-categoryId"
                value={editingTool.categoryId || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, planType: e.target.value } : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-planType"
                className="block text-sm font-medium"
              >
                Plan Type
              </label>
              <select
                id="edit-planType"
                value={editingTool.planType || ""}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, planType: e.target.value } : prev
                  )
                }
                className="w-full p-2 border rounded text-black"
              >
                <option value="">Select a plan</option>
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
                <option value="FREEMIUM">Freemium</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="edit-isTrending"
                type="checkbox"
                checked={editingTool.isTrending || false}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, isTrending: e.target.checked } : prev
                  )
                }
              />
              <label htmlFor="edit-isTrending" className="text-sm">
                Trending
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="edit-isNew"
                type="checkbox"
                checked={editingTool.isNew || false}
                onChange={(e) =>
                  setEditingTool((prev) =>
                    prev ? { ...prev, isNew: e.target.checked } : prev
                  )
                }
              />
              <label htmlFor="edit-isNew" className="text-sm">
                New
              </label>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingTool(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <button
            onClick={async () => {
              await fetch("http://localhost:4000/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: "Sample Category",
                  description: "Demo category created from frontend",
                  iconUrl: ".",
                }),
              });
              alert("Category added. Reload the page to see it.");
            }}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Test Category
          </button>

          <button
            onClick={() =>
              setIsAddCategoryFormVisible(!isAddCategoryFormVisible)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>

        {isAddCategoryFormVisible && (
          <div className="mb-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  placeholder="Category name"
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="category-description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <input
                  id="category-description"
                  type="text"
                  placeholder="Category description"
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <button
                onClick={handleAddCategory}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>
        )}

        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="p-2">{category.id}</td>
                  <td className="p-2">{category.name}</td>
                  <td className="p-2">{category.description || ""}</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
                      >
                        Edit
                      </button>
                      <button
                        // onClick={() => handleDeleteCategory(category.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Category Form */}
        {editingCategory && (
          <div className="mt-8 p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-category-name"
                  className="block text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="edit-category-name"
                  type="text"
                  defaultValue={editingCategory.name}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-category-description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <input
                  id="edit-category-description"
                  type="text"
                  defaultValue={editingCategory.description}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveCategoryEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
