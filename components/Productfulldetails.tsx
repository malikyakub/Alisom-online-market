import React, { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { motion } from "framer-motion";
import ProductReview from "./ProductReview";
import Alert from "./Alert";

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
  const [viewingReviews, setViewingReviews] = useState(false);
  const [wishlistAlert, setWishlistAlert] = useState(false);
  const [cartAlert, setCartAlert] = useState(false);

  const handleAddToWishlist = () => setWishlistAlert(true);
  const handleBuyNow = () => setCartAlert(true);

  return (
    <>
      <Alert
        title="Added to Wishlist"
        description={`${product.name} has been added to your wishlist.`}
        type="info"
        isOpen={wishlistAlert}
        onClose={() => setWishlistAlert(false)}
      />

      <Alert
        title="Added to Cart"
        description={`${product.name} has been added to your cart.`}
        type="success"
        isOpen={cartAlert}
        onClose={() => setCartAlert(false)}
      />

      <div className="space-y-6">
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
            <button
              onClick={() => setViewingReviews((prev) => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              (150 Reviews)
            </button>
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

        {product.Specifications && product.Specifications.length > 0 && (
          <motion.div
            className="overflow-hidden w-full"
            aria-label="Product Specifications"
          >
            <p className="font-medium mb-2">Key Specifications:</p>
            <motion.div
              className="flex space-x-4 min-w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              }}
            >
              {product.Specifications?.map((spec, i) => {
                const cleaned = spec.replace(/[^a-zA-Z\s]/g, "").trim();
                return (
                  <div
                    key={i}
                    className="rounded border border-[#007BFF] bg-[#007BFF]/20 hover:bg-[#007BFF]/30 font-semibold text-[#1A2238] py-1 px-3"
                  >
                    {cleaned}
                  </div>
                );
              })}

              {product.Specifications.map((spec, i) => (
                <div
                  key={`second-${i}`}
                  className="whitespace-nowrap border border-[#007BFF] bg-[#007BFF]/20 hover:bg-[#007BFF]/30 text-[#1A2238] font-semibold rounded px-4 py-2"
                >
                  {spec}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

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

        <div className="flex space-x-3">
          <button
            onClick={handleBuyNow}
            className="bg-[#007BFF] hover:bg-[#007bffde] text-white w-full py-2 rounded-md font-semibold"
          >
            Buy Now
          </button>
          <button
            onClick={handleAddToWishlist}
            className="border rounded-md p-2"
          >
            <Heart size={20} />
          </button>
        </div>

        <ProductReview productId={product.product_id} />
      </div>
    </>
  );
};

export default ProductFullDetails;
