import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const usecategory = () => {
  async function Allcategory(): Promise<ReturnType<any[]>> {
    try {
      const { data, error } = await supabase.from("category").select("*");
      if (error) throw new Error(error.message);
      return { data: data ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function getCategoryByID(id: string): Promise<ReturnType<any>> {
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
    }
  }

  async function getCategoryProducts(
    categoryId: string
  ): Promise<ReturnType<any[]>> {
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
    }
  }

  async function getProductCountByCategory(
    categoryId: string
  ): Promise<ReturnType<number>> {
    try {
      const { count, error } = await supabase
        .from("products")
        .select("product_id", { count: "exact", head: true })
        .eq("category_id", categoryId);

      if (error) throw new Error(error.message);

      return { data: count ?? 0, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function DeleteCategory(id: string): Promise<ReturnType> {
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
    }
  }

  async function UpdateCategory(
    id: string,
    newData: object
  ): Promise<ReturnType> {
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
    }
  }

  async function NewCategory(newCategoryData: object): Promise<ReturnType> {
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
    }
  }

  return {
    Allcategory,
    getCategoryByID,
    getCategoryProducts,
    getProductCountByCategory,
    DeleteCategory,
    UpdateCategory,
    NewCategory,
  };
};

export default usecategory;
