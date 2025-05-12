import React, { useState } from "react";

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
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;
  const totalPages = Math.ceil(initialProducts.length / rowsPerPage);

  const handleSelect = (id: number) => {
    setSelectedProduct(id === selectedProduct ? null : id);
  };

  const handleAction = (action: string, id: number) => {
    if (action === "delete") alert(`Delete product ${id}`);
    if (action === "copy-id") navigator.clipboard.writeText(id.toString());
    if (action === "edit") alert(`Edit product ${id}`);
    setDropdownOpenId(null);
  };

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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2238]">
            Products ({filteredProducts.length})
          </h1>
          <p className="text-[#666666] text-sm">
            Manage your products and track restocks here.
          </p>
        </div>
        <button className="bg-[#007BFF] text-white px-4 py-2 rounded hover:bg-[#006AE6] whitespace-nowrap">
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            className="border border-[#A3A3A3] rounded px-3 py-2 text-sm focus:outline-none focus:ring whitespace-nowrap text-[#333333]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border border-[#A3A3A3] rounded px-3 py-2 text-sm whitespace-nowrap text-[#333333]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Brand New">Brand New</option>
            <option value="Used">Used</option>
          </select>
          <select
            className="border border-[#A3A3A3] rounded px-3 py-2 text-sm whitespace-nowrap text-[#333333]"
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
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-[#F4F4F4] text-left">
            <tr>
              {[
                "Select",
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
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 whitespace-nowrap text-[#333333] text-sm"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.id}
                className={`border-t ${
                  selectedProduct === product.id ? "bg-[#E6F0FF]" : ""
                }`}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProduct === product.id}
                    onChange={() => handleSelect(product.id)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.price}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.cost}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.category}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.brand}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.condition}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.featured}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-[#333333]">
                  {product.date}
                </td>
                <td className="px-4 py-2 relative whitespace-nowrap">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === product.id ? null : product.id
                      )
                    }
                    className="text-[#666666] hover:text-[#333333]"
                  >
                    &#x2026;
                  </button>
                  {dropdownOpenId === product.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-[#A3A3A3] rounded-lg shadow-lg z-10 p-2 space-y-1">
                      <button
                        onClick={() => handleAction("edit", product.id)}
                        className="block w-full text-left px-3 py-2 text-sm font-medium text-[#333333] rounded-md hover:bg-[#F4F4F4]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction("copy-id", product.id)}
                        className="block w-full text-left px-3 py-2 text-sm font-medium text-[#333333] rounded-md hover:bg-[#F4F4F4]"
                      >
                        Copy ID
                      </button>
                      <button
                        onClick={() => handleAction("delete", product.id)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-md bg-[#DC3545] text-white hover:bg-[#C82333]"
                      >
                        Delete
                        <span className="text-xs opacity-80">⌘ ⌫</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-4 bg-[#F4F4F4] flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-[#333333] border-t border-[#A3A3A3] gap-2">
          <p>
            {selectedProduct
              ? `1 of ${filteredProducts.length} row(s) selected`
              : "No row selected"}
          </p>

          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              className="border border-[#A3A3A3] rounded px-2 py-1 text-sm focus:outline-none text-[#333333]"
              value={rowsPerPage}
              disabled
            >
              <option value={12}>20</option>
            </select>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center border border-[#A3A3A3] rounded">
              <button
                className="px-2 py-1 text-[#666666] hover:text-[#333333] disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              <button
                className="px-2 py-1 text-[#666666] hover:text-[#333333] disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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
