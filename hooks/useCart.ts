import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function getUserCart(userId: string): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*, products(*)")
        .eq("user_id", userId);

      if (error) throw new Error(error.message);

      const formatted = (data ?? []).map((item) => ({
        ...item,
        product: {
          ...item.products,
          image: item.products?.images?.[0]?.image_url ?? null,
        },
        total_price:
          (Number(item.quantity) || 1) * (Number(item.products?.price) || 0),
      }));

      return { data: formatted, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(cartData: {
    user_id: string;
    product_id: string;
    quantity: number;
  }): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: existing, error: findError } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", cartData.user_id)
        .eq("product_id", cartData.product_id)
        .single();

      if (findError && findError.code !== "PGRST116")
        throw new Error(findError.message);

      if (existing) {
        const updatedQuantity = Number(existing.quantity) + cartData.quantity;
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity: updatedQuantity })
          .eq("cart_id", existing.cart_id)
          .select();

        if (error) throw new Error(error.message);
        return { data, err: null };
      }

      const { data: inserted, error: insertError } = await supabase
        .from("cart")
        .insert(cartData)
        .select();

      if (insertError) throw new Error(insertError.message);
      return { data: inserted, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartItem(
    cartId: string,
    updates: Partial<{ quantity: number }>
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .update(updates)
        .eq("cart_id", cartId)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function removeCartItem(cartId: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("cart_id", cartId)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function clearUserCart(userId: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", userId)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getUserCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearUserCart,
    isLoading,
  };
};

export default useCart;
