import { useState } from "react";
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
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [wishlistAlertOpen, setWishlistAlertOpen] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    setIsInCart(true);
    await addToCart({
      product_id: productId,
      quantity: 1,
      ...(user?.id ? { user_id: user.id } : {}),
    });
    setAlertOpen(true);
    setTimeout(() => setIsInCart(false), 2000);
  };

  const handleAddToWishlist = async () => {
    setIsInWishlist(true);
    await addToWishlist({
      product_id: productId,
      ...(user?.id ? { user_id: user.id } : {}),
    });
    setWishlistAlertOpen(true);
    setTimeout(() => setIsInWishlist(false), 2000);
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
        title="Added to Cart"
        description={`"${name}" has been added to your cart.`}
        type="success"
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
      <div className="relative bg-white w-[230px] h-[360px] rounded shadow hover:shadow-md transition overflow-hidden group flex flex-col">
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
                  isInWishlist
                    ? "bg-[#DC3545]"
                    : "bg-[#007BFF]/20 hover:bg-[#007BFF]/30"
                }`}
              >
                <BiHeart className="text-white text-xl" />
              </button>
              <a
                href={productLink}
                className="p-1.5 rounded-full bg-[#007BFF]/20 hover:bg-[#007BFF]/30 transition"
              >
                <BiShow className="text-white text-xl" />
              </a>
            </div>
          </>
        )}
        <a href={productLink} className="w-full h-[240px] overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </a>
        <div className="flex flex-col p-2">
          <h1 className="text-lg font-bold text-[#1A2238] truncate">{name}</h1>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm text-[#28A745] font-bold">${price}</p>
            {oldPrice && (
              <p className="text-sm text-[#DC3545] line-through italic font-medium">
                ${oldPrice}
              </p>
            )}
          </div>
          {renderStars()}
        </div>
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-0 w-full py-2 text-white font-medium transition-all duration-300 ${
            isInCart ? "bg-[#17C3B2]" : "bg-[#007BFF]/80 hover:bg-[#007BFF]"
          }`}
        >
          <div className="flex justify-center items-center gap-2">
            {isInCart ? (
              <BiCheck className="text-lg" />
            ) : (
              <BiCart className="text-lg" />
            )}
            {isInCart ? "Added" : "Add to Cart"}
          </div>
        </button>
      </div>
    </>
  );
};

export default ProductCard;
