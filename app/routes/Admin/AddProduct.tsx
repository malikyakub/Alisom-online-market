import React, { useRef, useState, useEffect } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import useProducts from "hooks/useProducts";
import useCategories from "hooks/useCategories";
import Alert from "components/Alert";
import useBrands from "hooks/useBrands";
import ClipLoader from "react-spinners/ClipLoader";
import { useSearchParams } from "react-router";
import type { Product, CategoriesWithBrands } from "./products";

const AddProduct: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    NewProduct,
    UploadProductImages,
    GetProductById,
    UpdateProduct,
    isLoading,
  } = useProducts();
  const { Allcategory } = useCategories();
  const { getAllBrands } = useBrands();
  const [discount, setDiscount] = useState("");
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    specification: "",
    sale_price: "",
    purchase_price: "",
    description: "",
    stock: "",
    isFeatured: false,
    discount: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [profit, setProfit] = useState<number>(0);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type?: "success" | "warning" | "danger" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
  });
  useEffect(() => {
    const getProductToEdit = async () => {
      if (!id) {
        console.log("No ID provided.");
        return;
      }

      const { data, err } = await GetProductById(id);

      if (err) {
        setAlert({
          isOpen: true,
          title: "Error",
          description: err || "Failed to fetch product.",
          type: "danger",
        });
      } else if (data) {
        setProductToEdit(data);

        setForm({
          name: data.name || "",
          category_id: data.category_id || "",
          brand_id: data.brand_id || "",
          specification: data.Specifications?.join(", ") || "",
          sale_price: data.price?.toString() || "",
          purchase_price: data.purchase_price?.toString() || "",
          description: data.description || "",
          stock: data.stock_quantity?.toString() || "",
          isFeatured: data.featured,
          discount: data.discount?.toString() || "",
        });
      }
    };

    getProductToEdit();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, err } = await Allcategory();
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, err } = await getAllBrands();
      if (data) setBrands(data);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const sale = parseFloat(form.sale_price) || 0;
    const purchase = parseFloat(form.purchase_price) || 0;
    setProfit(sale - purchase);
  }, [form.sale_price, form.purchase_price]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "isFeatured" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.sale_price),
      stock_quantity: parseInt(form.stock) || 0,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      featured: form.isFeatured,
      purchase_price: form.purchase_price,
      Specifications: form.specification
        ? form.specification.split(",").map((s) => s.trim())
        : [],
      discount: form.isFeatured ? parseFloat(form.discount) || 0 : 0,
    };

    let productId = id;
    let response;

    if (id) {
      response = await UpdateProduct(id, product);
    } else {
      try {
        response = await NewProduct(product);
        productId = response.data?.[0]?.product_id;
      } catch (err) {
        response = { data: null, err: String(err) };
      } finally {
      }
    }

    if (response.err || !productId) {
      setAlert({
        isOpen: true,
        title: "Error",
        description: response.err || "Failed to save product.",
        type: "danger",
      });
      return;
    }

    if (selectedFiles.length > 0) {
      const { data: urls, err: uploadErr } = await UploadProductImages(
        form.name,
        selectedFiles,
        productId
      );

      if (uploadErr) {
        setAlert({
          isOpen: true,
          title: "Warning",
          description: id
            ? "Product updated, but failed to upload new images."
            : "Product created, but failed to upload images.",
          type: "warning",
        });
        return;
      }
    }
    setAlert({
      isOpen: true,
      title: "Success",
      description: id
        ? "Product updated successfully!"
        : "Product and all images added successfully!",
      type: "success",
    });

    setTimeout(() => {
      window.location.href = "/admin/products";
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert
        isOpen={alert.isOpen}
        title={alert.title}
        description={alert.description}
        type={alert.type}
        onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add Product
        </h1>
        <p className="text-gray-500 text-sm mt-1 mb-8">
          Add a new product here.
        </p>

        <div>
          <label className="block font-semibold mb-2 text-gray-900 dark:text-white">
            Images
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
          />
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <button
              type="button"
              onClick={handleUploadClick}
              className="border border-[#A3A3A3] h-[50px] px-4 py-2 rounded text-sm bg-[#FFFFFF] hover:opacity-90 flex items-center gap-2"
            >
              <FiUpload />
              Upload Images
            </button>

            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 sm:mt-0">
                {selectedFiles.map((file, index) => {
                  const imageUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="relative w-12 h-12 border border-gray-300 rounded-md overflow-hidden group"
                    >
                      <img
                        src={imageUrl}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="text-white text-lg" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Brand
            </label>
            <select
              name="brand_id"
              value={form.brand_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Specification
            </label>
            <input
              type="text"
              name="specification"
              value={form.specification}
              onChange={handleChange}
              placeholder="Product specification"
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Sale Price
            </label>
            <input
              type="number"
              name="sale_price"
              value={form.sale_price}
              onChange={handleChange}
              placeholder="$0.00"
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Purchase Price
            </label>
            <input
              type="number"
              name="purchase_price"
              value={form.purchase_price}
              onChange={handleChange}
              placeholder="$0.00"
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Product description..."
              className="mt-1 block w-full rounded border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Featured
            </label>
            <select
              name="isFeatured"
              value={form.isFeatured ? "true" : "false"}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {form.isFeatured && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Discount %
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="e.g. 15"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Profit
            </label>
            <input
              type="number"
              value={profit.toFixed(2)}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm px-3 py-2 text-sm dark:bg-white/10 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Available in Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-white/10 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
          <button
            type="button"
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 transition"
          >
            {isLoading && <ClipLoader color="#fff" size={16} />}
            {isLoading
              ? id
                ? "Updating..."
                : "Adding..."
              : id
              ? "Update Product"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
