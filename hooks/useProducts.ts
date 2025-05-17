import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function AllProducts({
    search = "",
    featured,
    brand,
  }: {
    search?: string;
    featured?: boolean;
    brand?: string;
  } = {}) {
    setIsLoading(true);
    try {
      let query = supabase.from("products").select(
        `
        *,
        category:category_id (
          name
        ),
        brand:brand_id (
          name
        )
      `
      );

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (typeof featured === "boolean") {
        query = query.eq("is_featured", featured);
      }

      if (brand) {
        query = query.eq("brand.name", brand);
      }

      const { data, error } = await query;

      if (error) throw error;

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
  async function UploadProductImages(
    productName: string,
    files: File[],
    productId: string
  ): Promise<ReturnType<string[]>> {
    const uploadedUrls: string[] = [];
    const folderName = productName.replace(/\s+/g, "_");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const filePath = `${folderName}/image_${i + 1}.${fileExt}`;
      setIsLoading(true);
      try {
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          console.error(
            `Upload failed for file ${file.name}:`,
            uploadError.message
          );
          continue;
        }

        const { data: publicData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        const imageUrl = publicData.publicUrl;
        uploadedUrls.push(imageUrl);

        const { error: insertError } = await supabase
          .from("product_images")
          .insert({
            product_id: productId,
            image_url: imageUrl,
          });

        if (insertError) {
          console.error(
            `Insert failed for image ${imageUrl}:`,
            insertError.message
          );
          continue;
        }
      } catch (error) {
        console.error("Unexpected error during upload loop:", error);
        continue;
      }
    }

    if (uploadedUrls.length === 0) {
      return { data: null, err: "All uploads failed" };
    }
    setIsLoading(false);
    return { data: uploadedUrls, err: null };
  }

  return {
    AllProducts,
    DeleteProduct,
    UpdateProduct,
    NewProduct,
    UploadProductImages,
    isLoading,
  };
};

export default useProducts;
