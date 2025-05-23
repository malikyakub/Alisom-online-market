import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
  isLoading?: boolean;
}

const AddCategoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialName = "",
  isLoading = false,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) setName(initialName);
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed || isLoading) return;
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a22384d] backdrop-blur-sm z-50 px-2">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">
            {initialName ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-xl font-bold">
            &times;
          </button>
        </div>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          {initialName
            ? "Update category name."
            : "Add a new product category."}
        </p>
        <input
          type="text"
          placeholder="Name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-blue-100 hover:bg-blue-50 transition-colors duration-200 text-sm sm:text-base"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center min-w-[120px] sm:min-w-[140px] h-10"
          >
            {isLoading ? (
              <ClipLoader size={20} color="#fff" />
            ) : initialName ? (
              "Update Category"
            ) : (
              "Save Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
