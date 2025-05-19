import React from "react";

type Product = {
  title: string;
  price: number;
  image?: string;
};

type Props = {
  products: Product[];
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  onPlaceOrder: () => void;
};

const PlaceOrderSummary: React.FC<Props> = ({
  products,
  selectedPayment,
  setSelectedPayment,
  onPlaceOrder,
}) => {
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="w-full md:max-w-sm space-y-6 p-4 text-[#1F2937] shadow-lg rounded-xl">
      <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between border-b border-gray-300 pb-3"
          >
            <div className="flex items-center space-x-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded-lg"
                />
              )}
              <h3 className="text-sm font-medium">{product.title}</h3>
            </div>
            <p className="text-sm font-semibold">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="text-sm space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal:</span>
          <span className="text-gray-900 font-semibold">${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Shipping:</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-300">
          <span className="text-gray-900">Total:</span>
          <span className="text-gray-900">${total}</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {["EVC Plus", "E-dahab"].map((method) => (
          <label
            key={method}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === method}
              onChange={() => setSelectedPayment(method)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 rounded-full transition duration-200"
            />
            <span className="text-sm text-gray-700">{method}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center space-x-3 pt-3">
        <input
          type="text"
          placeholder="Coupon Code"
          className="flex-1 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 rounded-md text-sm bg-white text-gray-700 transition-all duration-200"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition duration-150">
          Apply
        </button>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-semibold rounded-md transition duration-150"
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrderSummary;
export type { Product };
