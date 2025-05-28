import React, { useState, useEffect } from "react";

interface Product {
  name: string;
  price: number;
  image: string;
}

interface Props {
  product?: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetailsCard: React.FC<Props> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  const [localQty, setLocalQty] = useState(quantity);

  useEffect(() => {
    setLocalQty(quantity);
  }, [quantity]);

  const increment = () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    onQuantityChange(newQty);
  };

  const decrement = () => {
    const newQty = localQty > 0 ? localQty - 1 : 0;
    setLocalQty(newQty);
    onQuantityChange(newQty);
  };

  if (!product) {
    return null;
  }

  const totalPrice = product.price * localQty;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <div className="font-medium text-[#1A2238] dark:text-white">
            {product.name}
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
            ${product.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end sm:gap-6">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
          <button
            onClick={decrement}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-black dark:text-white"
          >
            −
          </button>
          <span className="px-3 text-sm text-black dark:text-white">
            {localQty}
          </span>
          <button
            onClick={increment}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-black dark:text-white"
          >
            +
          </button>
        </div>
        <div className="font-bold text-[#28A745] dark:text-green-400 text-sm w-20 text-right">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
