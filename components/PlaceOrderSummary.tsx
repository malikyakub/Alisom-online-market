import React from "react";

type Product = {
  name: string;
  price: number;
  image?: string;
  quantity?: number;
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
  <div className="flex items-start justify-between animate-pulse border-b border-gray-700 pb-3">
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 bg-gray-700 rounded-lg" />
      <div className="w-24 h-4 bg-gray-700 rounded" />
    </div>
    <div className="w-10 h-4 bg-gray-700 rounded" />
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
    <div className="w-full md:max-w-sm space-y-6 p-4 text-gray-100 shadow-lg bg-gray-900 rounded-xl">
      {/* Product List */}
      <div className="bg-gray-800 p-3 rounded-md shadow-inner max-h-64 overflow-y-auto space-y-4 pr-2">
        {loading || products.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonItem key={idx} />
            ))
          : products.map((product, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between border-b border-gray-700 pb-3"
              >
                <div className="flex items-center space-x-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-gray-100">
                      {product.name}
                    </h3>
                    {product.quantity && (
                      <span className="text-xs text-gray-400">
                        x{product.quantity}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">
                  ${product.price}
                </p>
              </div>
            ))}
      </div>

      <div className="text-sm space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-gray-400">Subtotal:</span>
          <span className="text-gray-100 font-semibold">${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Shipping:</span>
          <span className="text-green-400 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-700">
          <span className="text-gray-100">Total:</span>
          <span className="text-gray-100">${total}</span>
        </div>
      </div>

      {/* Shipping Type */}
      <div className="space-y-2 pt-4">
        <h4 className="text-sm font-medium text-gray-200">Shipping Type</h4>
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
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 rounded-full"
            />
            <span className="text-sm text-gray-300">{type}</span>
          </label>
        ))}
      </div>

      {/* Payment Method */}
      <div className="space-y-2 pt-2">
        <h4 className="text-sm font-medium text-gray-200">Payment Method</h4>
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
              className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 rounded-full"
            />
            <span className="text-sm text-gray-300">{method}</span>
          </label>
        ))}
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={loading || products.length === 0}
        className={`w-full py-2 text-sm font-semibold rounded-md transition duration-150 ${
          loading || products.length === 0
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
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
