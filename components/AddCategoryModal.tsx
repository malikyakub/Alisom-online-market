import React, { useState } from "react";

const AddCategoryModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a22384d] backdrop-blur-sm z-50 shadow-2xl">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Category</h2>
          <button onClick={onClose} className="text-gray-500 text-xl font-bold">
            &times;
          </button>
        </div>
        <p className="text-gray-500 mb-4">Add a new product category.</p>
        <input
          type="text"
          placeholder="Name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded 
             focus:outline-none focus:ring-2 focus:ring-blue-400  // Stronger blue ring
             focus:bg-blue-100                 // More intense blue background (100 instead of 50)
             hover:bg-blue-50                  // Optional: subtle hover (unchanged)
             transition-colors duration-200" // Smoother transition"
        />
        <div className="flex justify-end mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
