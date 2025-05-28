import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductCardSkeleton from "components/skeletons/ProductCardSkeleton";
import ProductCard from "components/ProductCard";
import Heading from "components/Heading";
import useWishlist from "hooks/useWishlist";
import useAuth from "hooks/useAuth";
import useProducts from "hooks/useProducts";
const WishlistPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    getWishlist,
    addToWishlist,
    getRecommendedProducts,
    clearWishlist,
    moveToCart,
    isLoading: wishlistLoading,
  } = useWishlist();

  const { GetProductById, GetAverageRating } = useProducts();

  const enrichProduct = async (productId: string) => {
    const { data: productDetails, err: productErr } = await GetProductById(
      productId
    );
    if (productErr || !productDetails) return null;

    const { data: ratingData } = await GetAverageRating(productId);

    return {
      ...productDetails,
      rating: ratingData?.average ?? null,
      ratingCount: ratingData?.count ?? 0,
    };
  };

  const {
    data: wishlistProducts = [],
    isLoading: isWishlistLoading,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, err } = await getWishlist(user.id);
      if (err || !data) return [];

      const detailed = await Promise.all(
        data.map((item: any) => enrichProduct(item.product_id || item.id))
      );
      return detailed.filter(Boolean);
    },
    enabled: !!user?.id,
  });

  const {
    data: guestWishlistProducts = [],
    isLoading: isGuestWishlistLoading,
    refetch: refetchGuestWishlist,
  } = useQuery({
    queryKey: ["guestWishlist"],
    queryFn: async () => {
      const guestWishlist = localStorage.getItem("guest_wishlist");
      if (!guestWishlist) return [];

      const items = JSON.parse(guestWishlist);
      const detailed = await Promise.all(
        items.map((item: any) => enrichProduct(item.product_id || item.id))
      );
      return detailed.filter(Boolean);
    },
    enabled: !user?.id,
  });

  const { data: recommended = [], isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["recommendedProducts"],
    queryFn: async () => {
      const { data, err } = await getRecommendedProducts();
      if (err || !data) return [];

      const detailedRecommended = await Promise.all(
        data.map((item: any) => enrichProduct(item.product_id || item.id))
      );
      return detailedRecommended.filter(Boolean);
    },
  });

  const handleAddToWishlist = async (productId: string) => {
    await addToWishlist({ product_id: productId, user_id: user?.id });
    if (user?.id) {
      refetchWishlist();
    } else {
      refetchGuestWishlist();
    }
  };

  const handleClearWishlist = async () => {
    if (!user?.id) {
      localStorage.removeItem("guest_wishlist");
      refetchGuestWishlist();
    } else {
      await clearWishlist(user.id);
      refetchWishlist();
    }
  };

  const handleMoveToCart = async (productId: string) => {
    if (wishlistLoading) return;
    const { err } = await moveToCart(productId, user?.id);
    if (!err) {
      if (user?.id) {
        refetchWishlist();
      } else {
        refetchGuestWishlist();
      }
    }
  };

  const handleMoveAllToCart = async () => {
    if (wishlistLoading) return;

    const currentWishlist = user?.id ? wishlistProducts : guestWishlistProducts;

    for (const product of currentWishlist) {
      const productId = product.product_id || product.id;
      await moveToCart(productId, user?.id);
    }

    if (user?.id) {
      refetchWishlist();
    } else {
      refetchGuestWishlist();
    }
  };

  const displayedWishlist = user?.id ? wishlistProducts : guestWishlistProducts;
  const displayedLoading = user?.id
    ? isWishlistLoading
    : isGuestWishlistLoading;

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="text-sm text-gray-500 mb-6 dark:text-[#F4F4F4]">
        Home / User /{" "}
        <span className="text-black font-semibold dark:text-[#17C3B2]">
          Wishlist
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-[#1A2238]">
          Wishlist{" "}
          {!displayedLoading && <span>({displayedWishlist.length})</span>}
        </h2>
        <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={handleMoveAllToCart}
            disabled={wishlistLoading || displayedWishlist.length === 0}
            className="border px-4 py-2 font-bold rounded text-[#333333] dark:text-[#F4F4F4] border-[#A3A3A3] dark:border-white hover:text-white hover:border-[#007BFF] hover:bg-[#007BFF] transition w-full sm:w-[150px] text-sm"
          >
            {wishlistLoading ? "Moving..." : "Move All To Bag"}
          </button>
          <button
            onClick={handleClearWishlist}
            disabled={wishlistLoading}
            className="border px-4 py-2 font-bold rounded text-red-600 border-red-400 hover:text-white hover:bg-red-500 transition w-full sm:w-[180px] text-sm"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {displayedLoading ? (
          Array(4)
            .fill(null)
            .map((_, i) => <ProductCardSkeleton key={i} />)
        ) : displayedWishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h12.5M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <p className="text-lg text-gray-500">Your wishlist is empty.</p>
          </div>
        ) : (
          displayedWishlist.slice(0, 3).map((product: any) => {
            const productId = product.product_id || product.id;
            return (
              <div key={productId} className="relative">
                <ProductCard
                  productId={productId}
                  image={product.image}
                  name={product.title || product.name}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  badge={product.badge}
                  rating={product.rating}
                />
                <button
                  onClick={() => handleMoveToCart(productId)}
                  disabled={wishlistLoading}
                  className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Move To Cart
                </button>
              </div>
            );
          })
        )}
      </div>

      {!isRecommendedLoading && recommended.length > 0 && (
        <div className="mt-12 mb-8">
          <Heading title="Just For You" subtitle="Recommended Products" />
          <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((product) => (
              <ProductCard
                key={product.product_id || product.id}
                productId={product.product_id || product.id}
                image={product.image}
                name={product.title || product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                badge={product.badge}
                rating={product.rating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
