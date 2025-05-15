import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Slider from "@mui/material/Slider";

const DashboardChart: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("thisMonth");
  const [timeRange, setTimeRange] = useState<number[]>([0, 6]);

  const getChartData = () => {
    switch (timePeriod) {
      case "today":
        return {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          sales: Array.from({ length: 24 }, () =>
            Math.floor(Math.random() * 40)
          ),
          income: Array.from({ length: 24 }, () =>
            Math.floor(Math.random() * 20)
          ),
        };
      case "thisWeek":
        return {
          labels: Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`),
          sales: Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 100)
          ),
          income: Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 50)
          ),
        };
      case "thisMonth":
        const currentDate = new Date();
        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate();
        return {
          labels: Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`),
          sales: Array.from({ length: daysInMonth }, () =>
            Math.floor(Math.random() * 100)
          ),
          income: Array.from({ length: daysInMonth }, () =>
            Math.floor(Math.random() * 50)
          ),
        };
      default:
        return { labels: [], sales: [], income: [] };
    }
  };

  const chartData = getChartData();

  const displayedLabels = chartData.labels.slice(
    timeRange[0],
    timeRange[1] + 1
  );
  const displayedSales = chartData.sales.slice(timeRange[0], timeRange[1] + 1);
  const displayedIncome = chartData.income.slice(
    timeRange[0],
    timeRange[1] + 1
  );

  const handleRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setTimeRange(newValue);
    }
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
            onChange={(e) => {
              const value = e.target.value as
                | "today"
                | "thisWeek"
                | "thisMonth";
              setTimePeriod(value);
              setTimeRange([0, getChartData().labels.length - 1]);
            }}
            className="p-2 border rounded w-fit"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week (Last 2 Months)</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>

        <div className="mb-4 w-full">
          <label className="block mb-2 font-medium text-[#1A2238]">
            Range: {displayedLabels[0]} -{" "}
            {displayedLabels[displayedLabels.length - 1]}
          </label>
          <Slider
            value={timeRange}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            sx={{
              color: "#007BFF",
            }}
            min={0}
            max={chartData.labels.length - 1}
            marks
          />
        </div>
      </div>

      <div
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: 400 }}
      >
        <BarChart
          xAxis={[
            {
              id: "categories",
              data: displayedLabels,
              scaleType: "band",
            },
          ]}
          series={[
            {
              label: "Sales",
              data: displayedSales,
              color: "#007BFF",
            },
            {
              label: "Income",
              data: displayedIncome,
              color: "#17C3B2",
              valueFormatter: (value) => `$${value}`,
            },
          ]}
          height={380}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
