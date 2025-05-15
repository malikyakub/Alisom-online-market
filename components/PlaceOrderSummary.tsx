import React from "react";

type Product = {
  title: string;
  price: number;
  image?: string;
};

type PlaceOrderSummaryProps = {
  products: Product[];
  onPlaceOrder: () => void;
};

const PlaceOrderSummary: React.FC<PlaceOrderSummaryProps> = ({
  products,
  onPlaceOrder,
}) => {
  const total = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="w-full max-w-sm space-y-5 p-0">
      <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between border-b pb-2"
          >
            <div className="flex items-center space-x-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-14 h-14 object-cover rounded"
                />
              )}
              <h3 className="text-sm text-gray-800 font-semibold">
                {product.title}
              </h3>
            </div>
            <p className="text-sm text-gray-800 font-semibold">
              ${product.price}
            </p>
          </div>
        ))}
      </div>

      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900 font-semibold">${total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping:</span>
          <span className="text-green-500 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm pt-2">
        {["EVC Plus", "E-dahab", "Cash on Delivery"].map((method, idx) => (
          <label
            key={idx}
            className="accent-green-300 flex items-center space-x-2"
          >
            <input
              type="radio"
              name="payment"
              defaultChecked={method === "Cash on Delivery"}
              className="scale-125 accent-green-500"
            />
            <span className="text-gray-700">{method}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="text"
          placeholder="Coupon Code"
          className="flex-1 border border-gray-300 p-2 rounded text-sm"
        />
        <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
          Apply Coupon
        </button>
      </div>

      <button
        onClick={onPlaceOrder}
        className="w-full bg-blue-600 text-white py-2 text-sm font-semibold rounded hover:bg-blue-700 mt-2"
      >
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrderSummary;
export type { Product };
