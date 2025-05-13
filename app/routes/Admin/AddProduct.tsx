import React, { useRef } from "react";
import { FiUpload } from "react-icons/fi";

const AddProduct: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-[#333333]">Add Product</h1>
        <p className="text-[#A3A3A3] text-sm mb-6">Add a new product here.</p>

        <div className="mb-8">
          <label className="block font-semibold mb-2 text-[#333333]">Images</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="border border-[#A3A3A3] px-4 py-2 rounded text-sm bg-[#FFFFFF] hover:opacity-90 flex items-center gap-2"
          >
            <FiUpload />
            Upload an Image
          </button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-6 rounded-md shadow">
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Name", placeholder: "Product name" },
              { label: "Category", placeholder: "Product category" },
              { label: "Brand", placeholder: "Logitech" },
              { label: "Specification", placeholder: "Product specification" },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-[#666666]">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="mt-1 block w-full border border-[#666666] rounded-md shadow-sm text-sm px-3 py-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Sale Price", type: "number", placeholder: "$0.00" },
              { label: "Purchase Price", type: "number", placeholder: "$0.00" },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-[#666666]">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full border border-[#666666] rounded-md shadow-sm text-sm px-3 py-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                />
              </div>
            ))}
            <div className="md:row-span-2">
              <label className="block text-sm font-medium text-[#666666]">Description</label>
              <textarea
                rows={5}
                placeholder="Product description..."
                className="mt-1 block w-full border border-[#666666] rounded-md shadow-sm text-sm px-3 py-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Profit", placeholder: "$0.00" },
              { label: "Available in Stock", placeholder: "0" },
            ].map((field, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-[#666666]">
                  {field.label}
                </label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  className="mt-1 block w-full border border-[#666666] rounded-md shadow-sm text-sm px-3 py-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              type="button"
              className="px-4 py-2 bg-[#F4F4F4] text-[#666666] rounded-md hover:opacity-90"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#F4F4F4] text-[#666666] rounded-md hover:opacity-90"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#007BFF] text-[#FFFFFF] rounded-md hover:brightness-90"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
