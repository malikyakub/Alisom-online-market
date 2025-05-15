import React from "react";
import { CheckCircle } from "lucide-react";

const OrderPlaced: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
      <CheckCircle className="text-green-500 w-16 h-16" />
      <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
      <p className="text-gray-600">
        Thank you for your purchase. You will receive a confirmation email soon.
      </p>
      <a
        href="/"
        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue Shopping
      </a>
    </div>
  );
};

export default OrderPlaced;
