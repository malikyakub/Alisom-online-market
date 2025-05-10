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
        <span className="font-semibold">${subtotal}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-2">
        <span className="font-semibold">Shipping:</span>
        <span className="font-semibold">{shipping}</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-4">
        <span className="font-semibold">Total:</span>
        <span className="font-semibold">${total}</span>
      </div>

      <button className="bg-[#007BFF]/80 text-white w-full py-2 rounded-md hover:bg-[#007BFF] transition">
        Proceed to checkout
      </button>
    </div>
  );
};

export default TotalCard;