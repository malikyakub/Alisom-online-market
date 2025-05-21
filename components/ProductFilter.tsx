import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { Slider } from "@mui/material";
import supabase from "utils/supabase";
import usecategory from "hooks/useCategories";
import useBrands from "hooks/useBrands";

const sortOptions = [
  { label: "Most Sold", value: "most_sold" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

type Category = {
  category_id: string;
  name: string;
};

type Brand = {
  brand_id: string;
  name: string;
  logo_url: string | null;
};

type FilterValues = {
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
  onApplyFilters: (filters: FilterValues) => void;
};

export default function ProductFilter({ onApplyFilters }: ProductFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([100, 1000]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [rating, setRating] = useState<number[]>([0, 5]);
  const [colors, setColors] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number[]>([]);

  const { Allcategory } = usecategory();
  const { getAllBrands } = useBrands();

  useEffect(() => {
    const getCategories = async () => {
      setIsLoadingCategories(true);
      const { data, err } = await Allcategory();
      if (!err) setCategories(data ?? []);
      setIsLoadingCategories(false);
    };

    const getBrands = async () => {
      setIsLoadingBrands(true);
      const { data, err } = await getAllBrands();
      if (!err) setBrands(data ?? []);
      setIsLoadingBrands(false);
    };

    getCategories();
    getBrands();
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const toggleRadio = <T,>(
    value: T,
    current: T | null,
    set: React.Dispatch<React.SetStateAction<T | null>>
  ) => {
    set(current === value ? null : value);
  };

  const applyFilters = () => {
    onApplyFilters({
      query: query || undefined,
      priceRange,
      categories: category ? [category] : [],
      brands: selectedBrand ? [selectedBrand] : [],
      sortBy: sortBy || undefined,
      rating,
      colors,
      discount,
    });
    setMobileOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([100, 1000]);
    setCategory(null);
    setSelectedBrand(null);
    setQuery("");
    setSortBy(null);
  };

  const renderRadioGroup = <T extends string | number>(
    title: string,
    options: T[],
    current: T | null,
    setCurrent: React.Dispatch<React.SetStateAction<T | null>>
  ) => (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = current === opt;
          return (
            <div
              key={typeof opt === "string" ? opt : String(opt)}
              className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                isSelected
                  ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22]"
                  : "text-[#666666] border-[#A3A3A3] hover:bg-gray-100"
              }`}
              onClick={() => toggleRadio(opt, current, setCurrent)}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSkeleton = (count: number) => (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-6 bg-gray-300 rounded animate-pulse w-24"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="md:hidden">
        <button
          onClick={toggleMobile}
          className="flex w-full justify-end items-center gap-2 px-4 py-2 text-sm rounded bg-[#F4F4F4] text-[#333333]"
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
            className="md:hidden bg-white p-4 rounded-md shadow space-y-4 mb-4"
          >
            <div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                Price Range
              </h3>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={5000}
              />
            </div>
            {isLoadingCategories
              ? renderSkeleton(5)
              : renderRadioGroup(
                  "Category",
                  categories.map((c) => c.name),
                  category,
                  setCategory
                )}
            {isLoadingBrands
              ? renderSkeleton(5)
              : renderRadioGroup(
                  "Brand",
                  brands.map((b) => b.name),
                  selectedBrand,
                  setSelectedBrand
                )}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
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
                          ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22]"
                          : "text-[#666666] border-[#A3A3A3] hover:bg-gray-100"
                      }`}
                      onClick={() => toggleRadio(opt.value, sortBy, setSortBy)}
                    >
                      {opt.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 text-sm py-2 rounded transition bg-gray-300 text-gray-700"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 text-sm py-2 rounded transition bg-[#007BFF] text-white"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex w-full max-w-xs p-4 border rounded bg-white space-y-4 flex-col">
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 border rounded text-sm"
          />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">
            Price Range
          </h3>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
          />
        </div>
        {isLoadingCategories
          ? renderSkeleton(5)
          : renderRadioGroup(
              "Category",
              categories.map((c) => c.name),
              category,
              setCategory
            )}
        {isLoadingBrands
          ? renderSkeleton(5)
          : renderRadioGroup(
              "Brand",
              brands.map((b) => b.name),
              selectedBrand,
              setSelectedBrand
            )}
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((opt) => {
              const isSelected = sortBy === opt.value;
              return (
                <div
                  key={opt.value}
                  className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                    isSelected
                      ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22]"
                      : "text-[#666666] border-[#A3A3A3] hover:bg-gray-100"
                  }`}
                  onClick={() => toggleRadio(opt.value, sortBy, setSortBy)}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="flex-1 text-sm py-2 rounded transition bg-gray-300 text-gray-700"
          >
            Clear
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 text-sm py-2 rounded transition bg-[#007BFF] text-white"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
