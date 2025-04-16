import React, { useState } from 'react';

const AddCategoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Category</h2>
          <button onClick={onClose} className="text-gray-500 text-xl font-bold">&times;</button>
        </div>
        <p className="text-gray-500 mb-4">Add a new product category.</p>
        <input
          type="text"
          placeholder="Name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
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
