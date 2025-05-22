import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Slider from "@mui/material/Slider";
import ClipLoader from "react-spinners/ClipLoader";
import useDashboard from "hooks/useDashboard";

type TimePeriod = "daily" | "weekly" | "monthly";

const DashboardChart: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("thisMonth");
  const [timeRange, setTimeRange] = useState<number[]>([0, 0]);
  const [chartData, setChartData] = useState<{
    labels: string[];
    sales: number[];
    income: number[];
  }>({
    labels: [],
    sales: [],
    income: [],
  });

  const { getDashboardData, isLoading } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      const periodMap: Record<"today" | "thisWeek" | "thisMonth", TimePeriod> =
        {
          today: "daily",
          thisWeek: "weekly",
          thisMonth: "monthly",
        };

      const { data } = await getDashboardData(periodMap[timePeriod]);
      if (!data) return;

      let labelsFormatted: string[] = [];

      if (timePeriod === "today") {
        labelsFormatted = data.map((d) => `${Number(d.period)}h`);
      } else if (timePeriod === "thisWeek") {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        labelsFormatted = data.map((d) => {
          const date = new Date(d.period);
          return weekdays[date.getDay()] || d.period;
        });
      } else {
        labelsFormatted = data.map((d) => {
          const date = new Date(d.period);
          return date.getDate().toString();
        });
      }

      setChartData({
        labels: labelsFormatted,
        sales: data.map((d) => d.sales),
        income: data.map((d) => d.income),
      });

      setTimeRange([0, data.length - 1]);
    };

    fetchData();
  }, [timePeriod]);

  const displayedLabels = chartData.labels.slice(
    timeRange[0],
    timeRange[1] + 1
  );
  const displayedSales = chartData.sales.slice(timeRange[0], timeRange[1] + 1);
  const displayedIncome = chartData.income.slice(
    timeRange[0],
    timeRange[1] + 1
  );

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) setTimeRange(newValue);
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-lg font-bold text-[#1A2238]">
            Sales & Income Chart
          </h3>
          <select
            id="time-period"
            value={timePeriod}
            onChange={(e) =>
              setTimePeriod(
                e.target.value as "today" | "thisWeek" | "thisMonth"
              )
            }
            className="p-2 border rounded w-fit"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        <div className="mb-4 w-full">
          <label className="block mb-2 font-medium text-[#1A2238]">
            Range: {displayedLabels[0]} -{" "}
            {displayedLabels[displayedLabels.length - 1]}
          </label>
          {chartData.labels.length > 0 && (
            <Slider
              value={timeRange}
              onChange={handleRangeChange}
              valueLabelDisplay="auto"
              sx={{ color: "#007BFF" }}
              min={0}
              max={chartData.labels.length - 1}
              step={1}
              marks
            />
          )}
        </div>
      </div>
      <div
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: 400 }}
      >
        {isLoading ? (
          <ClipLoader color="#007BFF" size={50} />
        ) : (
          <BarChart
            xAxis={[
              { id: "categories", data: displayedLabels, scaleType: "band" },
            ]}
            series={[
              { label: "Sales", data: displayedSales, color: "#007BFF" },
              {
                label: "Income",
                data: displayedIncome,
                color: "#17C3B2",
                valueFormatter: (value) => `$${value}`,
              },
            ]}
            height={380}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardChart;
