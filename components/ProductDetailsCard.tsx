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
    <div className="bg-white rounded shadow-md p-4 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt="product image"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-[#1A2238] font-bold text-xl">{product.name}</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 w-full sm:w-auto justify-between">
        <div className="flex justify-between items-center gap-4 sm:gap-8 w-full sm:w-auto">
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
        </div>

        <div className="text-right sm:text-left mt-2 sm:mt-0">
          <p className="font-semibold text-lg text-[#28A745]">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
