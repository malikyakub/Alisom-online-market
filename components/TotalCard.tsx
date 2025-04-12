import React from "react";

const TotalCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80">
      <h2 className="text-lg font-bold mb-4">Cart Total</h2>

      <div className="flex justify-between mb-2">
        <span className="font-semibold">Subtotal:</span>
        <span className="font-semibold">$1750</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-2">
        <span className="font-semibold">Shipping:</span>
        <span className="font-semibold">Free</span>
      </div>

      <hr className="my-2" />

      <div className="flex justify-between mb-4">
        <span className="font-semibold">Total:</span>
        <span className="font-semibold">$1750</span>
      </div>

      <button className="bg-[#007BFF]/80 text-white w-full py-2 rounded-md hover:bg-[#007BFF] transition">
        Proceed to checkout
      </button>
    </div>
  );
};

export default TotalCard;
