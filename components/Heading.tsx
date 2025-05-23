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
    <div className="flex justify-between sm:flex-row sm:items-end sm:justify-between py-2 gap-4 sm:gap-0">
      <div className="flex flex-row gap-2 items-end">
        <span className="w-4 h-12 sm:w-8 sm:h-16 bg-[#17C3B2] rounded-xs"></span>
        <div className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm text-[#17C3B2] font-semibold">
            {title}
          </p>
          {subtitle && (
            <h1 className="text-lg sm:text-2xl font-bold text-[#1A2238] dark:text-[#007BFF] capitalize">
              {subtitle}
            </h1>
          )}
        </div>
      </div>

      {variant === "arrows" && (
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
              ${
                onPrev
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-gray-200 opacity-50"
              }`}
          >
            <span className="text-base sm:text-lg">←</span>
          </button>
          <button
            onClick={onNext}
            disabled={!onNext}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full 
              ${
                onNext
                  ? "bg-gray-100 hover:bg-gray-200"
                  : "bg-gray-200 opacity-50"
              }`}
          >
            <span className="text-base sm:text-lg">→</span>
          </button>
        </div>
      )}

      {variant === "button" && (
        <a
          href="/user/products"
          className="bg-[#007BFF] text-white text-xs sm:text-sm px-4 py-1.5 sm:px-5 sm:py-2 rounded hover:bg-blue-700 self-start sm:self-auto"
        >
          View All
        </a>
      )}
    </div>
  );
};

export default Heading;
