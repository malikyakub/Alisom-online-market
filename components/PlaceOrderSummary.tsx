import React from "react";

type Product = {
  title: string;
  price: number;
  image?: string;
};

type Props = {
  products: Product[];
  loading: boolean;
  selectedPayment: string;
  setSelectedPayment: (method: string) => void;
  selectedShippingType: "Delivery" | "Pickup";
  setSelectedShippingType: (type: "Delivery" | "Pickup") => void;
  onPlaceOrder: () => void;
};

const SkeletonItem = () => (
  <div className="flex items-start justify-between animate-pulse border-b border-gray-300 pb-3">
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 bg-gray-300 rounded-lg" />
      <div className="w-24 h-4 bg-gray-300 rounded" />
    </div>
    <div className="w-10 h-4 bg-gray-300 rounded" />
  </div>
);

const PlaceOrderSummary: React.FC<Props> = ({
  products,
  loading,
  selectedPayment,
  setSelectedPayment,
  selectedShippingType,
  setSelectedShippingType,
  onPlaceOrder,
}) => {
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="w-full md:max-w-sm space-y-6 p-4 text-[#1F2937] shadow-lg rounded-xl">
      <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
        {loading || products.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonItem key={idx} />
            ))
          : products.map((product, idx) => (
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
        <div className="flex items-start justify-between">
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

      <div className="space-y-2 pt-4">
        <h4 className="text-sm font-medium text-gray-800">Shipping Type</h4>
        {["Delivery", "Pickup"].map((type) => (
          <label
            key={type}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              name="shippingType"
              checked={selectedShippingType === type}
              onChange={() =>
                setSelectedShippingType(type as "Delivery" | "Pickup")
              }
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2 rounded-full transition duration-200"
            />
            <span className="text-sm text-gray-700">{type}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2 pt-2">
        <h4 className="text-sm font-medium text-gray-800">Payment Method</h4>
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

      <button
        onClick={onPlaceOrder}
        disabled={loading || products.length === 0}
        className={`w-full py-2 text-sm font-semibold rounded-md transition duration-150 ${
          loading || products.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default PlaceOrderSummary;
export type { Product };
