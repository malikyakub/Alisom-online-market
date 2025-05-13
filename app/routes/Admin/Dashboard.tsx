import DashboardCard from "components/DashboardCard";
import DashboardChart from "components/DashboardChart";
import RecentOrders from "components/RecentOrders";
import ServiceBookCard from "components/ServiceBookedCard";
import React from "react";
import { FaDollarSign, FaCartPlus, FaWarehouse, FaBox } from "react-icons/fa";

const Dashboard = () => {
  const cardsData = [
    {
      title: "Total Revenue",
      amount: "$32,875",
      growth: "+20.1% from last month",
      icon: FaDollarSign,
    },
    {
      title: "Products Sold",
      amount: "8,294",
      growth: "+180.1% from last month",
      icon: FaCartPlus,
    },
    {
      title: "Products In Stock",
      amount: "234",
      growth: "+19% from last month",
      icon: FaWarehouse,
    },
    {
      title: "New Orders",
      amount: "16",
      growth: "10 unpaid",
      icon: FaBox,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#1A2238]">Dashboard</h1>
        <p className="text-lg text-[#666666]">
          This is an overview of your store and its performance.
        </p>
      </div>

      <div className="flex flex-wrap justify-between gap-3 p-6">
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

      <div className="flex flex-col lg:flex-row gap-3 p-6">
        <div
          className="lg:w-2/3 rounded-lg border"
          style={{ borderColor: "#007BFF" }}
        >
          <DashboardChart />
        </div>

        <div className="lg:w-1/3 w-full flex flex-col gap-3">
          <RecentOrders />
          <ServiceBookCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
