import React from 'react';

const TotalCart = () => {
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

      <button className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition">
        Proceed to checkout
      </button>
    </div>
  );
};

export default TotalCart;
