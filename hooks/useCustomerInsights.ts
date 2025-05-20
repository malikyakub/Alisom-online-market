import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

interface CustomerInsight {
  fullname: string;
  email: string;
  phone: string;
  highest_order: number;
  is_repeat: boolean;
  since: string;
}

const useCustomerInsights = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function getCustomerInsights(): Promise<ReturnType<CustomerInsight[]>> {
    setIsLoading(true);
    try {
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("user_id, fullname, email, phone, role")
        .eq("role", "Customer");

      if (userError) throw new Error(userError.message);
      if (!users || users.length === 0) return { data: [], err: null };

      const insights: CustomerInsight[] = [];

      for (const user of users) {
        const { data: orders, error: orderError } = await supabase
          .from("Orders")
          .select("total_price, created_at")
          .eq("Email", user.email)
          .eq("is_Guest", false);

        if (orderError) throw new Error(orderError.message);

        if (orders && orders.length > 0) {
          const totalPrices = orders.map((o) =>
            parseFloat(o.total_price ?? "0")
          );
          const highest_order = Math.max(...totalPrices);
          const is_repeat = orders.length > 1;
          const since = orders.reduce((earliest, curr) => {
            return new Date(curr.created_at) < new Date(earliest.created_at)
              ? curr
              : earliest;
          }).created_at;

          insights.push({
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            highest_order,
            is_repeat,
            since,
          });
        }
      }

      return { data: insights, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getCustomerInsights,
    isLoading,
  };
};

export default useCustomerInsights;
