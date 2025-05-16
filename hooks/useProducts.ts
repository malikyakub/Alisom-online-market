// src/hooks/useProducts.ts
import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function AllProducts(): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("products").select(`
        *,
        category_id(*),
        brand_id (
          name
        )
      `);

      if (error) throw new Error(error.message);
      return { data: data ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteProduct(id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", id)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function UpdateProduct(
    id: string,
    newData: object
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .update(newData)
        .eq("product_id", id)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function NewProduct(newProductData: object): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .insert(newProductData)
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
    AllProducts,
    DeleteProduct,
    UpdateProduct,
    NewProduct,
    isLoading,
  };
};

export default useProducts;
