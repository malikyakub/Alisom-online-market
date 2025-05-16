import { Eye, Trash2 } from "lucide-react";
import React from "react";

interface Product {
  title?: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  tag?: string;
  rating?: number;
}

interface WishlistProductCardProps {
  product: Product;
  isWishlist: boolean;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({
  product,
  isWishlist,
}) => (
  <div className="relative bg-white rounded-lg p-3 w-full max-w-[15rem] shadow hover:shadow-lg transition">
    {/* Discount or Tag */}
    {product.discount && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        {product.discount}
      </span>
    )}
    {product.tag && (
      <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
        {product.tag}
      </span>
    )}

    {/* Wishlist or View Icon */}
    <button
      className={`absolute top-2 right-2 text-gray-500 ${
        isWishlist ? "hover:text-red-500" : "hover:text-teal-500"
      }`}
    >
      {isWishlist ? <Trash2 size={16} /> : <Eye size={16} />}
    </button>

    {/* Image */}
    <img
      src={product.image}
      alt={product.title ?? "Untitled Product"}
      className="w-full h-36 object-contain mb-2"
    />

    {/* Title */}
    <h3 className="text-sm font-semibold mb-1">
      {product.title ?? "Untitled Product"}
    </h3>

    {/* Add to Cart */}
    <button className="mt-2 w-full bg-teal-500 text-white text-sm py-1 rounded hover:bg-teal-600 transition">
      Add To Cart
    </button>

    {/* Price Section */}
    <div className="text-sm font-bold text-teal-600 mt-2">${product.price}</div>
    {product.oldPrice && (
      <div className="text-xs line-through text-gray-500">
        ${product.oldPrice}
      </div>
    )}

    {/* Rating */}
    {product.rating && (
      <div className="flex text-yellow-400 text-sm mt-1">
        {"★★★★★".slice(0, product.rating)}
        <span className="ml-1 text-gray-500 text-xs">(65)</span>
      </div>
    )}
  </div>
);

export default WishlistProductCard;
