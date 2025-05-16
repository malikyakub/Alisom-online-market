import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { Slider } from "@mui/material";

const categories = ["Phone", "PC", "Wearable", "Tablet", "Accessories"];
const brands = ["Apple", "Samsung", "Dell", "HP", "Sony"];
const colorsList = ["Black", "White", "Blue", "Red", "Green"];
const discounts = [10, 20, 30, 40, 50];

type FilterValues = {
  priceRange: number[];
  rating: number[];
  categories: string[];
  brands: string[];
  colors: string[];
  discount: number[];
};

type ProductFilterProps = {
  onApplyFilters: (filters: FilterValues) => void;
};

export default function ProductFilter({ onApplyFilters }: ProductFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([100, 1000]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 5]);
  const [category, setCategory] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number | null>(null);

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
      priceRange,
      rating: ratingRange,
      categories: category ? [category] : [],
      brands: brand ? [brand] : [],
      colors: color ? [color] : [],
      discount: discount ? [discount] : [],
    });
    setMobileOpen(false);
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setRatingRange([0, 5]);
    setCategory(null);
    setBrand(null);
    setColor(null);
    setDiscount(null);
  };

  const renderRadioGroup = <T extends string | number>(
    title: string,
    options: T[],
    current: T | null,
    setCurrent: React.Dispatch<React.SetStateAction<T | null>>,
    suffix = ""
  ) => (
    <div>
      <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = current === opt;
          return (
            <div
              key={opt}
              className={`px-3 py-1 text-sm rounded cursor-pointer border transition ${
                isSelected
                  ? "text-[#007BFF] border-[#007BFF] bg-[#007BFF22]"
                  : "text-[#666666] border-[#A3A3A3] hover:bg-gray-100"
              }`}
              onClick={() => toggleRadio(opt, current, setCurrent)}
            >
              {opt}
              {suffix}
            </div>
          );
        })}
      </div>
    </div>
  );

  const FilterSection = () => (
    <div className="space-y-6">
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

      <div>
        <h3 className="font-semibold text-sm text-gray-700 mb-2">
          Rating Range
        </h3>
        <Slider
          value={ratingRange}
          onChange={(_, newValue) => setRatingRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
        />
      </div>

      {renderRadioGroup("Category", categories, category, setCategory)}
      {renderRadioGroup("Brand", brands, brand, setBrand)}
      {renderRadioGroup("Color", colorsList, color, setColor)}
      {renderRadioGroup("Discount", discounts, discount, setDiscount, "%")}
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
            <FilterSection />
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

      <div className="hidden md:flex w-full max-w-xs p-4 border rounded-lg bg-white space-y-4 flex-col">
        <FilterSection />
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
