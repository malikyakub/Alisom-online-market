import React from "react";

interface ProductsAndOrdersHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  gradient?: string;
}

const ProductsAndOrdersHero: React.FC<ProductsAndOrdersHeroProps> = ({
  title,
  subtitle,
  imageSrc,
  gradient = "from-gray-900 via-gray-800 to-gray-900",
}) => {
  return (
    <section
      className={`bg-gradient-to-r ${gradient} text-white px-4 py-6 h-[200px]`}
    >
      <div className="mx-auto h-full flex flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col justify-center space-y-2 text-left">
          <h1 className="text-xl sm:text-lg md:text-xl lg:text-2xl font-bold leading-snug">
            {title}
          </h1>
          <p className="text-sm sm:text-xs md:text-sm text-gray-300 leading-snug md:leading-normal">
            {subtitle}
          </p>
        </div>

        <div className="h-[60%] sm:h-[70%] md:h-full flex justify-center items-center">
          <img
            src={imageSrc}
            alt="Hero"
            className="h-full max-h-[140px] sm:max-h-[160px] md:max-h-[200px] lg:max-h-[230px] w-auto rounded object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductsAndOrdersHero;
