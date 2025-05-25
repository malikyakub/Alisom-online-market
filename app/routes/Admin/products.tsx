import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import useProducts from "hooks/useProducts";
import useCategories from "hooks/useCategories";
import useBrands from "hooks/useBrands";
import Alert from "components/Alert";
export type Product = {
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

export type CategoriesWithBrands = {
  category_id?: string;
  brand_id?: string;
  name: string;
};

const ProductTable: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { Allcategory } = useCategories();
  const { getAllBrands } = useBrands();
  const [categories, setCategories] = useState<CategoriesWithBrands[]>([]);
  const [brands, setBrands] = useState<CategoriesWithBrands[]>([]);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "warning" | "danger" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });

  const { AllProducts, DeleteProduct, isLoading } = useProducts();
  const rowsPerPage = 12;
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData, err: productErr } = await AllProducts();
      const { data: categoryData, err: categoryErr } = await Allcategory();
      const { data: brandsData, err: brandsErr } = await getAllBrands();

      if (productErr) {
        console.error("Error fetching products:", productErr);
        showAlert("Fetch Error", "Unable to load products.", "danger");
      } else {
        setProducts(productData || []);
      }

      if (categoryErr) {
        console.error("Error fetching categories:", categoryErr);
        showAlert("Fetch Error", "Unable to load categories.", "danger");
      } else {
        setCategories(categoryData || []);
      }

      if (brandsErr) {
        console.error("Error fetching brands:", brandsErr);
        showAlert("Fetch Error", "Unable to load brands.", "danger");
      } else {
        setBrands(brandsData || []);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";

    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (!products) return null;

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFeatured =
      featuredFilter === "Yes"
        ? product.featured === true
        : featuredFilter === "No"
        ? product.featured === false || product.featured === null
        : true;

    const matchesCategory = categoryFilter
      ? product.category?.name === categoryFilter
      : true;

    const matchesBrand = brandFilter
      ? product.brand?.name === brandFilter
      : true;

    return matchesSearch && matchesFeatured && matchesCategory && matchesBrand;
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
        showAlert("Error", "Failed to delete the product.", "danger");
      } else {
        setProducts(products.filter((product) => product.product_id !== id));
        showAlert(
          "Deleted",
          "Product has been removed successfully.",
          "success"
        );
      }
    }

    if (action === "copy-id") {
      navigator.clipboard.writeText(id);
      showAlert("Copied", "Product ID copied to clipboard.", "info");
    }

    if (action === "edit") {
      window.location.href = `/admin/AddProduct?id=${id}`;
    }

    setDropdownOpenId(null);
  };

  const showAlert = (
    title: string,
    description: string,
    type: "success" | "warning" | "danger" | "info" = "info"
  ) => {
    setAlert({ isOpen: true, title, description, type });
  };

  return (
    <div className="text-[#1A2238] dark:text-[#F4F4F4] min-h-screen">
      <Alert
        title={alert.title}
        description={alert.description}
        type={alert.type}
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />

      <div className="flex flex-wrap flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold">
            Products ({filteredProducts.length})
          </h1>
          <p className="text-base text-[#666666] dark:text-[#CCCCCC]">
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

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
        <div className="w-full lg:max-w-[350px]">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF] text-[#333333] dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-3 flex-1">
          <select
            className="flex-grow min-w-[8rem] border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-md px-3 py-2 text-sm text-[#333333] dark:text-white"
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
          >
            <option value="">Featured</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <select
            className="flex-grow min-w-[8rem] border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-md px-3 py-2 text-sm text-[#333333] dark:text-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="flex-grow min-w-[8rem] border border-[#A3A3A3] dark:border-white/20 bg-white dark:bg-white/10 rounded-md px-3 py-2 text-sm text-[#333333] dark:text-white"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.brand_id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white dark:bg-[#2C2C2C]/20 rounded mt-6 relative z-0">
        <table className="w-full text-sm">
          <thead className="bg-[#F4F4F4] text-[#333] dark:bg-[#2C2C2C]/50 dark:text-white">
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
                    ? "bg-[#E6F0FF] dark:bg-[#2B3C55]"
                    : "hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937]"
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
                  {formatDate(product.created_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap relative">
                  <button
                    onClick={() =>
                      setDropdownOpenId((prev) =>
                        prev === product.product_id ? null : product.product_id
                      )
                    }
                    className="text-xl text-[#666] dark:text-[#CCCCCC] hover:text-[#000] dark:hover:text-white transition"
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
                        className="absolute z-10 right-0 mt-2 w-44 bg-white dark:bg-[#F4F4F4]/10 backdrop-blur-2xl border border-gray-200 dark:border-white/20 rounded-lg shadow-md p-2"
                        style={{ maxWidth: "calc(100vw - 2rem)" }}
                      >
                        <button
                          onClick={() =>
                            handleAction("edit", product.product_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction("copy-id", product.product_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-[#333] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() =>
                            handleAction("delete", product.product_id)
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-white bg-[#DC3545] hover:bg-[#C82333] rounded"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <ClipLoader size={16} color="#fff" />
                              Deleting...
                            </span>
                          ) : (
                            "Delete"
                          )}
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
    </div>
  );
};

export default ProductTable;
