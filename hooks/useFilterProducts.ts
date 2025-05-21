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

      if (filters.minPrice !== undefined)
        queryBuilder = queryBuilder.gte("price", filters.minPrice);
      if (filters.maxPrice !== undefined)
        queryBuilder = queryBuilder.lte("price", filters.maxPrice);

      if (filters.query)
        queryBuilder = queryBuilder.or(
          `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
        );

      const { data, error } = await queryBuilder;

      if (error) throw error;

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

      if (filters.sortBy === "top_rated") {
        formatted.sort((a, b) => b.average_rating - a.average_rating);
      } else if (filters.sortBy === "most_sold") {
        formatted.sort((a, b) => b.sold_count - a.sold_count);
      } else if (filters.sortBy === "price_asc") {
        formatted.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === "price_desc") {
        formatted.sort((a, b) => b.price - a.price);
      }

      return { data: formatted, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return { FilterProducts, isLoading };
}
