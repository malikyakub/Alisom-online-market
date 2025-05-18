import React from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { FaTruck, FaUndo } from "react-icons/fa";

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: { name: string };
  brand: { name: string };
  Specifications?: string[];
}

interface Props {
  product: Product;
  quantity: number;
  onQuantityChange: (type: "inc" | "dec") => void;
}

const ProductFullDetails: React.FC<Props> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="max-w-md space-y-6">
      {/* Title and Price */}
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-500">
          Brand:{" "}
          <span className="font-medium text-black">{product.brand.name}</span>{" "}
          &bull; Category:{" "}
          <span className="font-medium text-black">
            {product.category.name}
          </span>
        </p>
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex text-yellow-400">⭐⭐⭐⭐☆</div>
          <span className="text-sm text-gray-600">(150 Reviews)</span>
          <span
            className={`text-sm font-medium ${
              product.stock_quantity > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <p className="text-2xl font-semibold mt-2">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-700 mt-2">{product.description}</p>
      </div>

      {/* Specifications */}
      {product.Specifications && product.Specifications.length > 0 && (
        <div>
          <p className="font-medium mb-2">Key Specifications:</p>
          <div className="flex flex-wrap gap-2">
            {product.Specifications.map((spec, i) => (
              <div
                key={i}
                className="rounded border border-[#007BFF] bg-[#007BFF]/20 font-semibold text-[#1A2238] py-1 px-3"
              >
                {spec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onQuantityChange("dec")}
          className="border rounded-md p-2"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={() => onQuantityChange("inc")}
          className="border rounded-md p-2"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="bg-[#007BFF] hover:bg-[#007bffde] text-white w-full py-2 rounded-md font-semibold">
          Buy Now
        </button>
        <button className="border rounded-md p-2">
          <Heart size={20} />
        </button>
      </div>

      {/* Delivery & Return Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <FaTruck className="mt-1" size={20} />
          <div>
            <p className="font-semibold">Free Delivery</p>
            <p className="text-sm text-gray-600">
              Enter your postal code for Delivery Availability
            </p>
          </div>
        </div>
        <div className="border-t pt-2 flex items-start space-x-3">
          <FaUndo className="mt-1" size={20} />
          <div>
            <p className="font-semibold">Return Policy</p>
            <p className="text-sm text-gray-600">
              30 Days Hassle-Free Returns.{" "}
              <span className="underline cursor-pointer">Learn more</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFullDetails;
