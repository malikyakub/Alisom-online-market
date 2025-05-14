import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import AddCategoryModal from "components/AddCategoryModal";


type Category = {
  id: number;
  name: string;
  products: number;
  dateAdded: string;
};

const initialCategories: Category[] = Array.from({ length: 14 }).map(
  (_, i) => ({
    id: i + 1,
    name: `Category ${i + 1}`,
    products: 5 + i,
    dateAdded: `202${i % 5}-01-01`,
  })
);

const CategoryTable: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const totalPages = Math.ceil(initialCategories.length / rowsPerPage);

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete category ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit category ${id}`);
    setDropdownOpenId(null);
  };

  const filtered = initialCategories.filter((c) =>
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
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="">
      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-[#1A2238]">
            Categories ({filtered.length})
          </h1>
          <p className="text-lg text-[#666666]">
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-[#A3A3A3] rounded px-3 py-2 text-sm focus:outline-none focus:ring text-[#333333]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-[#F4F4F4] text-[#333] py-2">
            <tr>
              <th className="px-4 py-3 text-left w-fit whitespace-nowrap">
                <input
                  type="checkbox"
                  className="accent-[#007BFF]"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left w-fit whitespace-nowrap">
                Name
              </th>
              <th className="px-4 py-3 text-left w-fit whitespace-nowrap">
                Products
              </th>
              <th className="px-4 py-3 text-left w-fit whitespace-nowrap">
                Date Added
              </th>
              <th className="px-4 py-3 text-right w-fit whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((category) => (
              <tr
                key={category.id}
                className={`border-t transition-colors ${
                  isSelected(category.id)
                    ? "bg-[#E6F0FF]"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                <td className="px-4 py-3 w-fit whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="accent-[#007BFF]"
                    checked={isSelected(category.id)}
                    onChange={() => toggleSelect(category.id)}
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-[#333] w-fit whitespace-nowrap">
                  {category.name}
                </td>
                <td className="px-4 py-3 text-[#333] w-fit text-center whitespace-nowrap">
                  {category.products}
                </td>
                <td className="px-4 py-3 text-[#333] w-fit text-right whitespace-nowrap">
                  {category.dateAdded}
                </td>
                <td className="px-4 py-3 text-right relative w-fit whitespace-nowrap">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === category.id ? null : category.id
                      )
                    }
                    className="text-xl text-[#666] hover:text-[#000] transition"
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
                        className="absolute z-10 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", category.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("copy-id", category.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => handleAction("delete", category.id)}
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
        <div className="p-4 bg-[#F4F4F4] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] gap-2 border-t">
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
                className="px-3 py-1 hover:bg-white disabled:opacity-50"
              >
                &lt;
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 hover:bg-white disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <AddCategoryModal isOpen={isModalOpen} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryTable;
