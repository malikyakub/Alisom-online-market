import React from "react";
import { FaHeart, FaEye, FaStar } from "react-icons/fa";

type ProductCardProps = {
  image: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
};

const ProductCard2: React.FC<ProductCardProps> = ({
  image,
  name,
  price,
  rating,
  reviews,
}) => {
  return (
    <div className="relative w-64 bg-white shadow-md rounded-xl overflow-hidden group transition duration-300">
      {/* Product Image */}
      <div className="overflow-hidden w-full h-48 relative">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition">
        <button className="bg-teal-500 text-white py-2 w-full font-semibold">
          Add To Cart
        </button>
      </div>
      </div>

      {/* Icons Top Right */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaHeart className="text-gray-600" />
        </button>
        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <FaEye className="text-gray-600" />
        </button>
      </div>

      {/* Add to Cart Button */}
      

      {/* Info Section */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-1">{name}</h3>
        <p className="text-teal-600 font-semibold mb-1">${price}</p>

        <div className="flex items-center text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-gray-500 ml-2 text-xs">({reviews})</span>
        </div>
        
        
      </div>
    </div>
  );
};

export default ProductCard2;
