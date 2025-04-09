import React from 'react';
import { FaRegHeart } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";


interface ProductCardProps {
  image: string;
  title: string;
  price: string | number;
  rating: number;
}
const ProductCard: React.FC<ProductCardProps> = ({ image, title, price, rating }) => {
  return (
    <div className="bg-white w-40 h-60 rounded relative flex flex-col gap-2 m-2 shadow-sm">
      <div className="w-full h-40 rounded-t overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 p-1 justify-start">
        <h1 className="font-bold text-sm">{title}</h1>
        <h1 className="font-thin text-sm">${price}</h1>
        <div className="flex">
          {Array(5).fill(0).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill={index < rating ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-3 h-3 mr-1 text-yellow-500"
              
            >
              <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.253L12 18.897l-7.417 4.626L6 15.27 0 9.423l8.332-1.268z" />
            </svg>
          ))}
        </div>
      </div>
      <div className="flex-col justify-between items-center p-2 absolute right-1 top-1  flex gap-2">
        <div className=' justify-center items-center bg-white rounded-full p-1'>
          <FaRegHeart className='w-4 h-4'/>
        </div>
        <div className='justify-center items-center bg-white rounded-full p-1'>  
          <AiOutlineShoppingCart className='w-4 h-4'/>
          </div>
        </div>
    </div>
  );
};


export default ProductCard;


