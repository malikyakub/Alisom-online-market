import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useBrands = () => {
  async function getAllBrands(): Promise<ReturnType<any[]>> {
    try {
      const { data, error } = await supabase.from("Brands").select("*");
      if (error) throw new Error(error.message);
      return { data: data ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function getBrandByID(id: string): Promise<ReturnType<any>> {
    try {
      const { data, error } = await supabase
        .from("Brands")
        .select("*")
        .eq("brand_id", id)
        .single();
      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function createBrand(newBrand: object): Promise<ReturnType> {
    try {
      const { data, error } = await supabase
        .from("Brands")
        .insert(newBrand)
        .select();
      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function updateBrand(id: string, updates: object): Promise<ReturnType> {
    try {
      const { data, error } = await supabase
        .from("brands")
        .update(updates)
        .eq("brand_id", id)
        .select();
      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function deleteBrand(id: string): Promise<ReturnType> {
    try {
      const { data, error } = await supabase
        .from("brands")
        .delete()
        .eq("brand_id", id)
        .select();
      if (error) throw new Error(error.message);
      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  return {
    getAllBrands,
    getBrandByID,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};

export default useBrands;
