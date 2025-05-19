import { useState } from "react";
import supabase from "utils/supabase";

interface Review {
  review_id: string;
  user_id: string;
  product_id: string;
  comment: string | null;
  rating_stars: number | null;
  created_at: string;
  user?: {
    full_name?: string;
    email?: string;
  };
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useProductReviews = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function GetProductReviews(
    productId: string
  ): Promise<ReturnType<Review[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*, user:user_id(fullname, email)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function AddReview({
    user_id,
    product_id,
    comment,
    rating_stars,
  }: {
    user_id: string;
    product_id: string;
    comment?: string;
    rating_stars: number;
  }): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("product_reviews").insert([
        {
          user_id,
          product_id,
          comment,
          rating_stars,
        },
      ]);

      if (error) throw error;
      return { data, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    GetProductReviews,
    AddReview,
    isLoading,
  };
};

export default useProductReviews;
