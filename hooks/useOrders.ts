import { useState } from "react";
import supabase from "utils/supabase";

interface OrderItem {
  product_id: string;
  quantity: number;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

interface CreateOrderArgs {
  user_id?: string;
  fullname?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  total_price: number;
  shipping?: string;
  items: OrderItem[];
}

const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  type CreateOrderArgs = {
    user_id?: string;
    fullname: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    total_price: number;
    shipping: string;
    items: { product_id: string; quantity: number }[];
    is_Guest: boolean;
  };

  type ReturnType = {
    data: any;
    err: string | null;
  };

  async function createOrder({
    user_id,
    fullname,
    address,
    city,
    phone,
    email,
    total_price,
    shipping,
    items,
    is_Guest,
  }: CreateOrderArgs): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const orderPayload: any = {
        total_price: total_price.toFixed(2),
        Shipping: shipping || null,
        created_at: new Date().toISOString(),
        Full_name: fullname,
        Address: address,
        City: city,
        Phone: phone,
        Email: email,
        is_Guest,
      };

      if (user_id) {
        orderPayload.User_id = user_id;
      }

      const { data: orderData, error: orderError } = await supabase
        .from("Orders")
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        return { data: null, err: JSON.stringify(orderError) };
      }

      const orderId = orderData.Order_id;

      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity.toString(),
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from("Order_items")
        .insert(orderItems);

      if (itemsError) {
        return { data: null, err: JSON.stringify(itemsError) };
      }

      return { data: orderData, err: null };
    } catch (error) {
      console.error("🔥 Unexpected error:", error);
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function approveOrderAndReduceStock(
    order_id: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { error: statusError } = await supabase
        .from("Orders")
        .update({ Status: "Approved" })
        .eq("Order_id", order_id);

      if (statusError) throw statusError;

      const { data: orderItems, error: itemsError } = await supabase
        .from("Order_items")
        .select("product_id, quantity")
        .eq("order_id", order_id);

      if (itemsError) throw itemsError;

      for (const item of orderItems || []) {
        const quantity = parseInt(item.quantity);
        if (isNaN(quantity)) continue;

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("product_id", item.product_id)
          .single();

        if (productError || !product) continue;

        const newStock = product.stock_quantity - quantity;

        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("product_id", item.product_id);
      }

      return { data: true, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getOrdersByUserId(user_id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .eq("User_id", user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteOrderAndRestockItems(
    order_id: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: orderItems, error: itemsError } = await supabase
        .from("Order_items")
        .select("product_id, quantity")
        .eq("order_id", order_id);

      if (itemsError) throw itemsError;

      for (const item of orderItems || []) {
        const quantity = parseInt(item.quantity);
        if (isNaN(quantity)) continue;

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("product_id", item.product_id)
          .single();

        if (productError || !product) continue;

        const newStock = product.stock_quantity + quantity;

        await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("product_id", item.product_id);
      }

      const { error: deleteError } = await supabase
        .from("Orders")
        .delete()
        .eq("Order_id", order_id);

      if (deleteError) throw deleteError;

      return { data: true, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function AllOrders(): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createOrder,
    approveOrderAndReduceStock,
    getOrdersByUserId,
    AllOrders,
    deleteOrderAndRestockItems,
    isLoading,
  };
};

export default useOrders;
