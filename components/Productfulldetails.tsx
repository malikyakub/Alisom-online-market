import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineHeart } from "react-icons/ai";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductReview from "./ProductReview";
import Alert from "./Alert";
import useProducts from "hooks/useProducts";
import useCart from "hooks/useCart";
import useAuth from "hooks/useAuth";

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
  const [wishActive, setWishActive] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [ratings, setRatings] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const { GetAverageRating } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToWishlist = () => {
    setWishlistAlert(true);
    setWishActive(true);
    setTimeout(() => setWishActive(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsInCart(true);
    await addToCart({
      product_id: product.product_id,
      quantity,
      ...(user?.id ? { user_id: user.id } : {}),
    });
    setCartAlert(true);
    setTimeout(() => setIsInCart(false), 2000);
  };

  useEffect(() => {
    const getRatings = async () => {
      const { err, data } = await GetAverageRating(product.product_id);
      if (err) return;
      if (data) {
        setRatings(parseFloat(data.average || "0"));
        setReviews(data.count || 0);
      }
    };
    getRatings();
  }, [product.product_id]);

  useEffect(() => {
    if (wishlistAlert) setTimeout(() => setWishlistAlert(false), 3000);
  }, [wishlistAlert]);

  useEffect(() => {
    if (cartAlert) setTimeout(() => setCartAlert(false), 3000);
  }, [cartAlert]);

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const current = i + 1;
      if (ratings >= current)
        return <BsStarFill key={`star-${i}`} className="text-yellow-400" />;
      if (ratings >= current - 0.5)
        return <BsStarHalf key={`star-${i}`} className="text-yellow-400" />;
      return <BsStar key={`star-${i}`} className="text-yellow-400" />;
    });
  };

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
            <div className="flex items-center space-x-1 text-yellow-400">
              {renderStars()}
              <span className="ml-2 text-gray-600 text-sm">
                {ratings ? ratings.toFixed(1) : "0.0"}
              </span>
            </div>
            <button
              onClick={() => setViewingReviews(!viewingReviews)}
              className="text-sm text-blue-600 hover:underline"
            >
              ({reviews} Reviews)
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
          <motion.div className="overflow-hidden w-full">
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
              {product.Specifications.map((spec, i) => {
                const cleaned = spec.replace(/[^a-zA-Z0-9\s]/g, "").trim();
                return (
                  <div
                    key={i}
                    className="rounded border border-[#007BFF] bg-[#007BFF]/20 hover:bg-[#007BFF]/30 font-semibold text-[#1A2238] py-1 px-3"
                  >
                    {cleaned}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange("dec")}
            className="border rounded-md p-2"
          >
            <AiOutlineMinus size={16} />
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => onQuantityChange("inc")}
            className="border rounded-md p-2"
          >
            <AiOutlinePlus size={16} />
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBuyNow}
            disabled={product.stock_quantity === 0}
            className={`w-full py-2 rounded-md font-semibold text-white transition-all duration-300 ${
              isInCart
                ? "bg-[#17C3B2]"
                : product.stock_quantity === 0
                ? "bg-[#007BFF]/60 cursor-not-allowed"
                : "bg-[#007BFF]/80 hover:bg-[#007BFF]"
            }`}
          >
            {isInCart ? "Added" : "Buy Now"}
          </button>
          <button
            onClick={handleAddToWishlist}
            className={`border rounded-md p-2 transition-colors ${
              wishActive ? "text-red-500" : "text-black"
            }`}
          >
            <AiOutlineHeart size={20} />
          </button>
        </div>

        <ProductReview productId={product.product_id} />
      </div>
    </>
  );
};

export default ProductFullDetails;
