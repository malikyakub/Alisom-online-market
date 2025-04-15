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
    <div className="bg-white rounded shadow-md p-4 flex items-center gap- w-full">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded overflow-hidden">
          <img
            src={product.image}
            alt="product image"
            className="w-full h-full"
          />
        </div>

        <h1 className="text-[#1A2238] font-bold text-xl">{product.name}</h1>
      </div>

      <div className="flex-1 flex justify-end items-center gap-8">
        <p className="font-semibold text-lg text-gray-700">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={decrement}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-gray-700"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <div className="px-3 py-1 text-center min-w-[2rem] text-sm">
            {quantity}
          </div>

          <button
            onClick={increment}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold text-gray-700"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <p className="font-semibold text-lg text-[#28A745]">
          ${totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
