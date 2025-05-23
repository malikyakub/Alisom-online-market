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
      className={`bg-gradient-to-r ${gradient} text-white px-4 py-6 min-h-[200px]`}
    >
      <div className="mx-auto h-full flex flex-col-reverse sm:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col justify-center space-y-2 text-center sm:text-left mt-4 sm:mt-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-snug md:leading-normal">
            {subtitle}
          </p>
        </div>

        <div className="w-full sm:w-auto flex justify-center items-center">
          <img
            src={imageSrc}
            alt="Hero"
            className="h-32 sm:h-40 md:h-48 lg:h-56 max-h-[230px] w-auto rounded object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductsAndOrdersHero;
