import React from "react";
import { Truck, Store } from "lucide-react";

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
  <div className="flex items-start justify-between animate-pulse border-b border-gray-300 dark:border-gray-700 pb-3">
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
    <div className="w-10 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

const PlaceOrderSummary: React.FC<Props> = ({
  products,
  loading,
  selectedPayment,
  setSelectedPayment,
  selectedShippingType,
  setSelectedShippingType,
}) => {
  const total = products.reduce(
    (sum, product) => sum + product.price * (product.quantity ?? 1),
    0
  );

  const shippingOptions = [
    { value: "Delivery", label: "Delivery", icon: <Truck size={16} /> },
    { value: "Pickup", label: "Pickup", icon: <Store size={16} /> },
  ];

  const paymentOptions = [
    { value: "EVC Plus", label: "EVC Plus" },
    { value: "E-dahab", label: "E-dahab" },
  ];

  return (
    <div className="w-full md:max-w-sm space-y-6 p-4 text-gray-900 dark:text-gray-100 shadow-lg bg-white dark:bg-gray-900 rounded">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md shadow-inner max-h-64 overflow-y-auto space-y-4 pr-2">
        {loading || products.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonItem key={idx} />
            ))
          : products.map((product, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between border-b border-gray-300 dark:border-gray-700 pb-3"
              >
                <div className="flex items-end space-x-2">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold">{product.name}</h3>
                    <div className="flex flex-row gap-2 items-center">
                      {product.price}{" "}
                      {product.quantity && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          x{product.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  ${(product.price * (product.quantity ?? 1)).toFixed(2)}
                </p>
              </div>
            ))}
      </div>

      <div className="text-sm space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
          <span className="text-green-600 dark:text-green-400 font-medium">
            Free
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-300 dark:border-gray-700">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <h4 className="text-sm font-medium">Shipping Type</h4>
        <div className="flex space-x-2">
          {shippingOptions.map((opt) => {
            const isSelected = selectedShippingType === opt.value;
            return (
              <div
                key={opt.value}
                className={`flex items-center space-x-1 px-3 py-1 text-sm rounded cursor-pointer border transition ${
                  isSelected
                    ? "text-teal-600 border-teal-600 bg-teal-100 dark:bg-teal-800/40"
                    : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() =>
                  setSelectedShippingType(opt.value as "Delivery" | "Pickup")
                }
              >
                {opt.icon}
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h4 className="text-sm font-medium">Payment Method</h4>
        <div className="flex space-x-2">
          {paymentOptions.map((opt) => {
            const isSelected = selectedPayment === opt.value;
            return (
              <div
                key={opt.value}
                className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                  isSelected
                    ? "text-teal-600 border-teal-600 bg-teal-100 dark:bg-teal-800/40"
                    : "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedPayment(opt.value)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderSummary;
export type { Product };
