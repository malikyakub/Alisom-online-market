import React, { useState } from "react";
import productImage from "../public/assets/images/product.jpg";

const ProductDetailsCard = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerUnit = 200;

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="bg-white rounded shadow-md p-4 w-full mx-auto flex items-center gap-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded overflow-hidden">
          <img
            src={productImage}
            alt="Product"
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-[#1A2238] font-bold text-2xl">Tablet</h1>
      </div>

      <div className="flex-1 flex justify-end items-center gap-20">
        <p className="font-semibold text-xl text-gray-700">${pricePerUnit}</p>

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={decrement}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
          >
            −
          </button>
          <div className="px-4 py-1 text-center min-w-[2.5rem] text-lg">
            {quantity}
          </div>
          <button
            onClick={increment}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-gray-700"
          >
            +
          </button>
        </div>

        <p className="font-semibold text-xl text-[#28A745]">
          ${pricePerUnit * quantity}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
