import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import useProducts from "hooks/useProducts";

type Product = {
  product_id: string;
  name: string;
  description?: string | null;
  price: number;
  stock_quantity?: number | null;
  category: { name: string };
  brand?: { name: string } | null;
  created_at?: string;
  featured?: boolean | null;
  Specifications?: string[] | null;
};

const ProductTable: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { AllProducts, DeleteProduct } = useProducts();
  const rowsPerPage = 12;
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, err } = await AllProducts();
      if (err) {
        console.error("Error fetching products:", err);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, [AllProducts]);

  console.log(products);

  if (!products) return null;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Calculate age of the product
    const createdAt = new Date(product.created_at ?? "");
    const ageInDays =
      (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const status = ageInDays <= 7 ? "Brand New" : "Used";

    const matchesStatus = statusFilter ? status === statusFilter : true;

    const matchesCategory = categoryFilter
      ? product.category?.name === categoryFilter
      : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handleCheckboxChange = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = paginatedProducts.map((product) => product.product_id);
    const allSelected = allIds.every((id) => selectedProducts.includes(id));
    setSelectedProducts(
      allSelected
        ? selectedProducts.filter((id) => !allIds.includes(id))
        : [...new Set([...selectedProducts, ...allIds])]
    );
  };

  const handleAction = async (action: string, id: string) => {
    if (action === "delete") {
      const { err } = await DeleteProduct(id);
      if (err) {
        console.error("Error deleting product:", err);
      } else {
        setProducts(products.filter((product) => product.product_id !== id));
      }
    }
    if (action === "copy-id") navigator.clipboard.writeText(id);
    if (action === "edit") alert(`Edit product ${id}`);
    setDropdownOpenId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2238]">
            Products ({filteredProducts.length})
          </h1>
          <p className="text-base text-[#666666]">
            Manage your products and track restocks here.
          </p>
        </div>

        <a
          href="/admin/AddProduct"
          className="inline-flex items-center gap-2 text-white bg-[#007BFF] hover:bg-[#0056b3] px-4 py-2 rounded text-sm font-medium"
        >
          <FaPlusCircle className="text-lg" />
          <span>Add Product</span>
        </a>
      </div>

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

      <div className="w-full overflow-x-auto bg-white rounded mt-6 relative z-0">
        <table className="w-full text-sm">
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
                      selectedProducts.includes(p.product_id)
                    )
                  }
                />
              </th>
              {[
                "Name",
                "Price",
                "Stock Quantity",
                "Category",
                "Brand",
                "Featured",
                "Date",
                "",
              ].map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.product_id}
                className={`border-t transition-colors ${
                  selectedProducts.includes(product.product_id)
                    ? "bg-[#E6F0FF]"
                    : "hover:bg-[#F9FAFB]"
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.product_id)}
                    onChange={() => handleCheckboxChange(product.product_id)}
                    className="accent-[#007BFF]"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-bold">
                  {product.name}
                </td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.stock_quantity || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.category?.name || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.brand?.name || "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.created_at || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === product.product_id ? null : product.product_id
                      )
                    }
                    className="text-xl text-[#666] hover:text-[#000] transition"
                  >
                    ⋯
                  </button>

                  <AnimatePresence>
                    {dropdownOpenId === product.product_id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md p-2"
                        style={{ maxWidth: "calc(100vw - 2rem)" }}
                      >
                        <button
                          onClick={() =>
                            handleAction("edit", product.product_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction("copy-id", product.product_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] hover:bg-gray-100 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() =>
                            handleAction("delete", product.product_id)
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 hover:bg-white disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
