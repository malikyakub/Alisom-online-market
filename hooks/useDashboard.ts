import { useState, useEffect } from "react";
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

  // 📊 Fetch dashboard chart data
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

      const formatted = data?.map((d: any): DashboardDataPoint => ({
        period: d.period,
        income: Number(d.income),
        sales: Number(d.sales),
      }));

      return { data: formatted ?? [], err: null };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  // 📦 Fetch recent orders
  async function getRecentOrders(limit = 5): Promise<ReturnType<Order[]>> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
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

  // 📈 Dashboard Summary Data
  async function getDashboardSummary(): Promise<ReturnType<DashboardSummary>> {
    setIsLoading(true);
    try {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Total Revenue
      const thisMonthRevenue = await supabase
        .from("Orders")
        .select("total_price")
        .gte("created_at", thisMonthStart);

      const lastMonthRevenue = await supabase
        .from("Orders")
        .select("total_price")
        .gte("created_at", lastMonthStart)
        .lte("created_at", lastMonthEnd);

      const sumRevenue = (orders: any[]) =>
        orders.reduce((acc, o) => acc + Number(o.total_price || 0), 0);

      // Products Sold
      const thisMonthSales = await supabase
        .from("Order_items")
        .select("quantity, order_id, Orders(created_at)")
        .gte("Orders.created_at", thisMonthStart);

      const lastMonthSales = await supabase
        .from("Order_items")
        .select("quantity, order_id, Orders(created_at)")
        .gte("Orders.created_at", lastMonthStart)
        .lte("Orders.created_at", lastMonthEnd);

      const sumSold = (items: any[]) =>
        items.reduce((acc, i) => acc + Number(i.quantity || 0), 0);

      // Products In Stock
      const { data: productsData } = await supabase
        .from("products")
        .select("stock_quantity");

      const productsInStock =
        productsData?.reduce((acc, p) => acc + Number(p.stock_quantity || 0), 0) || 0;

      return {
        data: {
          totalRevenue: sumRevenue(thisMonthRevenue.data || []),
          totalRevenueLastMonth: sumRevenue(lastMonthRevenue.data || []),
          productsSold: sumSold(thisMonthSales.data || []),
          productsSoldLastMonth: sumSold(lastMonthSales.data || []),
          productsInStock,
        },
        err: null,
      };
    } catch (error) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  // 🔔 Real-time listener for new orders
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
          setNewOrders((prev) => [newOrder, ...prev]);
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
