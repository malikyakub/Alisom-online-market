import React, { useEffect, useState } from "react";
import ProductsAndOrdersHero from "components/ProductsAndOrdersHero";
import ProductCard from "components/ProductCard";
import ProductFilter from "components/ProductFilter";
import { useFilterProducts } from "hooks/useFilterProducts";
import type { FilterValues } from "components/ProductFilter";

const Products = () => {
  const [filters, setFilters] = useState<FilterValues>({
    query: "",
    priceRange: [0, 5000],
    rating: [0, 5],
    categories: [],
    brands: [],
    colors: [],
    discount: [],
    sortBy: undefined,
  });

  const { FilterProducts, isLoading } = useFilterProducts();
  const [products, setProducts] = useState<any[]>([]);

  const handleApplyFilters = (appliedFilters: FilterValues) => {
    setFilters((prev) => ({ ...prev, ...appliedFilters }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, err } = await FilterProducts({
        query: filters.query,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: ["most_sold", "top_rated", "price_asc", "price_desc"].includes(
          filters.sortBy as string
        )
          ? (filters.sortBy as
              | "most_sold"
              | "top_rated"
              | "price_asc"
              | "price_desc")
          : undefined,
      });
      if (!err && data) {
        const filtered = data.filter((product) => {
          const matchesCategory =
            filters.categories.length === 0 ||
            filters.categories.includes(product.category?.name);
          const matchesBrand =
            filters.brands.length === 0 ||
            filters.brands.includes(product.brand?.name);
          const withinRating =
            typeof product.average_rating === "number" &&
            product.average_rating >= filters.rating[0] &&
            product.average_rating <= filters.rating[1];
          return matchesCategory && matchesBrand && withinRating;
        });
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="mb-4 dark:text-white">
      <ProductsAndOrdersHero
        title="Discover Our Premium Products"
        subtitle="High-quality items designed to elevate your lifestyle."
        imageSrc="/assets/images/airpods.png"
      />
      <div className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <ProductFilter
            filters={filters}
            onFiltersChange={handleApplyFilters}
          />
        </div>
        <div className="p-4 flex-1 bg-red-50 dark:bg-gray-800 rounded-lg shadow flex flex-wrap gap-4 min-h-[50vh]">
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : products.length ? (
            products.map((product, idx) => (
              <ProductCard
                key={product.product_id || idx}
                image={product.image}
                name={product.name}
                price={product.price}
                oldPrice={product.old_price}
                rating={product.average_rating || 0}
                featured={product.featured || false}
                badge=""
                badgeColor=""
                productId={product.product_id}
              />
            ))
          ) : (
            <div className="w-full py-8 flex items-center justify-center">
              <p className="text-yellow-500 dark:text-yellow-400 text-center">
                No product mathched your filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
