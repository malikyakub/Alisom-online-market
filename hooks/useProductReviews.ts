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

  async function getUserReviews(userId: string): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(
          `
        review_id,
        comment,
        rating_stars,
        created_at,
        product:product_id (
          product_id,
          name,
          brand:brand_id ( name ),
          category:category_id ( name ),
          images:product_images ( image_url )
        )
      `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = data?.map((review) => {
        const product = Array.isArray(review.product)
          ? review.product[0]
          : review.product;
        return {
          ...review,
          product: {
            ...product,
            image: product?.images?.[0]?.image_url ?? null,
          },
        };
      });

      return { data: formatted ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function UpdateReview({
    review_id,
    comment,
    rating_stars,
  }: {
    review_id: string;
    comment: string;
    rating_stars: number;
  }): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .update({
          comment,
          rating_stars,
        })
        .eq("review_id", review_id)
        .select();

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
    getUserReviews,
    UpdateReview,
    isLoading,
  };
};

export default useProductReviews;
