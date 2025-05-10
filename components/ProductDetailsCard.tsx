import React, { useState } from "react";

interface Product {
  name: string;
  price: number;
  image: string;
}

const ProductDetailsCard: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  const totalPrice = product.price * quantity;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Row 1: Product info and unit price */}
      <div className="flex items-center gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <div className="font-medium text-gray-800">{product.name}</div>
          <div className="text-gray-700 text-sm font-semibold">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Row 2: Quantity and total */}
      <div className="flex items-center justify-between sm:justify-end sm:gap-6">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={decrement}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
          >
            −
          </button>
          <span className="px-3 text-sm">{quantity}</span>
          <button
            onClick={increment}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
          >
            +
          </button>
        </div>
        <div className="font-bold text-[#28A745] text-sm">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
