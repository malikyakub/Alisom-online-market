import { useState } from "react";
import supabase from "utils/supabase";

interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function createOrder({
    user_id,
    total_price,
    shipping,
    items,
  }: {
    user_id: string;
    total_price: number;
    shipping?: string;
    items: OrderItem[];
  }): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("Orders")
        .insert([
          {
            User_id: user_id,
            Total_price: total_price.toFixed(2),
            Status: "pending",
            Shipping: shipping || null,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.Order_id;

      const orderItems = items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity.toString(),
        unit_price: item.unit_price.toFixed(2),
      }));

      const { error: itemsError } = await supabase
        .from("Order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { data: orderData, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(
    order_id: string,
    status: "pending" | "approved" | "denied"
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
