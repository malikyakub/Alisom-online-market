import { useState } from "react";

export default function AddProduct() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Add Product</h1>
        <p className="text-gray-500 text-sm mb-6">Add a new product here.</p>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">Images</label>
          <button className="border border-gray-300 px-4 py-2 rounded text-sm bg-white hover:bg-gray-50">
            📤 Upload an Image
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Product name"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                placeholder="Product category"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                placeholder="Logitech"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specification</label>
              <input
                type="text"
                placeholder="Product specification"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Price</label>
              <input
                type="number"
                placeholder="$0.00"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
              <input
                type="number"
                placeholder="$0.00"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="row-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={5}
                placeholder="Product description..."
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profit</label>
              <input
                type="number"
                placeholder="$0.00"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available in Stock</label>
              <input
                type="number"
                placeholder="0"
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
