import React, { useState } from "react";
import ProductsHero from "components/ProductsHero";
import FeaturedProductCard from "components/FeaturedProductCard";
import ProductFilter from "components/ProductFilter";

const dummyProducts = [
  {
    image:
      "https://i.pinimg.com/736x/85/26/c6/8526c60791e3ff70d937b35562fc3fc3.jpg",
    title: "Smart Table Clock",
    price: 79.99,
    rating: 4,
    category: "Wearable",
    brand: "Xiaomi",
    isFreeShipping: true,
    isOnDiscount: true,
    isNewArrival: false,
    color: "Blue",
  },
  {
    image:
      "https://i.pinimg.com/736x/b2/d6/d5/b2d6d5389618f8087147c49bc5a56b68.jpg",
    title: "Lenovo USB-C Charger",
    price: 59.99,
    rating: 5,
    category: "PC",
    brand: "Lenovo",
    isFreeShipping: false,
    isOnDiscount: false,
    isNewArrival: true,
    color: "Black",
  },
  {
    image:
      "https://i.pinimg.com/736x/23/d0/b9/23d0b9da6bbc74b5c3554bf5683c992e.jpg",
    title: "Lenovo Laptop",
    price: 120,
    rating: 3,
    category: "PC",
    brand: "Lenovo",
    isFreeShipping: true,
    isOnDiscount: true,
    isNewArrival: true,
    color: "White",
  },
];

const Products = () => {
  const [filters, setFilters] = useState<{
    priceRange: number[];
    rating: number[];
    categories: string[];
    brands: string[];
    colors: string[];
    discount: number[];
  } | null>(null);

  const handleApplyFilters = (appliedFilters: any) => {
    setFilters(appliedFilters);
  };

  const filteredProducts = filters
    ? dummyProducts.filter((product) => {
        const withinPrice =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];

        const withinRating =
          product.rating >= filters.rating[0] &&
          product.rating <= filters.rating[1];

        const matchesCategory =
          filters.categories.length === 0 ||
          filters.categories.includes(product.category);

        const matchesBrand =
          filters.brands.length === 0 || filters.brands.includes(product.brand);

        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.some(
            (color) =>
              product.color?.toLowerCase() === color.toLowerCase() ||
              product.title.toLowerCase().includes(color.toLowerCase())
          );

        const matchesDiscount =
          filters.discount.length === 0 ||
          (filters.discount.includes(10) && product.isOnDiscount);

        return (
          withinPrice &&
          withinRating &&
          matchesCategory &&
          matchesBrand &&
          matchesColor &&
          matchesDiscount
        );
      })
    : dummyProducts;

  return (
    <div>
      <ProductsHero />

      <div className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <ProductFilter onApplyFilters={handleApplyFilters} />
        </div>

        <div className="p-4 flex-1 bg-red-50 rounded-lg shadow flex flex-wrap gap-4">
          {filteredProducts.length ? (
            filteredProducts.map((product, idx) => (
              <FeaturedProductCard key={idx} {...product} />
            ))
          ) : (
            <p>No products match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
