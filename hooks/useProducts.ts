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
  } = {}): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      let query = supabase
        .from("products")
        .select(
          `
          *,
          category:category_id ( name ),
          brand:brand_id ( name ),
          images:product_images ( image_url )
        `
        )
        // .gt("stock_quantity", 0);

      if (search) query = query.ilike("name", `%${search}%`);
      if (typeof featured === "boolean") query = query.eq("featured", featured);
      if (brand) query = query.eq("brand.name", brand);

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

  async function GetFeaturedProducts(): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:category_id ( name ),
          brand:brand_id ( name ),
          images:product_images ( image_url )
        `
        )
        .eq("featured", true)
        .gt("stock_quantity", 0);

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

  async function GetProductById(id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:category_id ( name ),
          brand:brand_id ( name ),
          images:product_images ( image_url )
        `
        )
        .eq("product_id", id)
        .single();

      if (error) throw error;

      const formatted = {
        ...data,
        image: data.images?.[0]?.image_url ?? null,
      };

      return { data: formatted, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteProduct(id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: images, error: fetchError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", id);

      if (fetchError) throw new Error(fetchError.message);

      const filePaths = images
        ?.map((img) => {
          try {
            const url = new URL(img.image_url);
            const pathParts = decodeURIComponent(url.pathname).split("/");
            const fileIndex = pathParts.findIndex(
              (part) => part === "product-images"
            );
            return pathParts.slice(fileIndex + 1).join("/");
          } catch {
            return null;
          }
        })
        .filter(Boolean) as string[];

      if (filePaths.length) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove(filePaths);
        if (storageError) {
          console.warn("Storage deletion error:", storageError.message);
        }
      }

      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", id);
      if (deleteImagesError) {
        console.warn("Image row deletion error:", deleteImagesError.message);
      }

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
          console.error(`Upload failed for ${file.name}:`, uploadError.message);
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
        console.error("Unexpected error during upload:", error);
        continue;
      }
    }

    if (uploadedUrls.length === 0) {
      return { data: null, err: "All uploads failed" };
    }

    setIsLoading(false);
    return { data: uploadedUrls, err: null };
  }

  async function getFirstEight(): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
        *,
        category:category_id ( name ),
        brand:brand_id ( name ),
        images:product_images ( image_url )
      `
        )
        .gt("stock_quantity", 0)
        .limit(8);

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

  async function GetProductImages(
    productId: string
  ): Promise<ReturnType<string[]>> {
    try {
      const { data, error } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", productId);

      if (error) throw error;

      const imageUrls = data.map((img) => img.image_url);
      return { data: imageUrls, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    }
  }

  async function GetRelatedProducts(
    categoryId: string,
    brandId: string,
    excludeProductId?: string
  ): Promise<ReturnType<any[]>> {
    setIsLoading(true);
    try {
      let query = supabase
        .from("products")
        .select(
          `
        *,
        category:category_id ( name ),
        brand:brand_id ( name ),
        images:product_images ( image_url )
      `
        )
        .or(`category_id.eq.${categoryId},brand_id.eq.${brandId}`)
        .limit(5);

      if (excludeProductId) {
        query = query.neq("product_id", excludeProductId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formatted = data?.map((product) => ({
        ...product,
        image: product.images?.[0]?.image_url ?? null,
      }));

      return { data: formatted ?? [], err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function GetAverageRating(
    productId: string
  ): Promise<ReturnType<{ average: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("rating_stars")
        .eq("product_id", productId);

      if (error) throw error;

      const ratings = data.map((r) => Number(r.rating_stars)).filter(Boolean);
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length
          : 0;

      return {
        data: { average: avg.toFixed(1), count: ratings.length },
        err: null,
      };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    }
  }

  return {
    AllProducts,
    GetFeaturedProducts,
    GetProductById,
    DeleteProduct,
    UpdateProduct,
    NewProduct,
    UploadProductImages,
    getFirstEight,
    GetProductImages,
    GetRelatedProducts,
    GetAverageRating,
    isLoading,
  };
};

export default useProducts;
