import { useState } from "react";
import supabase from "utils/supabase";

interface DashboardDataPoint {
  period: string;
  income: number;
  sales: number;
}

interface ReturnType<T = any> {
  data: T | null;
  err: string | null;
}

type TimePeriod = "daily" | "weekly" | "monthly";

const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

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

      interface RawDashboardData {
        period: string;
        income: string | number;
        sales: string | number;
      }

      const formatted: DashboardDataPoint[] | undefined = data?.map(
        (d: RawDashboardData): DashboardDataPoint => ({
          period: d.period,
          income: Number(d.income),
          sales: Number(d.sales),
        })
      );

      return { data: formatted ?? [], err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  return {
    getDashboardData,
    isLoading,
  };
};

export default useDashboard;
