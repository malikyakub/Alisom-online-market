import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { Slider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import usecategory from "hooks/useCategories";
import useBrands from "hooks/useBrands";

type Category = {
  category_id: string;
  name: string;
};

type Brand = {
  brand_id: string;
  name: string;
  logo_url: string | null;
};

export type FilterValues = {
  query?: string;
  priceRange: number[];
  categories: string[];
  brands: string[];
  sortBy?: string;
  rating: number[];
  colors: string[];
  discount: number[];
};

type ProductFilterProps = {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
};

const sortOptions = [
  { label: "Most Sold", value: "most_sold" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ProductFilter({
  filters,
  onFiltersChange,
}: ProductFilterProps) {
  const {
    query = "",
    priceRange = [0, 5000],
    categories = [],
    brands = [],
    sortBy,
    rating = [0, 5],
    colors = [],
    discount = [],
  } = filters;

  const { Allcategory } = usecategory();
  const { getAllBrands } = useBrands();

  const {
    data: categoriesData = [],
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    refetch: refetchCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, err } = await Allcategory();
      if (err) throw err;
      return data ?? [];
    },
  });

  const {
    data: brandsData = [],
    isLoading: isLoadingBrands,
    isError: isErrorBrands,
    refetch: refetchBrands,
  } = useQuery<Brand[], Error>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, err } = await getAllBrands();
      if (err) throw err;
      return data ?? [];
    },
  });

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, query: e.target.value });
  };

  const handlePriceRangeChange = (_: any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onFiltersChange({ ...filters, priceRange: newValue });
    }
  };

  const toggleRadio = <T,>(
    value: T,
    current: T | null,
    set: (val: T | null) => void
  ) => {
    set(current === value ? null : value);
  };

  const handleCategoryChange = (categoryName: string | null) => {
    onFiltersChange({
      ...filters,
      categories: categoryName ? [categoryName] : [],
    });
  };

  const handleBrandChange = (brandName: string | null) => {
    onFiltersChange({ ...filters, brands: brandName ? [brandName] : [] });
  };

  const handleSortChange = (sortValue: string | null) => {
    onFiltersChange({ ...filters, sortBy: sortValue || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: "",
      priceRange: [0, 5000],
      categories: [],
      brands: [],
      sortBy: undefined,
      rating: [0, 5],
      colors: [],
      discount: [],
    });
  };

  const renderRadioGroup = <T extends string | number>(
    title: string,
    options: T[],
    current: T | null,
    onChange: (value: T | null) => void
  ) => (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = current === opt;
          return (
            <div
              key={typeof opt === "string" ? opt : String(opt)}
              className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                isSelected
                  ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22] dark:bg-[#007BFF33]"
                  : "text-[#666666] dark:text-gray-300 border-[#A3A3A3] dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => toggleRadio(opt, current, onChange)}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSkeleton = (count: number) => (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-16"
        ></div>
      ))}
    </div>
  );

  const categorySelected = categories.length > 0 ? categories[0] : null;
  const brandSelected = brands.length > 0 ? brands[0] : null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <div className="w-full">
      <div className="md:hidden">
        <button
          onClick={toggleMobile}
          className="flex w-full justify-end items-center gap-2 px-4 py-2 text-sm rounded bg-[#F4F4F4] dark:bg-gray-700 text-[#333333] dark:text-white"
        >
          <FiFilter /> Filters
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 p-4 rounded-md shadow space-y-4 mb-4"
          >
            <div>
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
                Price Range
              </h3>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
              />
            </div>
            {isLoadingCategories ? (
              renderSkeleton(5)
            ) : isErrorCategories ? (
              <div className="text-red-500">
                Failed to load categories.{" "}
                <button
                  onClick={() => refetchCategories()}
                  className="underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              renderRadioGroup(
                "Category",
                categoriesData.map((c) => c.name),
                categorySelected,
                handleCategoryChange
              )
            )}
            {isLoadingBrands ? (
              renderSkeleton(5)
            ) : isErrorBrands ? (
              <div className="text-red-500">
                Failed to load brands.{" "}
                <button onClick={() => refetchBrands()} className="underline">
                  Retry
                </button>
              </div>
            ) : (
              renderRadioGroup(
                "Brand",
                brandsData.map((b) => b.name),
                brandSelected,
                handleBrandChange
              )
            )}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
                Sort By
              </h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <div
                      key={opt.value}
                      className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                        isSelected
                          ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22] dark:bg-[#007BFF33]"
                          : "text-[#666666] dark:text-gray-300 border-[#A3A3A3] dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() =>
                        handleSortChange(isSelected ? null : opt.value)
                      }
                    >
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="w-full text-sm py-2 rounded transition bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex w-full max-w-xs p-4 border dark:border-white/10 rounded-lg bg-white dark:bg-gray-800 space-y-4 flex-col">
        <div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search products..."
            className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
            Price Range
          </h3>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
          />
        </div>
        {isLoadingCategories ? (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
              Category
            </h3>
            {renderSkeleton(5)}
          </div>
        ) : isErrorCategories ? (
          <div className="text-red-500">
            Failed to load categories.{" "}
            <button onClick={() => refetchCategories()} className="underline">
              Retry
            </button>
          </div>
        ) : (
          renderRadioGroup(
            "Category",
            categoriesData.map((c) => c.name),
            categorySelected,
            handleCategoryChange
          )
        )}

        {isLoadingBrands ? (
          <div>
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
              Brand
            </h3>
            {renderSkeleton(5)}
          </div>
        ) : isErrorBrands ? (
          <div className="text-red-500">
            Failed to load brands.{" "}
            <button onClick={() => refetchBrands()} className="underline">
              Retry
            </button>
          </div>
        ) : (
          renderRadioGroup(
            "Brand",
            brandsData.map((b) => b.name),
            brandSelected,
            handleBrandChange
          )
        )}

        <div>
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">
            Sort By
          </h3>
          <div className="flex flex-wrap gap-2">
            {isLoadingBrands || isLoadingCategories ? (
              <div>{renderSkeleton(5)}</div>
            ) : (
              sortOptions.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <div
                    key={opt.value}
                    className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                      isSelected
                        ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22] dark:bg-[#007BFF33]"
                        : "text-[#666666] dark:text-gray-300 border-[#A3A3A3] dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() =>
                      handleSortChange(isSelected ? null : opt.value)
                    }
                  >
                    {opt.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
        <button
          onClick={clearFilters}
          className="w-full text-sm py-2 rounded transition bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
