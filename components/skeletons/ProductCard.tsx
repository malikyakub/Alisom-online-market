import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="relative bg-[#1F1F1F] w-[230px] h-[360px] rounded shadow overflow-hidden flex flex-col animate-pulse">
      <div className="absolute top-4 left-0 h-6 w-16 bg-gray-700/60 rounded-r" />

      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <div className="w-8 h-8 bg-gray-700/60 rounded-full" />
        <div className="w-8 h-8 bg-gray-700/60 rounded-full" />
      </div>

      <div className="w-full h-[240px] bg-gray-800/80" />

      <div className="flex flex-col p-2 gap-2">
        <div className="h-5 bg-gray-600/70 rounded w-3/4" />
        <div className="flex flex-row gap-2">
          <div className="h-4 bg-gray-600/70 rounded w-1/4" />
          <div className="h-4 bg-gray-600/40 rounded w-1/4" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-700/50 rounded" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 w-full py-2 bg-gray-800/80 h-10" />
    </div>
  );
};

export default ProductCardSkeleton;
