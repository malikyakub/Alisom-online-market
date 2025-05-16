import React, { useState, useRef } from "react";
import ProductDetailsCard from "components/ProductDetailsCard";
import TotalCard from "components/TotalCard";

const initialCartItems = [
  {
    name: "LCD Monitor",
    price: 650,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/8c/db/e1/8cdbe123010c380e20f264a8fdd57938.jpg",
  },
  {
    name: "H1 Gamepad",
    price: 550,
    quantity: 2,
    image:
      "https://i.pinimg.com/736x/ff/e8/1c/ffe81ce91a873e2aecb74b25ecaff8bf.jpg",
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const tempQuantitiesRef = useRef(cartItems.map((item) => item.quantity));

  const handleQuantityTempChange = (index: number, newQty: number) => {
    tempQuantitiesRef.current[index] = newQty;
  };

  const handleUpdateCart = () => {
    setCartItems((prev) =>
      prev.map((item, i) => ({
        ...item,
        quantity: tempQuantitiesRef.current[i],
      }))
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div className="text-sm text-gray-500 mb-6">
        Home / Shop / <span className="text-black font-semibold">Cart</span>
      </div>

      <div className="flex flex-col gap-2">
        {cartItems.map((item, index) => (
          <ProductDetailsCard
            key={index}
            product={item}
            quantity={tempQuantitiesRef.current[index]}
            onQuantityChange={(qty) => handleQuantityTempChange(index, qty)}
          />
        ))}
      </div>

      <div className="flex justify-between my-4">
        <button className="px-6 py-2 border border-[#1A2238] font-bold rounded text-sm text-[#666666] hover:bg-[#1A2238] transition hover:text-white">
          Return to Shop
        </button>
        <button
          onClick={handleUpdateCart}
          className="bg-[#007BFF] hover:bg-blue-700 font-bold transition text-white px-6 py-2 rounded text-sm"
        >
          Update Cart
        </button>
      </div>

      <div className="w-full md:w-1/3">
        <TotalCard subtotal={subtotal} shipping="Free" total={subtotal} />
      </div>
    </div>
  );
}
