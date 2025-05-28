import React from "react";

type TotalCardProps = {
  subtotal: number;
  shipping: string;
  total: number;
  onCheckout: () => void;
};

const TotalCard: React.FC<TotalCardProps> = ({
  subtotal,
  shipping,
  total,
  onCheckout,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full md:max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Cart Total
      </h2>

      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-800 dark:text-gray-300">
          Subtotal:
        </span>
        <span className="font-semibold text-gray-800 dark:text-gray-300">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <hr className="my-2 border-gray-300 dark:border-gray-700" />

      <div className="flex justify-between mb-2">
        <span className="font-semibold text-gray-800 dark:text-gray-300">
          Shipping:
        </span>
        <span className="font-semibold text-gray-800 dark:text-gray-300">
          {shipping}
        </span>
      </div>

      <hr className="my-2 border-gray-300 dark:border-gray-700" />

      <div className="flex justify-between mb-4">
        <span className="font-semibold text-gray-900 dark:text-white">
          Total:
        </span>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onCheckout}
        className="block w-full text-center bg-[#007BFF] text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default TotalCard;
