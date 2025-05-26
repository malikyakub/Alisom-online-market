import { useState } from "react";
import supabase from "utils/supabase";
import useOrders from "./useOrders";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

const useEmails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getOrder } = useOrders();

  async function ApprovePayment(
    order: any
  ): Promise<{ data: string | null; err: string | null }> {
    setIsLoading(true);
    try {
      const { data: adminUser, error: adminErr } = await supabase
        .from("users")
        .select("email, fullname")
        .eq("role", "Admin")
        .limit(1)
        .single();

      if (adminErr || !adminUser) throw new Error("Admin user not found");
      if (!order) throw new Error("Order data not provided");

      // const items = order.items || [];

      interface Product {
        name?: string;
        price?: number;
      }

      interface OrderItem {
        products?: Product;
        quantity?: number;
      }

      interface Order {
        Order_id?: string;
        Full_name?: string;
        Email?: string;
        user?: {
          fullname?: string;
          email?: string;
        };
        items?: OrderItem[];
        total_price?: number;
        Address?: string;
        City?: string;
      }

      interface AdminUser {
        email?: string;
        fullname?: string;
      }

      const adminUserTyped: AdminUser = adminUser;
      const orderTyped: Order = order;
      const items: OrderItem[] = orderTyped.items || [];

      const html = `
    <h2>Payment Approval for Order #${orderTyped.Order_id}</h2>
    <p>Hello ${adminUserTyped.fullname},</p>
    <p>The order placed by <strong>${
      orderTyped.Full_name || orderTyped.user?.fullname
    }</strong> (${
        orderTyped.Email || orderTyped.user?.email
      }) has been requested for payment approval.</p>
    <h3>Order Details:</h3>
    <ul>
      ${items
        .map(
          (item) =>
            `<li>${item.products?.name || "Unknown product"} x ${
              item.quantity
            } @ $${item.products?.price || "0"}</li>`
        )
        .join("")}
    </ul>
    <p><strong>Total Price:</strong> $${orderTyped.total_price}</p>
    <p>Shipping Address: ${orderTyped.Address}, ${orderTyped.City}</p>
    <p>Please review and approve the payment.</p>
    <footer><small>This is an automated message from your eCommerce platform.</small></footer>
    `;

      console.log(`email sent to ${adminUser.email}`);

      return { data: html, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  function ApproveReply(
    order_id: string,
    from: string,
    to: string,
    status: "Approved" | "Denied" | "Pending"
  ): ReturnType<string> {
    try {
      const html = `
        <h2>Order #${order_id} Payment Status Update</h2>
        <p>From: ${from}</p>
        <p>To: ${to}</p>
        <p>The payment for order <strong>#${order_id}</strong> has been <strong>${status}</strong>.</p>
        <p>Thank you for using our service.</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;
      return { data: html, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    }
  }

  async function OrderShipping(
    order_id: string,
    shipping_status: string
  ): Promise<ReturnType<string>> {
    setIsLoading(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("Orders")
        .select("Full_name, Email")
        .eq("Order_id", order_id)
        .single();

      if (orderErr || !order) {
        throw new Error("Order not found");
      }

      const html = `
        <h2>Shipping Update for Order #${order_id}</h2>
        <p>Dear ${order.Full_name},</p>
        <p>Your order shipping status has been updated to: <strong>${shipping_status}</strong>.</p>
        <p>Thank you for shopping with us!</p>
        <footer><small>This is an automated message from your eCommerce platform.</small></footer>
      `;

      return { data: html, err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    ApprovePayment,
    ApproveReply,
    OrderShipping,
    isLoading,
  };
};

export default useEmails;
