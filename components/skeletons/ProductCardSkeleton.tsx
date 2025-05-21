const ProductCardSkeleton = () => {
  return (
    <div className="relative bg-white w-[230px] h-[360px] rounded shadow overflow-hidden animate-pulse flex flex-col">
      <div className="absolute top-4 left-0 w-16 h-6 bg-gray-300 rounded-r" />
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
      <div className="w-full h-[240px] bg-gray-300" />
      <div className="flex flex-col p-2 gap-2">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-10 bg-gray-300" />
    </div>
  );
};

export default ProductCardSkeleton;
