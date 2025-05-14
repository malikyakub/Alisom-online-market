import React from "react";

const ProductsHero = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-4 h-[400px] md:h-[200px]">
      <div className="mx-auto h-full flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Text Content */}
        <div className="flex flex-col justify-center space-y-1 md:space-y-2 text-center md:text-left">
          <h1 className="text-2xl md:text-xl font-bold leading-tight">
            Discover Our Premium Products
          </h1>
          <p className="text-lg md:text-sm text-gray-300 leading-snug md:leading-normal">
            High-quality items designed to elevate your lifestyle.
          </p>
          <div>
            <button className="bg-white text-black text-xs md:text-sm font-semibold px-3 py-2 rounded mt-2 hover:bg-gray-200 transition">
              Browse Products
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="h-3/4 md:h-full flex justify-center items-center">
          <img
            src="/assets/images/airpods.png"
            alt="Product Showcase"
            className="h-full max-h-[180px] md:max-h-[230px] w-auto rounded-xl shadow-md object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;
