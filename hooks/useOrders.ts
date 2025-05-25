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
        orderPayload.user_id = user_id;
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

  async function updateOrderStatusAndAdjustStock(
    order_id: string,
    action: "Approved" | "Denied" | "Pending"
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { error: statusError } = await supabase
        .from("Orders")
        .update({ Status: action })
        .eq("Order_id", order_id);

      if (statusError) throw statusError;

      if (action === "Approved") {
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
      }

      return { data: true, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getOrdersByUserOrEmail(
    user_id?: string,
    email?: string
  ): Promise<{ data: any[] | null; err: string | null }> {
    setIsLoading(true);

    try {
      let query = supabase.from("Orders").select("*").order("created_at", {
        ascending: false,
      });

      if (user_id) {
        query = query.eq("user_id", user_id);
      } else if (email) {
        query = query.eq("Email", email);
      } else {
        throw new Error("No user_id or email provided");
      }

      const { data, error } = await query;

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
      // ✅ Get order to check its status
      const { data: orderData, error: orderError } = await supabase
        .from("Orders")
        .select("Status")
        .eq("Order_id", order_id)
        .single();

      if (orderError || !orderData)
        throw orderError || new Error("Order not found");

      const isOrderApproved = orderData.Status === "Approved";

      // ✅ Fetch all items in the order
      const { data: orderItems, error: itemsError } = await supabase
        .from("Order_items")
        .select("product_id, quantity")
        .eq("order_id", order_id);

      if (itemsError) throw itemsError;

      // ✅ Restock only if order is approved
      if (isOrderApproved) {
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
      }

      // ✅ Always delete the order and its items
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

  async function getOrder(order_id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("Orders")
        .select("*")
        .eq("Order_id", order_id)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from("Order_items")
        .select("*, products(name, price)")
        .eq("order_id", order_id);

      if (itemsError) throw itemsError;

      return {
        data: { ...order, items },
        err: null,
      };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function returnItem(
    order_id: string,
    order_item_id: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, err } = await getOrder(order_id);
      if (err) {
        console.log(err);
        return { data: null, err };
      }

      const isOrderApproved = data.Status === "Approved";

      const { data: orderItem, error: itemError } = await supabase
        .from("Order_items")
        .select("product_id, quantity")
        .eq("order_item_id", order_item_id)
        .single();

      if (itemError) throw itemError;

      const quantity = parseInt(orderItem.quantity);
      if (isNaN(quantity)) throw new Error("Invalid quantity");

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("price, stock_quantity")
        .eq("product_id", orderItem.product_id)
        .single();

      if (productError || !product)
        throw productError || new Error("Product not found");

      const itemValue = quantity * parseFloat(product.price);

      const { data: order, error: orderError } = await supabase
        .from("Orders")
        .select("total_price")
        .eq("Order_id", order_id)
        .single();

      if (orderError) throw orderError;

      const newTotal = parseFloat(order.total_price) - itemValue;

      const { error: updateOrderError } = await supabase
        .from("Orders")
        .update({ total_price: newTotal.toFixed(2) })
        .eq("Order_id", order_id);

      if (updateOrderError) throw updateOrderError;

      if (isOrderApproved) {
        const newStockQty = product.stock_quantity + quantity;

        const { error: updateStockError } = await supabase
          .from("products")
          .update({ stock_quantity: newStockQty })
          .eq("product_id", orderItem.product_id);

        if (updateStockError) throw updateStockError;
      }

      const { error: deleteItemError } = await supabase
        .from("Order_items")
        .delete()
        .eq("order_item_id", order_item_id);

      if (deleteItemError) throw deleteItemError;

      return { data: true, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function SetOrderShippingData(
    order_id: string,
    tracking_number: string
  ): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { error: statusError } = await supabase
        .from("Orders")
        .update({
          tracking_number: tracking_number,
          shipping_status: "Shipped",
        })
        .eq("Order_id", order_id);

      if (statusError) throw statusError;

      return { data: true, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createOrder,
    updateOrderStatusAndAdjustStock,
    getOrdersByUserOrEmail,
    getOrder,
    returnItem,
    AllOrders,
    deleteOrderAndRestockItems,
    SetOrderShippingData,
    isLoading,
  };
};

export default useOrders;
