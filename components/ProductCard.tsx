import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ProductCardProps {
  image: string;
  title: string;
  price: string | number;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  rating,
}) => {
  return (
    <div className="bg-white w-[270px] h-[350px] rounded-lg relative flex flex-col gap-2 m-2 shadow-sm">
      <div className="w-full h-[250px] rounded-t-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h1 className="font-bold text-xl text-[#1A2238]">{title}</h1>
        <h1 className="text-sm text-[#1A2238]">${price}</h1>

        <div className="flex">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={index < rating ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-3 h-3 mr-1 text-yellow-500"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.253L12 18.897l-7.417 4.626L6 15.27 0 9.423l8.332-1.268z" />
              </svg>
            ))}
        </div>
      </div>

      <div className="flex flex-col justify-between items-center p-2 absolute right-2 top-2 gap-2">
        <div className="flex justify-center items-center bg-white rounded-full p-2 hover:bg-[#dc354633] hover:shadow-lg transition duration-300 cursor-pointer active:scale-95">
          <FaRegHeart
            className="w-5 h-5 text-[#DC3545]"
            aria-label="Add to Wishlist"
          />
        </div>

        <div className="flex justify-center items-center bg-white rounded-full p-2 hover:bg-[#28A74533] hover:shadow-lg transition duration-300 cursor-pointer active:scale-95">
          <AiOutlineShoppingCart
            className="w-5 h-5 text-[#28A745]"
            aria-label="Add to Cart"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
