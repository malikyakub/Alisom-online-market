import React from "react";

type TotalCardProps = {
  subtotal: number;
  shipping: string;
  total: number;
};

const TotalCard: React.FC<TotalCardProps> = ({ subtotal, shipping, total }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Cart Total</h2>

      <div className="flex justify-between mb-2">
        <span className="font-semibold">Subtotal:</span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-2">
        <span className="font-semibold">Shipping:</span>
        <span className="font-semibold">{shipping}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-4">
        <span className="font-semibold">Total:</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </div>

      <a
        href="/user/checkout"
        className="block w-full text-center bg-[#007BFF] text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
      >
        Proceed to Checkout
      </a>
    </div>
  );
};

export default TotalCard;
