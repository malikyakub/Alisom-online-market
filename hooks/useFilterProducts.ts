import { useState } from "react";
import supabase from "utils/supabase";

type FilterParams = {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "most_sold" | "top_rated" | "price_asc" | "price_desc";
};

type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: { name: string };
  brand: { name: string };
  image: string | null;
  average_rating?: number;
  sold_count?: number;
};

type ReturnType = {
  data: Product[] | null;
  err: string | null;
};

export function useFilterProducts() {
  const [isLoading, setIsLoading] = useState(false);

  async function FilterProducts(filters: FilterParams): Promise<ReturnType> {
    console.log("FilterProducts called with filters:", filters);
    setIsLoading(true);
    try {
      let queryBuilder = supabase.from("products").select(
        `
          *,
          category:category_id ( name ),
          brand:brand_id ( name ),
          images:product_images ( image_url ),
          reviews:product_reviews ( rating_stars ),
          order_items:Order_items ( order_item_id )
        `
      );

      console.log("Initial queryBuilder:", queryBuilder);

      if (filters.minPrice !== undefined) {
        queryBuilder = queryBuilder.gte("price", filters.minPrice);
        console.log(`Applied minPrice filter: >= ${filters.minPrice}`);
      }
      if (filters.maxPrice !== undefined) {
        queryBuilder = queryBuilder.lte("price", filters.maxPrice);
        console.log(`Applied maxPrice filter: <= ${filters.maxPrice}`);
      }

      if (filters.query) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
        );
        console.log(`Applied query filter: ilike %${filters.query}%`);
      }

      console.log("Final queryBuilder before execution:", queryBuilder);

      const { data, error } = await queryBuilder;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }
      console.log("Raw data from supabase:", data);

      const formatted = (data as any[]).map((product) => {
        const ratings = product.reviews?.map((r: any) => r.rating_stars) ?? [];
        const average_rating =
          ratings.length > 0
            ? ratings.reduce((a: number, b: number) => a + b, 0) /
              ratings.length
            : 0;

        const sold_count = product.order_items?.length ?? 0;

        return {
          ...product,
          image: product.images?.[0]?.image_url ?? null,
          average_rating,
          sold_count,
        };
      });

      console.log("Formatted products:", formatted);

      if (filters.sortBy === "top_rated") {
        formatted.sort((a, b) => b.average_rating - a.average_rating);
        console.log("Sorted by top_rated");
      } else if (filters.sortBy === "most_sold") {
        formatted.sort((a, b) => b.sold_count - a.sold_count);
        console.log("Sorted by most_sold");
      } else if (filters.sortBy === "price_asc") {
        formatted.sort((a, b) => a.price - b.price);
        console.log("Sorted by price_asc");
      } else if (filters.sortBy === "price_desc") {
        formatted.sort((a, b) => b.price - a.price);
        console.log("Sorted by price_desc");
      }

      return { data: formatted, err: null };
    } catch (error: unknown) {
      console.error("FilterProducts caught error:", error);
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
      console.log("FilterProducts finished, isLoading set to false");
    }
  }

  return { FilterProducts, isLoading };
}
