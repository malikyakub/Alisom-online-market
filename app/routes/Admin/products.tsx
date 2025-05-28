import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductsAndOrdersHero from "components/ProductsAndOrdersHero";
import ProductCard from "components/ProductCard";
import ProductFilter from "components/ProductFilter";
import ProductCardSkeleton from "components/skeletons/ProductCardSkeleton";
import { useFilterProducts } from "hooks/useFilterProducts";
import type { FilterValues } from "components/ProductFilter";

type Product = {
  product_id: string;
  image: string | null;
  name: string;
  price: number;
  old_price?: number;
  average_rating?: number;
  featured?: boolean;
  category?: { name: string };
  brand?: { name: string };
};

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

  const { FilterProducts } = useFilterProducts();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const productToSearch = localStorage.getItem("productToSearch") || "";
      if (productToSearch.length > 3) {
        setFilters((prev) => ({ ...prev, query: productToSearch }));
        localStorage.removeItem("productToSearch");
      }
    }
  }, []);

  const handleApplyFilters = (appliedFilters: FilterValues) => {
    setFilters((prev) => ({ ...prev, ...appliedFilters }));
  };

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Product[], Error>({
    queryKey: ["filteredProducts", filters],
    queryFn: async () => {
      const { data, err } = await FilterProducts({
        query: filters.query,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: ["most_sold", "top_rated", "price_asc", "price_desc"].includes(
          filters.sortBy ?? ""
        )
          ? (filters.sortBy as
              | "most_sold"
              | "top_rated"
              | "price_asc"
              | "price_desc")
          : undefined,
      });

      if (err || !data) throw new Error("Failed to fetch products");

      return data.filter((product) => {
        const matchesCategory =
          filters.categories.length === 0 ||
          (product.category?.name &&
            filters.categories.includes(product.category.name));
        const matchesBrand =
          filters.brands.length === 0 ||
          (product.brand?.name && filters.brands.includes(product.brand.name));
        const withinRating =
          typeof product.average_rating === "number" &&
          product.average_rating >= filters.rating[0] &&
          product.average_rating <= filters.rating[1];

        return matchesCategory && matchesBrand && withinRating;
      });
    },
  });

  return (
    <div className="mb-4 dark:text-white">
      <ProductsAndOrdersHero
        title="Discover Our Premium Products"
        subtitle="High-quality items designed to elevate your lifestyle."
        imageSrc="/assets/images/airpods.png"
      />

      <div className="mt-5 flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-1/4 sticky top-[80px] self-start bg-white dark:bg-gray-900 z-20">
          <ProductFilter
            filters={filters}
            onFiltersChange={handleApplyFilters}
          />
        </aside>

        <main className="p-4 flex-1 bg-red-50 dark:bg-gray-800 rounded-lg shadow flex flex-wrap gap-4 min-h-[50vh]">
          {isLoading ? (
            Array(4)
              .fill(null)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          ) : isError ? (
            <div className="w-full py-4 text-center text-red-500">
              Failed to load products.{" "}
              <button
                onClick={() => refetch()}
                className="underline text-blue-500"
              >
                Retry
              </button>
            </div>
          ) : products.length ? (
            products.map((product) => (
              <ProductCard
                key={product.product_id}
                image={product.image ?? ""}
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
            <div className="w-full py-4 text-center text-yellow-500">
              No product matched your filter.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
