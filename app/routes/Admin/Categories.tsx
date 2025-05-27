import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import AddCategoryModal from "components/AddCategoryModal";
import usecategory from "hooks/useCategories";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Alert from "components/Alert";
import ClipLoader from "react-spinners/ClipLoader";

type Category = {
  id: number;
  name: string;
  products: number;
  dateAdded: string;
};

const CategoryTable: React.FC = () => {
  const {
    Allcategory,
    NewCategory,
    UpdateCategory,
    getCategoryProducts,
    DeleteCategory,
  } = usecategory();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const totalPages = Math.ceil(categories.length / rowsPerPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
    type?: "success" | "warning" | "danger" | "info";
    isOpen: boolean;
  }>({
    title: "",
    description: "",
    type: "info",
    isOpen: false,
  });

  const showAlert = (
    title: string,
    description: string,
    type: "success" | "warning" | "danger" | "info" = "info"
  ) => {
    setAlert({ title, description, type, isOpen: true });
  };

  dayjs.extend(relativeTime);

  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");
    if (date.isSame(today, "day")) return "today";
    if (date.isSame(yesterday, "day")) return "yesterday";
    return date.format("DD/MM/YYYY");
  };

  const fetchCategories = async () => {
    try {
      const res = await Allcategory();
      if (!res.data) {
        console.error("Failed to load categories:", res.err);
        return;
      }
      const categoriesWithCounts = await Promise.all(
        res.data.map(async (c: any) => {
          const productRes = await getCategoryProducts(c.category_id);
          const productCount = productRes.data ? productRes.data.length : 0;
          return {
            id: c.category_id,
            name: c.name,
            products: productCount,
            dateAdded: formatDate(c.Added_date),
          };
        })
      );
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error("Unexpected error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAction = (action: string, id: number, name?: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    if (action === "delete")
      (async () => {
        const res = await DeleteCategory(id.toString());
        if (res.err) {
          showAlert("Error", "Failed to delete category", "danger");
        } else {
          showAlert("Deleted", `Category ${name} deleted`, "warning");
          await fetchCategories();
        }
      })();
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") {
      setEditingCategory(category);
      setIsModalOpen(true);
    }
    setDropdownOpenId(null);
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const isSelected = (id: number) => selectedIds.has(id);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => {
    const newSet = new Set(selectedIds);
    paginated.forEach((c) => newSet.add(c.id));
    setSelectedIds(newSet);
  };

  const deselectAll = () => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      paginated.forEach((c) => newSet.delete(c.id));
      return newSet;
    });
  };

  const allSelected = paginated.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) deselectAll();
    else selectAll();
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (name: string) => {
    if (editingCategory) {
      const res = await UpdateCategory(editingCategory.id.toString(), { name });
      if (res.err)
        return showAlert("Error", "Failed to update category", "danger");
      showAlert("Success", "Category updated successfully", "success");
    } else {
      const res = await NewCategory({ name });
      if (res.err)
        return showAlert("Error", "Failed to add category", "danger");
      showAlert("Success", "Category added successfully", "success");
    }
    await fetchCategories();
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="text-[#1A2238] dark:text-[#F4F4F4] min-h-screen">
      <Alert
        title={alert.title}
        description={alert.description}
        type={alert.type}
        isOpen={alert.isOpen}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold">Categories ({filtered.length})</h1>
          <p className="text-base text-[#666666] dark:text-[#CCCCCC]">
            Manage your product categories.
          </p>
        </div>

        <button
          onClick={handleAddCategory}
          className="inline-flex items-center gap-2 text-white bg-[#007BFF] hover:bg-[#0056b3] px-4 py-2 rounded text-sm font-medium"
        >
          <FaPlusCircle className="text-lg" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
        <div className="w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-[#333333] dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white dark:bg-[#2C2C2C]/20 rounded relative z-0">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-[#F4F4F4] text-[#333] dark:bg-[#2C2C2C]/50 dark:text-white">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="accent-[#007BFF]"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              {["Name", "Products", "Date Added", ""].map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((category) => (
              <tr
                key={category.id}
                className={`border-t transition-colors ${
                  isSelected(category.id)
                    ? "bg-[#E6F0FF] dark:bg-[#2B3C55]"
                    : "hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937]"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="accent-[#007BFF]"
                    checked={isSelected(category.id)}
                    onChange={() => toggleSelect(category.id)}
                  />
                </td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  {category.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-bold">{category.products}</span>
                  <span className="ml-1">
                    {category.products === 1 ? "product" : "products"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {category.dateAdded}
                </td>
                <td className="px-4 py-3 relative text-right whitespace-nowrap">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === category.id ? null : category.id
                      )
                    }
                    className="text-xl text-[#666] dark:text-[#CCCCCC] hover:text-[#000] dark:hover:text-white transition"
                  >
                    ⋯
                  </button>

                  <AnimatePresence>
                    {dropdownOpenId === category.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 right-0 mt-2 w-44 bg-white dark:bg-[#F4F4F4]/10 backdrop-blur-2xl border border-gray-200 dark:border-white/20 rounded-lg shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", category.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("copy-id", category.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() =>
                            handleAction("delete", category.id, category.name)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-white bg-[#DC3545] hover:bg-[#C82333] rounded"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-[#F4F4F4] dark:bg-[#2C2C2C] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] dark:text-white gap-2 border-t border-gray-200 dark:border-white/10">
        <p>
          {selectedIds.size > 0
            ? `${selectedIds.size} of ${filtered.length} selected`
            : "No selection"}
        </p>
        <div className="flex items-center gap-3">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center border rounded overflow-hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 hover:bg-white dark:hover:bg-white/10 disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 hover:bg-white dark:hover:bg-white/10 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddCategoryModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
            }}
            onSave={handleSaveCategory}
            initialName={editingCategory?.name || ""}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryTable;
