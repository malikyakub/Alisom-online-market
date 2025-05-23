import React, { useEffect, useState } from "react";
import ProductCard from "components/ProductCard";
import Heading from "components/Heading";
import useWishlist from "hooks/useWishlist";
import useAuth from "hooks/useAuth";
import useProducts from "hooks/useProducts";

const WishlistPage = () => {
  const { user } = useAuth();
  const {
    getWishlist,
    addToWishlist,
    getRecommendedProducts,
    isLoading,
    clearWishlist,
    moveToCart,
  } = useWishlist();
  const { GetProductById, GetAverageRating } = useProducts();

  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  console.log("wishlistProducts", wishlistProducts);
  console.log("recommended", recommended);

  useEffect(() => {
    const fetchWishlistData = async (userId: string) => {
      const { data, err } = await getWishlist(userId);
      if (err || !data) {
        setWishlistProducts([]);
        return;
      }

      const detailedProducts = await Promise.all(
        data.map(async (item: any) => {
          const productId = item.product_id || item.id;

          const { data: productDetails, err: productErr } =
            await GetProductById(productId);
          if (productErr || !productDetails) return null;

          const { data: ratingData } = await GetAverageRating(productId);

          return {
            ...productDetails,
            rating: ratingData?.average ?? null,
            ratingCount: ratingData?.count ?? 0,
          };
        })
      );

      setWishlistProducts(detailedProducts.filter(Boolean));
    };

    const fetchRecommendations = async () => {
      const { data, err } = await getRecommendedProducts();
      if (err || !data) {
        setRecommended([]);
        return;
      }

      const detailedRecommended = await Promise.all(
        data.map(async (item: any) => {
          const productId = item.product_id || item.id;

          const { data: productDetails } = await GetProductById(productId);
          const { data: ratingData } = await GetAverageRating(productId);

          return {
            ...productDetails,
            rating: ratingData?.average ?? null,
            ratingCount: ratingData?.count ?? 0,
          };
        })
      );

      setRecommended(detailedRecommended.filter(Boolean));
    };

    if (user?.id) {
      fetchWishlistData(user.id);
    } else {
      // For guest users, you can optionally load from localStorage:
      const guestWishlist = localStorage.getItem("guest_wishlist");
      const items = guestWishlist ? JSON.parse(guestWishlist) : [];

      Promise.all(
        items.map(async (item: any) => {
          const productId = item.product_id || item.id;

          const { data: productDetails, err } = await GetProductById(productId);
          const { data: ratingData } = await GetAverageRating(productId);

          if (err || !productDetails) return null;

          return {
            ...productDetails,
            rating: ratingData?.average ?? null,
            ratingCount: ratingData?.count ?? 0,
          };
        })
      ).then((results) => {
        setWishlistProducts(results.filter(Boolean));
      });
    }

    fetchRecommendations();
  }, [user]);

  const handleAddToWishlist = async (productId: string) => {
    const item = { product_id: productId, user_id: user?.id };
    await addToWishlist(item);
  };

  const handleClearWishlist = async () => {
    if (!user?.id) {
      localStorage.removeItem("guest_wishlist");
    } else {
      await clearWishlist(user.id);
    }
    setWishlistProducts([]);
  };

  const handleMoveToCart = async (productId: string) => {
    if (isLoading) return;
    const { err } = await moveToCart(productId, user?.id);
    if (!err) {
      setWishlistProducts((prev) =>
        prev.filter(
          (product) => (product.product_id || product.id) !== productId
        )
      );
    }
  };

  const handleMoveAllToCart = async () => {
    if (isLoading) return;
    for (const product of wishlistProducts) {
      const productId = product.product_id || product.id;
      await moveToCart(productId, user?.id);
    }
    setWishlistProducts([]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="text-sm text-gray-500 mb-6">
        Home / User / <span className="text-black font-semibold">Wishlist</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-[#1A2238]">
          Wishlist {!isLoading && <span>({wishlistProducts.length})</span>}
        </h2>
        <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={handleMoveAllToCart}
            disabled={isLoading || wishlistProducts.length === 0}
            className="border px-4 py-2 font-bold rounded text-[#333333] border-[#A3A3A3] hover:text-white hover:border-[#007BFF] hover:bg-[#007BFF] transition w-full sm:w-[200px]"
          >
            {isLoading ? "Moving..." : "Move All To Bag"}
          </button>
          <button
            onClick={handleClearWishlist}
            disabled={isLoading}
            className="border px-4 py-2 font-bold rounded text-red-600 border-red-400 hover:text-white hover:bg-red-500 transition w-full sm:w-[200px]"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {isLoading ? (
          <p>Loading wishlist...</p>
        ) : wishlistProducts.length === 0 ? (
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
          wishlistProducts.map((product: any) => {
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
                  disabled={isLoading}
                  className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Move To Cart
                </button>
              </div>
            );
          })
        )}
      </div>

      {!isLoading && recommended.length > 0 && (
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
