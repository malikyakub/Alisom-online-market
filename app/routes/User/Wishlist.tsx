import React from "react";
import WishlistProductCard from "components/WishlistProductCard";

const products = [
  {
    id: 1,
    price: 960,
    oldPrice: 1160,
    image:
      "https://i.pinimg.com/736x/8b/73/1c/8b731ce4b06f27eca1b3553af64e44fe.jpg",
    discount: "-35%",
  },
  {
    id: 2,
    price: 1960,
    image:
      "https://i.pinimg.com/736x/05/56/49/0556496b704e1416d2ebd1578040deb3.jpg",
  },
  {
    id: 3,
    price: 550,
    image:
      "https://i.pinimg.com/736x/b7/74/89/b77489515b0dd131412614e026c91ef2.jpg",
  },
  {
    id: 4,
    price: 750,
    image:
      "https://i.pinimg.com/736x/86/2f/09/862f098c5a6b19a6af0296cf7fc191a5.jpg",
  },
];

const recommendations = [
  {
    id: 5,
    price: 960,
    oldPrice: 1160,
    discount: "-35%",
    rating: 5,
    image:
      "https://i.pinimg.com/736x/c8/9b/a0/c89ba048b876a43d1d46d1de1e7a94e0.jpg",
  },
  {
    id: 6,
    price: 1160,
    rating: 5,
    image:
      "https://i.pinimg.com/736x/29/ff/c1/29ffc13f19c249799aa64643c2412a90.jpg",
  },
  {
    id: 7,
    price: 560,
    rating: 5,
    image:
      "https://i.pinimg.com/736x/d8/0e/a5/d80ea585084f5dec0878238b5cd961b5.jpg",
    tag: "NEW",
  },
  {
    id: 8,
    price: 200,
    rating: 5,
    image:
      "https://i.pinimg.com/736x/57/19/ec/5719eca957ca77660b81bc34a47a4476.jpg",
  },
];

const moveToBag = () => {
  window.location.href = "/user/cart";
};

const WishlistPage = () => {
  return (
    <div className="">
      <div className="text-sm text-gray-500 mb-6">
        Home / User / <span className="text-black font-semibold">Wishlist</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-[#1A2238]">
          Wishlist ({products.length})
        </h2>
        <button
          onClick={() => moveToBag()}
          className="border px-4 py-2 font-bold rounded text-[#333333] border-[#A3A3A3] hover:text-white hover:border-[#007BFF] hover:bg-[#007BFF] transition w-[200px]"
        >
          Move All To Bag
        </button>
      </div>

      <div className="flex flex-wrap justify-start gap-4 mb-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-full sm:w-[48%] md:w-[31%] lg:w-[23%]"
          >
            <WishlistProductCard product={product} isWishlist={true} />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-4 bg-[#17C3B2] inline-block rounded-sm"></span>
          <span className="text-[#1A2238]">Just For You</span>
        </h2>
        <button className="border px-4 py-2 font-bold rounded text-[#333333] border-[#A3A3A3] hover:text-white hover:border-[#007BFF] hover:bg-[#007BFF] transition w-[200px]">
          See All
        </button>
      </div>

      <div className="flex flex-wrap justify-start gap-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-full sm:w-[48%] md:w-[31%] lg:w-[23%]"
          >
            <WishlistProductCard product={product} isWishlist={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
