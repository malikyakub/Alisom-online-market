import React from "react";

type HeadingVariant = "arrows" | "button" | "none";

interface HeadingProps {
  title: string;
  subtitle?: string;
  variant?: HeadingVariant;
  onNext?: () => void;
  onPrev?: () => void;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  variant = "none",
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex items-end justify-between py-4">
      <div className="flex flex-row gap-2 items-end">
        <span className="w-8 h-16 bg-[#17C3B2] rounded"></span>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[#17C3B2] font-semibold">{title}</p>
          {subtitle && (
            <h1 className="text-2xl font-bold text-[#1A2238] capitalize">
              {subtitle}
            </h1>
          )}
        </div>
      </div>

      {variant === "arrows" && (
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className={`w-10 h-10 flex items-center justify-center rounded-full 
              ${
                onPrev
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-gray-200 opacity-50"
              }`}
          >
            <span className="text-lg">←</span>
          </button>
          <button
            onClick={onNext}
            disabled={!onNext}
            className={`w-10 h-10 flex items-center justify-center rounded-full 
              ${
                onNext
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-gray-200 opacity-50"
              }`}
          >
            <span className="text-lg">→</span>
          </button>
        </div>
      )}

      {variant === "button" && (
        <a href="/user/products" className="bg-[#007BFF] text-white text-sm px-5 py-2 rounded hover:bg-blue-700">
          View All
        </a>
      )}
    </div>
  );
};

export default Heading;
