import { useState, useEffect } from "react";
import supabase from "utils/supabase";

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

const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newOrders, setNewOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  async function fetchPendingOrders() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .eq("Status", "Pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setNewOrders(data ?? []);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchRecentOrdersLast24h() {
    setIsLoading(true);
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isoDate = yesterday.toISOString();
      const { data, error } = await supabase
        .from("Orders")
        .select("*")
        .eq("Status", "Approved")
        .gte("created_at", isoDate)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecentOrders(data ?? []);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getDashboardSummary(): Promise<ReturnType<DashboardSummary>> {
  setIsLoading(true);
  try {
    // 1. Total Revenue (Approved orders)
    const { data: totalRevenueData, error: revErr } = await supabase
      .from("Orders")
      .select("total_price", { count: "exact" })
      .eq("Status", "Approved");
    if (revErr) throw revErr;

    const totalRevenue = totalRevenueData
      ? totalRevenueData.reduce(
          (acc, order) => acc + Number(order.total_price ?? 0),
          0
        )
      : 0;

    // Dates for last month range
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // 2. Total Revenue Last Month (Approved orders last month)
    const { data: lastMonthRevenueData, error: lastRevErr } = await supabase
      .from("Orders")
      .select("total_price")
      .eq("Status", "Approved")
      .gte("created_at", firstDayLastMonth.toISOString())
      .lte("created_at", lastDayLastMonth.toISOString());
    if (lastRevErr) throw lastRevErr;

    const totalRevenueLastMonth = lastMonthRevenueData
      ? lastMonthRevenueData.reduce(
          (acc, order) => acc + Number(order.total_price ?? 0),
          0
        )
      : 0;

    // 3. Get Approved Orders IDs (for products sold calculation)
    const { data: approvedOrdersData, error: approvedOrdersErr } = await supabase
      .from("Orders")
      .select("Order_id")
      .eq("Status", "Approved");
    if (approvedOrdersErr) throw approvedOrdersErr;
    const approvedOrderIds = approvedOrdersData?.map((o) => o.Order_id) ?? [];

    // 4. Products Sold (sum quantity in approved orders)
    const { data: productsSoldData, error: productsSoldErr } = await supabase
      .from("Order_items")
      .select("quantity, order_id")
      .in("order_id", approvedOrderIds);
    if (productsSoldErr) throw productsSoldErr;

    const productsSold = productsSoldData
      ? productsSoldData.reduce(
          (acc, item) => acc + Number(item.quantity ?? 0),
          0
        )
      : 0;

    // 5. Get Approved Orders IDs Last Month
    const { data: lastMonthApprovedOrders, error: lastMonthOrdersErr } = await supabase
      .from("Orders")
      .select("Order_id")
      .eq("Status", "Approved")
      .gte("created_at", firstDayLastMonth.toISOString())
      .lte("created_at", lastDayLastMonth.toISOString());
    if (lastMonthOrdersErr) throw lastMonthOrdersErr;
    const lastMonthOrderIds = lastMonthApprovedOrders?.map((o) => o.Order_id) ?? [];

    // 6. Products Sold Last Month (sum quantity in approved orders last month)
    const { data: productsSoldLastMonthData, error: productsSoldLastMonthErr } = await supabase
      .from("Order_items")
      .select("quantity, order_id")
      .in("order_id", lastMonthOrderIds);
    if (productsSoldLastMonthErr) throw productsSoldLastMonthErr;

    const productsSoldLastMonth = productsSoldLastMonthData
      ? productsSoldLastMonthData.reduce(
          (acc, item) => acc + Number(item.quantity ?? 0),
          0
        )
      : 0;

    // 7. Products In Stock (sum stock_quantity)
    const { data: stockData, error: stockErr } = await supabase
      .from("products")
      .select("stock_quantity");
    if (stockErr) throw stockErr;

    const productsInStock = stockData
      ? stockData.reduce((acc, p) => acc + (p.stock_quantity ?? 0), 0)
      : 0;

    return {
      data: {
        totalRevenue,
        totalRevenueLastMonth,
        productsSold,
        productsSoldLastMonth,
        productsInStock,
      },
      err: null,
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return { data: null, err: String(error) };
  } finally {
    setIsLoading(false);
  }
}


  async function getDashboardData(period: "daily" | "weekly" | "monthly") {
    setIsLoading(true);
    try {
      const now = new Date();
      let startDate: Date;
      if (period === "daily") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === "weekly") {
        startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      const { data: ordersData, error: ordersError } = await supabase
        .from("Orders")
        .select("Order_id, total_price, created_at")
        .eq("Status", "Approved")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });
      if (ordersError) throw ordersError;
      if (!ordersData || ordersData.length === 0) {
        return { data: [] };
      }
      const orderIds = ordersData.map((o) => o.Order_id);
      const { data: itemsData, error: itemsError } = await supabase
        .from("Order_items")
        .select("order_id, quantity")
        .in("order_id", orderIds);
      if (itemsError) throw itemsError;
      type AggData = { sales: number; income: number };
      const aggregationMap: Record<string, AggData> = {};
      for (const order of ordersData) {
        const orderDate = new Date(order.created_at);
        let key = "";
        if (period === "daily") {
          key = orderDate.getHours().toString();
        } else {
          key = orderDate.toISOString().split("T")[0];
        }
        if (!aggregationMap[key]) aggregationMap[key] = { sales: 0, income: 0 };
        aggregationMap[key].income += Number(order.total_price ?? 0);
        const relatedItems = itemsData.filter(
          (item) => item.order_id === order.Order_id
        );
        const totalQuantity = relatedItems.reduce(
          (acc, item) => acc + Number(item.quantity ?? 0),
          0
        );
        aggregationMap[key].sales += totalQuantity;
      }
      const result: { period: string; sales: number; income: number }[] = [];
      if (period === "daily") {
        for (let hour = 0; hour < 24; hour++) {
          const k = hour.toString();
          if (aggregationMap[k]) {
            result.push({
              period: k,
              sales: aggregationMap[k].sales,
              income: aggregationMap[k].income,
            });
          } else {
            result.push({ period: k, sales: 0, income: 0 });
          }
        }
      } else {
        let endDate = now;
        if (period === "monthly") {
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        for (
          let dt = new Date(startDate);
          dt <= endDate;
          dt.setDate(dt.getDate() + 1)
        ) {
          const k = dt.toISOString().split("T")[0];
          if (aggregationMap[k]) {
            result.push({
              period: k,
              sales: aggregationMap[k].sales,
              income: aggregationMap[k].income,
            });
          } else {
            result.push({ period: k, sales: 0, income: 0 });
          }
        }
      }
      return { data: result };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return { data: null };
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingOrders();
    fetchRecentOrdersLast24h();
  }, []);

  function subscribeToNewPendingOrders() {
    const subscription = supabase
      .channel("realtime-pending-orders")
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

  useEffect(() => {
    fetchPendingOrders();
    fetchRecentOrdersLast24h();
    const unsubscribe = subscribeToNewPendingOrders();

    return () => {
      unsubscribe();
    };
  }, []);

  function subscribeToNewApprovedOrders() {
    const subscription = supabase
      .channel("realtime-approved-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Orders",
        },
        (payload) => {
          const newOrder = payload.new as Order;
          if (newOrder.Status === "Approved") {
            const orderDate = new Date(newOrder.created_at);
            const now = new Date();
            if (now.getTime() - orderDate.getTime() <= 24 * 60 * 60 * 1000) {
              setRecentOrders((prev) => [newOrder, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  return {
    isLoading,
    newOrders,
    recentOrders,
    getDashboardSummary,
    getDashboardData,
    subscribeToNewPendingOrders,
    subscribeToNewApprovedOrders,
    fetchPendingOrders,
  };
};

export default useDashboard;
