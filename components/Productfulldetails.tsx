import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineHeart } from "react-icons/ai";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";
import ProductReview from "./ProductReview";
import Alert from "./Alert";
import useProducts from "hooks/useProducts";
import useCart from "hooks/useCart";
import useAuth from "hooks/useAuth";
import useWishlist from "hooks/useWishlist";

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
  const [wishActive, setWishActive] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [ratings, setRatings] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [cartAlertOpen, setCartAlertOpen] = useState(false);
  const [cartAlertContent, setCartAlertContent] = useState({
    title: "",
    description: "",
    type: "success" as "success" | "warning" | "info" | "danger",
  });

  const { GetAverageRating } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist } = useWishlist();

  const handleAddToWishlist = async () => {
    setWishlistAlert(true);
    setWishActive(true);
    await addToWishlist({
      user_id: user?.id,
      product_id: product.product_id,
    });
    setTimeout(() => setWishActive(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsInCart(true);
    const result = await addToCart({
      product_id: product.product_id,
      quantity,
      ...(user?.id ? { user_id: user.id } : {}),
    });

    if (result.err) {
      setCartAlertContent({
        title: "Error Adding to Cart",
        description: result.err,
        type: "danger",
      });
    } else {
      setCartAlertContent({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        type: "success",
      });
    }

    setCartAlertOpen(true);

    setTimeout(() => {
      setIsInCart(false);
      if (!result.err) window.location.href = "/user/cart";
    }, 2000);
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
        title={cartAlertContent.title}
        description={cartAlertContent.description}
        type={cartAlertContent.type}
        isOpen={cartAlertOpen}
        onClose={() => setCartAlertOpen(false)}
      />

      <div className="space-y-6 bg-white dark:bg-black/50 text-gray-800 dark:text-white rounded p-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Brand:{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {product.brand.name}
            </span>{" "}
            &bull; Category:{" "}
            <span className="font-medium text-gray-800 dark:text-white">
              {product.category.name}
            </span>
          </p>

          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 text-yellow-400">
              {renderStars()}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {ratings ? ratings.toFixed(1) : "0.0"}
              </span>
            </div>
            <button
              onClick={() => setViewingReviews(!viewingReviews)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ({reviews} Reviews)
            </button>
            <span
              className={`text-sm font-medium ${
                product.stock_quantity > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className="text-2xl font-semibold mt-2 text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {product.description}
          </p>
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
              {[...product.Specifications, ...product.Specifications].map(
                (spec, i) => {
                  const cleaned = spec.replace(/[^a-zA-Z0-9\s]/g, "").trim();
                  return (
                    <div
                      key={i}
                      className="rounded border border-blue-500 bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/30 font-semibold text-gray-900 dark:text-white py-1 px-3"
                    >
                      {cleaned}
                    </div>
                  );
                }
              )}
            </motion.div>
          </motion.div>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange("dec")}
            className="border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-white rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <AiOutlineMinus size={16} />
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => onQuantityChange("inc")}
            className="border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-white rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <AiOutlinePlus size={16} />
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBuyNow}
            disabled={product.stock_quantity === 0 || isInCart}
            className={`w-full py-2 rounded-md font-semibold text-white transition-all duration-300
    ${
      product.stock_quantity === 0
        ? "bg-blue-400/60"
        : isInCart
        ? "bg-green-600"
        : "bg-blue-600 hover:bg-blue-700"
    }
  `}
          >
            {isInCart
              ? "Adding..."
              : product.stock_quantity === 0
              ? "Out of Stock"
              : "Buy Now"}
          </button>

          <button
            onClick={handleAddToWishlist}
            className={`border rounded-md p-2 transition-colors ${
              wishActive
                ? "text-red-500 border-red-500"
                : "text-gray-800 dark:text-white border-gray-400 dark:border-gray-600"
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
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
