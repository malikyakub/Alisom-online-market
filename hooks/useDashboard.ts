import { useState } from "react";
import supabase from "utils/supabase";

interface DashboardDataPoint {
  period: string;
  income: number;
  sales: number;
}

interface Order {
  Order_id: string;
  total_price: string | null;
  created_at: string;
  Full_name: string | null;
  Email: string | null;
  Status: string;
}

interface DashboardSummary {
  totalRevenue: number;
  totalRevenueLastMonth: number;
  productsSold: number;
  productsSoldLastMonth: number;
  productsInStock: number;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

type TimePeriod = "daily" | "weekly" | "monthly";

const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newOrders, setNewOrders] = useState<Order[]>([]);

  async function getDashboardData(
    range: TimePeriod
  ): Promise<ReturnType<DashboardDataPoint[]>> {
    setIsLoading(true);
    try {
      let truncUnit = "day";
      if (range === "daily") truncUnit = "hour";
      if (range === "weekly") truncUnit = "week";

      const { data, error } = await supabase.rpc("get_dashboard_data", {
        period_unit: truncUnit,
      });

      if (error) throw new Error(error.message);

      const formatted = data?.map(
        (d: any): DashboardDataPoint => ({
          period: d.period,
          income: Number(d.income),
          sales: Number(d.sales),
        })
      );

      return { data: formatted ?? [], err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getRecentOrders(limit = 5): Promise<ReturnType<Order[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .eq("Status", "Approved")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw new Error(error.message);
      return { data: data ?? [], err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function getDashboardSummary(): Promise<ReturnType<DashboardSummary>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_dashboard_summary");

      if (error) throw new Error(error.message);

      return {
        data: data?.[0] ?? null,
        err: null,
      };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  function subscribeToNewOrders() {
    const subscription = supabase
      .channel("realtime-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Orders",
        },
        (payload) => {
          const newOrder = payload.new as Order;
          if (newOrder.Status === "Pending") {
            setNewOrders((prev) => [newOrder, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  return {
    getDashboardData,
    getRecentOrders,
    getDashboardSummary,
    subscribeToNewOrders,
    newOrders,
    isLoading,
  };
};

export default useDashboard;
