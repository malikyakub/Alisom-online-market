import { useEffect, useState } from "react";
import supabase from "utils/supabase";
import useProducts from "./useProducts";
import useCart from "./useCart";

interface WishlistItem {
  wishlist_id?: string;
  user_id?: string;
  product_id: string;
}

interface DetailedWishlistItem extends WishlistItem {
  title?: string;
  price?: number;
  image?: string;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const LOCAL_KEY = "guest_wishlist";

const useWishlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { GetProductById } = useProducts();
  const { addToCart, removeFromCart } = useCart();

  const getLocalWishlist = (): WishlistItem[] => {
    try {
      const wishlist = localStorage.getItem(LOCAL_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      localStorage.removeItem(LOCAL_KEY);
      return [];
    }
  };

  const setLocalWishlist = (items: WishlistItem[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  };

  async function getWishlist(
    user_id?: string
  ): Promise<ReturnType<WishlistItem[] | DetailedWishlistItem[]>> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { data, error } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", user_id);
        if (error) throw new Error(error.message);
        return { data: data ?? [], err: null };
      } else {
        const localWishlist = getLocalWishlist();
        const detailedProducts = await Promise.all(
          localWishlist.map(async (item: WishlistItem) => {
            const { data: productDetails, err } = await GetProductById(
              item.product_id
            );
            if (err) return null;
            return { ...productDetails };
          })
        );
        return {
          data: detailedProducts.filter(Boolean) as DetailedWishlistItem[],
          err: null,
        };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function addToWishlist(item: WishlistItem): Promise<ReturnType> {
    setIsLoading(true);
    try {
      if (item.user_id) {
        const { data: existingItem, error: fetchError } = await supabase
          .from("wishlist")
          .select("*")
          .eq("user_id", item.user_id)
          .eq("product_id", item.product_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

        if (!existingItem) {
          const { data, error } = await supabase
            .from("wishlist")
            .insert(item)
            .select();
          if (error) throw error;
          return { data, err: null };
        }

        return { data: existingItem, err: null };
      } else {
        const localWishlist = getLocalWishlist();
        const exists = localWishlist.some(
          (i) => i.product_id === item.product_id
        );
        if (!exists) {
          localWishlist.push(item);
          setLocalWishlist(localWishlist);
        }
        return { data: localWishlist, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function removeFromWishlist(
    product_id: string,
    user_id?: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { data, error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user_id)
          .eq("product_id", product_id)
          .select();
        if (error) throw new Error(error.message);
        return { data, err: null };
      } else {
        const updatedWishlist = getLocalWishlist().filter(
          (item) => item.product_id !== product_id
        );
        setLocalWishlist(updatedWishlist);
        return { data: updatedWishlist, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function clearWishlist(user_id?: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user_id);
        if (error) throw error;
        return { data: true, err: null };
      } else {
        setLocalWishlist([]);
        return { data: true, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function syncGuestWishlistToUser(user_id: string): Promise<ReturnType> {
    try {
      const guestWishlist = getLocalWishlist();
      for (const item of guestWishlist) {
        await addToWishlist({ ...item, user_id });
      }
      localStorage.removeItem(LOCAL_KEY);
      return { data: true, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    }
  }

  async function getRecommendedProducts(): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: topRatedReviews, error: reviewError } = await supabase
        .from("product_reviews")
        .select("product_id")
        .gte("rating_stars", 4)
        .order("rating_stars", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(5);

      if (reviewError) throw reviewError;
      if (!topRatedReviews?.length) return { data: [], err: null };

      const productIds = topRatedReviews.map((r) => r.product_id);

      const { data: recommendedProducts, error: productError } = await supabase
        .from("products")
        .select("*")
        .in("product_id", productIds);

      if (productError) throw productError;

      return { data: recommendedProducts ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function moveToCart(
    product_id: string,
    user_id?: string
  ): Promise<ReturnType> {
    try {
      const addResult = await addToCart({ product_id, user_id, quantity: 1 });
      if (addResult.err) throw new Error(addResult.err);

      const removeResult = await removeFromWishlist(product_id, user_id);
      if (removeResult.err) throw new Error(removeResult.err);

      return { data: true, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    }
  }

  return {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getRecommendedProducts,
    syncGuestWishlistToUser,
    moveToCart,
    isLoading,
  };
};

export default useWishlist;
