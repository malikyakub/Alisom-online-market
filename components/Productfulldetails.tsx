import React, { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { FaTruck, FaUndo } from "react-icons/fa";

const ProductFullDetails = () => {
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedSize, setSelectedSize] = useState("M");

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Havic HV G-92 Gamepad</h1>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex text-yellow-400">⭐⭐⭐⭐☆</div>
          <span className="text-sm text-gray-600">(150 Reviews)</span>
          <span className="text-sm text-green-600 font-medium">In Stock</span>
        </div>
        <p className="text-2xl font-semibold mt-2">$192.00</p>
        <p className="text-sm text-gray-700 mt-1">
          PlayStation 5 Controller Skin High quality vinyl with air channel
          adhesive for easy bubble free install & mess free removal. Pressure
          sensitive.
        </p>
      </div>

      <div>
        <p className="font-medium mb-1">Colours:</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedColor("blue")}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === "blue" ? "border-black" : "border-gray-300"
            } bg-blue-500`}
          />
          <button
            onClick={() => setSelectedColor("red")}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === "red" ? "border-black" : "border-gray-300"
            } bg-red-500`}
          />
        </div>
      </div>

      <div>
        <p className="font-medium mb-1">Size:</p>
        <div className="flex space-x-2">
          {["XS", "S", "M", "L", "X"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1 rounded-md border ${
                selectedSize === size
                  ? "bg-[#17C3B2] text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="border rounded-md p-2"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-medium">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="border rounded-md p-2"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex space-x-3">
        <button className="bg-[#007BFF] hover:bg-[#007bffde] text-white w-full py-2 rounded-md font-semibold">
          Buy Now
        </button>
        <button className="border rounded-md p-2">
          <Heart size={20} />
        </button>
      </div>

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
            <p className="font-semibold">Return Delivery</p>
            <p className="text-sm text-gray-600">
              Free 30 Days Delivery Returns.{" "}
              <span className="underline cursor-pointer">Details</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFullDetails;
