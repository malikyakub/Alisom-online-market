import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineAntDesign } from "react-icons/ai";
import { FaFontAwesome } from "react-icons/fa6";
import { BiPlusCircle } from "react-icons/bi";
import { FaPlusCircle } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  price: string;
  cost: string;
  quantity: number;
  category: string;
  brand: string;
  condition: string;
  featured: string;
  date: string;
};

const initialProducts: Product[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `$${(100 + i).toFixed(2)}`,
  cost: `$${(80 + i).toFixed(2)}`,
  quantity: 200 + i,
  category: i % 2 === 0 ? "Computers" : "Phones",
  brand: "Apple",
  condition: "Brand New",
  featured: i % 3 === 0 ? "YES" : "NO",
  date: "04/18/2025",
}));

const ProductTable: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 12;

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter
      ? product.condition === statusFilter
      : true;
    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handleCheckboxChange = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = paginatedProducts.map((product) => product.id);
    const allSelected = allIds.every((id) => selectedProducts.includes(id));
    setSelectedProducts(
      allSelected
        ? selectedProducts.filter((id) => !allIds.includes(id))
        : [...new Set([...selectedProducts, ...allIds])]
    );
  };

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete product ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit product ${id}`);
    setDropdownOpenId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2238]">
            Products ({filteredProducts.length})
          </h1>
          <p className="text-base text-[#666666]">
            Manage your products and track restocks here.
          </p>
        </div>

        <a
          href="./AddProduct"
          className="inline-flex items-center gap-2 text-white bg-[#007BFF] hover:bg-[#0056b3] px-4 py-2 rounded text-sm font-medium"
        >
          <FaPlusCircle className="text-lg" />
          <span>Add Product</span>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-[#A3A3A3] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-[#333333]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border border-[#A3A3A3] rounded-md px-3 py-2 text-sm focus:outline-none text-[#333333]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Brand New">Brand New</option>
            <option value="Used">Used</option>
          </select>
          <select
            className="border border-[#A3A3A3] rounded-md px-3 py-2 text-sm focus:outline-none text-[#333333]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Category</option>
            <option value="Computers">Computers</option>
            <option value="Phones">Phones</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-[#F4F4F4] text-[#333]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="accent-[#007BFF]"
                  onChange={handleSelectAll}
                  checked={
                    paginatedProducts.length > 0 &&
                    paginatedProducts.every((p) =>
                      selectedProducts.includes(p.id)
                    )
                  }
                />
              </th>
              {[
                "Name",
                "Price",
                "Cost",
                "Quantity",
                "Category",
                "Brand",
                "Condition",
                "Featured",
                "Date",
                "",
              ].map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={`border-t transition-colors ${
                  selectedProducts.includes(product.id)
                    ? "bg-[#E6F0FF]"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                    className="accent-[#007BFF]"
                  />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">{product.cost}</td>
                <td className="px-4 py-3">{product.quantity}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3">{product.condition}</td>
                <td className="px-4 py-3">{product.featured}</td>
                <td className="px-4 py-3">{product.date}</td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === product.id ? null : product.id
                      )
                    }
                    className="text-xl text-[#666] hover:text-[#000] transition"
                  >
                    ⋯
                  </button>

                  <AnimatePresence>
                    {dropdownOpenId === product.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md p-2"
                      >
                        <button
                          onClick={() => handleAction("edit", product.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAction("copy-id", product.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => handleAction("delete", product.id)}
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

        {/* Footer */}
        <div className="p-4 bg-[#F4F4F4] flex flex-col sm:flex-row justify-between items-center text-sm text-[#333] gap-2 border-t">
          <p>
            {selectedProducts.length > 0
              ? `${selectedProducts.length} of ${filteredProducts.length} selected`
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
    </div>
  );
};

export default ProductTable;
