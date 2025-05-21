import React, { useEffect, useState } from "react";
import ProductsAndOrdersHero from "components/ProductsAndOrdersHero";
import ProductCard from "components/ProductCard";
import ProductFilter from "components/ProductFilter";
import useProducts from "hooks/useProducts";

const Products = () => {
  const [filters, setFilters] = useState<{
    priceRange: number[];
    rating: number[];
    categories: string[];
    brands: string[];
    colors: string[];
    discount: number[];
  } | null>(null);

  const { AllProducts, isLoading } = useProducts();
  const [products, setProducts] = useState<any[]>([]);

  const handleApplyFilters = (appliedFilters: any) => {
    const defaultedFilters = {
      priceRange: appliedFilters.priceRange || [0, 5000],
      rating: appliedFilters.rating || [0, 5],
      categories: appliedFilters.categories || [],
      brands: appliedFilters.brands || [],
      colors: appliedFilters.colors || [],
      discount: appliedFilters.discount || [],
    };
    setFilters(defaultedFilters);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, err } = await AllProducts();
      if (!err) {
        setProducts(data ?? []);
      } else {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filters
    ? products.filter((product) => {
        const withinPrice =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];

        const matchesCategory =
          filters.categories.length === 0 ||
          filters.categories.includes(product.category?.name);

        const matchesBrand =
          filters.brands.length === 0 ||
          filters.brands.includes(product.brand?.name);

        return withinPrice && matchesCategory && matchesBrand;
      })
    : products;

  return (
    <div>
      <ProductsAndOrdersHero
        title="Discover Our Premium Products"
        subtitle="High-quality items designed to elevate your lifestyle."
        imageSrc="/assets/images/airpods.png"
      />
      <div className="my-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 sticky top-0">
          <ProductFilter onApplyFilters={handleApplyFilters} />
        </div>
        <div className="p-4 flex-1 bg-[#17C3B2]/10 rounded shadow flex flex-wrap gap-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredProducts.length ? (
            filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id || idx}
                image={product.image}
                name={product.name}
                price={product.price}
                oldPrice={product.old_price}
                rating={product.rating}
                featured={product.featured || false}
                productId={product.product_id}
              />
            ))
          ) : (
            <div className="w-full h-screen flex py-4">
              <p className="text-[#FFC107]">That's why you're single.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
