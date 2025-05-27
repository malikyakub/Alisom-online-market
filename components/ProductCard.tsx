import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BiCart, BiHeart, BiCheck, BiShow } from "react-icons/bi";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import useCart from "hooks/useCart";
import useAuth from "hooks/useAuth";
import useWishlist from "hooks/useWishlist";
import Alert from "components/Alert";

type ProductCardProps = {
  image: string;
  name: string;
  price: number;
  rating?: number;
  oldPrice?: number;
  featured?: boolean;
  badge?: string;
  badgeColor?: string;
  productId: string;
};

const ProductCard = ({
  image,
  name,
  price,
  oldPrice,
  rating = 3.5,
  featured = false,
  badge,
  badgeColor,
  productId,
}: ProductCardProps) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [wishlistAlertOpen, setWishlistAlertOpen] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const computedOldPrice =
    oldPrice ??
    (Math.round((price + Math.random() * (price * 0.75)) * 100) / 100).toFixed(
      2
    );

  const addToCartMutation = useMutation({
    mutationFn: () =>
      addToCart({
        product_id: productId,
        quantity: 1,
        ...(user?.id ? { user_id: user.id } : {}),
      }),
    onSuccess: () => {
      setAlertType("success");
      setAlertMessage(`"${name}" has been added to your cart.`);
      setAlertOpen(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      setAlertType("danger");
      setAlertMessage(error.message || "Failed to add to cart.");
      setAlertOpen(true);
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: () =>
      addToWishlist({
        product_id: productId,
        ...(user?.id ? { user_id: user.id } : {}),
      }),
    onSuccess: () => {
      setWishlistAlertOpen(true);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      setAlertType("danger");
      setAlertMessage(error.message || "Failed to add to wishlist.");
      setAlertOpen(true);
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate();
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} className="text-[#FFD700]" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<AiTwotoneStar key={i} className="text-[#FFD700]" />);
      } else {
        stars.push(<AiOutlineStar key={i} className="text-[#FFD700]" />);
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const productLink = `/user/products/${productId}`;

  return (
    <>
      <Alert
        title={alertType === "success" ? "Success" : "Error"}
        description={alertMessage}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
      <Alert
        title="Added to Wishlist"
        description={`"${name}" has been added to your wishlist.`}
        type="info"
        isOpen={wishlistAlertOpen}
        onClose={() => setWishlistAlertOpen(false)}
      />
      <div className="relative bg-white dark:bg-white/20 w-full sm:w-[230px] h-[340px] sm:h-[360px] rounded shadow hover:shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.15)] transition overflow-hidden group flex flex-col">
        {featured && (
          <>
            {badge && (
              <div
                className="absolute top-4 left-0 text-white text-xs font-semibold px-3 py-2 rounded-r z-10"
                style={{
                  backgroundColor:
                    badgeColor || badge === "New" ? "#17C3B2" : "#007BFF",
                }}
              >
                {badge}
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
              <button
                onClick={handleAddToWishlist}
                className={`p-1.5 rounded-full transition-transform duration-300 ${
                  addToWishlistMutation.status === "pending"
                    ? "bg-[#DC3545]/80"
                    : "bg-[#007BFF]/10 hover:bg-[#007BFF]/20"
                }`}
                disabled={addToWishlistMutation.status === "pending"}
              >
                <BiHeart className="text-white text-xl" />
              </button>
              <a
                href={productLink}
                className="p-1.5 rounded-full bg-[#007BFF]/10 hover:bg-[#007BFF]/20 transition"
              >
                <BiShow className="text-white text-xl" />
              </a>
            </div>
          </>
        )}
        <a
          href={productLink}
          className="w-full h-[200px] sm:h-[240px] overflow-hidden"
        >
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </a>
        <div className="flex flex-col p-2">
          <h1 className="text-lg font-bold text-[#1A2238] dark:text-[#F4F4F4] truncate">
            {name}
          </h1>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm text-[#28A745] font-bold">${price}</p>
            <p className="text-sm text-[#DC3545] line-through italic font-medium">
              ${computedOldPrice}
            </p>
          </div>
          {renderStars()}
        </div>
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 w-full py-2 text-white font-medium transition-all duration-300 ${
            addToCartMutation.status === "pending"
              ? "bg-[#17C3B2]"
              : "bg-[#007BFF]/80 hover:bg-[#007BFF]"
          }`}
          disabled={addToCartMutation.status === "pending"}
        >
          <div className="flex justify-center items-center gap-2">
            {addToCartMutation.status === "pending" ? (
              <BiCheck className="text-lg animate-spin" />
            ) : (
              <BiCart className="text-lg" />
            )}
            {addToCartMutation.status === "pending"
              ? "Adding..."
              : "Add to Cart"}
          </div>
        </button>
      </div>
    </>
  );
};

export default ProductCard;
