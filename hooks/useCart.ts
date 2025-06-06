import { useState } from "react";
import supabase from "utils/supabase";
import useProducts from "./useProducts";

interface CartItem {
  cart_id?: string;
  user_id?: string;
  product_id: string;
  quantity: number;
}

interface DetailedCartItem extends CartItem {
  title?: string;
  price?: number;
  image?: string;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const LOCAL_KEY = "guest_cart";

const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { GetProductById } = useProducts();

  const getLocalCart = (): CartItem[] => {
    try {
      const cart = localStorage.getItem(LOCAL_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch {
      localStorage.removeItem(LOCAL_KEY);
      return [];
    }
  };

  const setLocalCart = (items: CartItem[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  };

  async function getCart(
    user_id?: string
  ): Promise<ReturnType<CartItem[] | DetailedCartItem[]>> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { data, error } = await supabase
          .from("cart")
          .select("*")
          .eq("user_id", user_id);
        if (error) throw new Error(error.message);
        return { data: data ?? [], err: null };
      } else {
        const localCart = getLocalCart();
        const detailedProducts = await Promise.all(
          localCart.map(async (item: CartItem) => {
            const { data: productDetails, err } = await GetProductById(
              item.product_id
            );
            if (err) return null;
            return { ...productDetails, quantity: item.quantity };
          })
        );
        return {
          data: detailedProducts.filter(Boolean) as DetailedCartItem[],
          err: null,
        };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function addToCart(item: CartItem): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const quantityToAdd = item.quantity ?? 1;
      const { err, data: product } = await GetProductById(item.product_id);
      if (err || !product) {
        return { data: null, err: err || "Product not found" };
      }

      if (item.user_id) {
        const { data: existingItem, error: fetchError } = await supabase
          .from("cart")
          .select("*")
          .eq("user_id", item.user_id)
          .eq("product_id", item.product_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

        const currentQty = existingItem?.quantity ?? 0;
        const newTotal = currentQty + quantityToAdd;

        if (newTotal > product.stock_quantity) {
          return {
            data: null,
            err: `Only ${product.stock_quantity} units of ${product.title} in stock`,
          };
        }

        if (existingItem) {
          const { data, error: updateError } = await supabase
            .from("cart")
            .update({ quantity: newTotal })
            .eq("user_id", item.user_id)
            .eq("product_id", item.product_id)
            .select();
          if (updateError) throw updateError;
          return { data, err: null };
        } else {
          const { data, error } = await supabase
            .from("cart")
            .insert({ ...item, quantity: quantityToAdd })
            .select();
          if (error) throw error;
          return { data, err: null };
        }
      } else {
        const localCart = getLocalCart();
        const existing = localCart.find(
          (i) => i.product_id === item.product_id
        );
        const newTotal = (existing?.quantity ?? 0) + quantityToAdd;

        if (newTotal > product.stock_quantity) {
          return {
            data: null,
            err: `Only ${product.stock_quantity} units of ${product.title} in stock`,
          };
        }

        if (existing) {
          existing.quantity = newTotal;
        } else {
          localCart.push({ ...item, quantity: quantityToAdd });
        }

        setLocalCart(localCart);
        return { data: localCart, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCartItem(
    product_id: string,
    quantity: number,
    user_id?: string
  ): Promise<ReturnType> {
    if (quantity === 0) {
      return await removeFromCart(product_id, user_id);
    }

    setIsLoading(true);
    try {
      const { data: product, err } = await GetProductById(product_id);
      if (err || !product) {
        return { data: null, err: err || "Product not found" };
      }

      if (quantity > product.stock_quantity) {
        return {
          data: null,
          err: `Only ${product.stock_quantity} units of ${product.title} in stock`,
        };
      }

      if (user_id) {
        const { data, error } = await supabase
          .from("cart")
          .update({ quantity })
          .eq("user_id", user_id)
          .eq("product_id", product_id)
          .select();
        if (error) throw new Error(error.message);
        return { data, err: null };
      } else {
        const localCart = getLocalCart().map((item) =>
          item.product_id === product_id ? { ...item, quantity } : item
        );
        setLocalCart(localCart);
        return { data: localCart, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function removeFromCart(
    product_id: string,
    user_id?: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { data, error } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user_id)
          .eq("product_id", product_id)
          .select();
        if (error) throw new Error(error.message);
        return { data, err: null };
      } else {
        const updatedCart = getLocalCart().filter(
          (item) => item.product_id !== product_id
        );
        setLocalCart(updatedCart);
        return { data: updatedCart, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function clearCart(user_id?: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      if (user_id) {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("user_id", user_id);
        if (error) throw error;
        return { data: true, err: null };
      } else {
        setLocalCart([]);
        return { data: true, err: null };
      }
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function syncGuestCartToUser(user_id: string): Promise<ReturnType> {
    try {
      const guestCart = getLocalCart();
      for (const item of guestCart) {
        await addToCart({ ...item, user_id });
      }
      localStorage.removeItem(LOCAL_KEY);
      return { data: true, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    }
  }

  return {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncGuestCartToUser,
    isLoading,
  };
};

export default useCart;
