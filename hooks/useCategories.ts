import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const usecategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function Allcategory(): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("category").select("*");
      if (error) throw new Error(error.message);
      return { data: data ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getCategoryByID(id: string): Promise<ReturnType<any>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .eq("category_id", id)
        .single();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getCategoryProducts(
    categoryId: string
  ): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId);

      if (error) throw new Error(error.message);

      const formatted = data?.map((product) => ({
        ...product,
        image: product.images?.[0]?.image_url ?? null,
      }));

      return { data: formatted ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteCategory(id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category")
        .delete()
        .eq("category_id", id)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function UpdateCategory(
    id: string,
    newData: object
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category")
        .update(newData)
        .eq("category_id", id)
        .select();

      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function NewCategory(newCategoryData: object): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("category")
        .insert(newCategoryData)
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
    Allcategory,
    getCategoryByID,
    getCategoryProducts,
    DeleteCategory,
    UpdateCategory,
    NewCategory,
    isLoading,
  };
};

export default usecategory;
