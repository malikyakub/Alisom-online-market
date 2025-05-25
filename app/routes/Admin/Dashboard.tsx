import { useEffect, useState } from "react";
import DashboardCard from "components/DashboardCard";
import DashboardChart from "components/DashboardChart";
import RecentOrders from "components/RecentOrders";
import ServiceBookCard from "components/ServiceBookedCard";
import { FaDollarSign, FaCartPlus, FaWarehouse, FaBox } from "react-icons/fa";
import useDashboard from "hooks/useDashboard";

const Dashboard = () => {
  const {
    getDashboardSummary,
    newOrders,
    recentOrders,
    subscribeToNewPendingOrders,
    subscribeToNewApprovedOrders,
    isLoading,
  } = useDashboard();

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalRevenueLastMonth: 0,
    productsSold: 0,
    productsSoldLastMonth: 0,
    productsInStock: 0,
  });

  useEffect(() => {
    let isMounted = true;
    getDashboardSummary().then((res) => {
      if (isMounted && res.data) setSummary(res.data);
    });

    const unsubscribePending = subscribeToNewPendingOrders();
    const unsubscribeApproved = subscribeToNewApprovedOrders();

    return () => {
      isMounted = false;
      unsubscribePending();
      unsubscribeApproved();
    };
  }, []);

  const calculateGrowth = (current: number, previous: number): string => {
    if (previous === 0) return "+100%";
    const growth = ((current - previous) / previous) * 100;
    const sign = growth >= 0 ? "+" : "-";
    return `${sign}${Math.abs(growth).toFixed(1)}% from last month`;
  };

  const cardsData = [
    {
      title: "Total Revenue",
      amount: `$${summary.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
      growth: calculateGrowth(
        summary.totalRevenue,
        summary.totalRevenueLastMonth
      ),
      icon: FaDollarSign,
    },
    {
      title: "Products Sold",
      amount: summary.productsSold.toString(),
      growth: calculateGrowth(
        summary.productsSold,
        summary.productsSoldLastMonth
      ),
      icon: FaCartPlus,
    },
    {
      title: "Products In Stock",
      amount: summary.productsInStock.toString(),
      growth: "+0% from last month",
      icon: FaWarehouse,
    },
    {
      title: "New Orders",
      amount: newOrders.length.toString(),
      growth: `${newOrders.length} pending`,
      icon: FaBox,
    },
  ];

  return (
    <div className="flex flex-col w-full text-[#1A2238] dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-[#1A2238] dark:text-white">
          Dashboard
        </h1>
        <p className="text-lg text-[#666666] dark:text-gray-400">
          This is an overview of your store and its performance.
        </p>
      </div>

      <div className="flex flex-wrap justify-between gap-2 my-5">
        {cardsData.map((card, index) => (
          <div key={index} className="w-full sm:w-[48%] lg:w-[24%]">
            <DashboardCard
              title={card.title}
              amount={card.amount}
              growth={card.growth}
              icon={card.icon}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="lg:w-2/3 rounded-lg border border-[#007BFF] dark:border-blue-500">
          <DashboardChart />
        </div>

        <div className="lg:w-1/3 w-full flex flex-col gap-2">
          <RecentOrders orders={recentOrders} isLoading={isLoading} />
          {/* <ServiceBookCard /> //? still under development */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
