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

  async function updateOrderStatus(
    order_id: string,
    status: "Pending" | "Approved" | "Denied"
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("Orders")
        .update({ Status: status })
        .eq("Order_id", order_id);

      if (error) throw error;
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

  async function AllOrders(): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*, users(fullname, email)")
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
    updateOrderStatus,
    getOrdersByUserId,
    AllOrders,
    isLoading,
  };
};

export default useOrders;
