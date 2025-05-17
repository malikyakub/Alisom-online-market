import React from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";

type ProductCardProps = {
  product: {
    name: string;
    price: number;
    image: string;
    rating?: number;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const rating = product.rating ?? 4.5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="relative w-full max-w-sm h-96 rounded-2xl shadow-lg overflow-hidden bg-white">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button className="p-2 rounded-full bg-[#17C3B2] text-white hover:opacity-90">
          <ShoppingCart size={18} />
        </button>
        <button className="p-2 rounded-full bg-[#DC3545] text-white hover:opacity-90">
          <Heart size={18} />
        </button>
      </div>

      <div className="h-[70%] w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="h-[30%] p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h2>
          <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center gap-1 mt-2">
          {[...Array(fullStars)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className="text-yellow-500 fill-yellow-500"
            />
          ))}
          {halfStar && (
            <Star
              size={16}
              className="text-yellow-500 fill-yellow-500 opacity-50"
            />
          )}
          <span className="text-sm text-gray-500 ml-1">
            ({rating.toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
