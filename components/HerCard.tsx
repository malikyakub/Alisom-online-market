import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Product {
  logo: string;
  title: string;
  offer: string;
  link?: string;
  image: string;
}

const HerCard: React.FC<{ products: Product[] }> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = products[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 60000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full bg-black text-white p-8 py-10 flex flex-col md:flex-row items-center justify-between transition-all duration-500 ease-in-out md:h-[344px] overflow-hidden">
      {/* Content Section - Fixed Width */}
      <div className="w-[400px] flex-shrink-0 space-y-4">
        <div className="flex items-center space-x-2">
          <img
            src={currentProduct.logo}
            alt={`${currentProduct.title} Logo`}
            className="w-6 h-6"
          />
          <span className="text-sm font-medium">{currentProduct.title}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight transition-all duration-500 ease-in-out">
          {currentProduct.offer}
        </h1>
        <a
          href={currentProduct.link || "#"}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          Shop Now <ArrowRight className="ml-2 w-5 h-5" />
        </a>

        <div className="flex space-x-2 pt-6">
          {products.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                currentIndex === index ? "bg-red-500" : "bg-gray-600"
              }`}
            ></span>
          ))}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={prevSlide}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Section - Flexible */}
      <div className="flex-1 flex items-center justify-center mt-8 md:mt-0 transition-all duration-500 ease-in-out">
        <img
          src={currentProduct.image}
          alt={currentProduct.title}
          className="object-contain w-full h-full max-h-[300px]"
        />
      </div>
    </div>
  );
};

export default HerCard;
