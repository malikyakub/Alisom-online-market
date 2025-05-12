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
      borderColor: "border-green-400",
    },
    {
      title: "Products Sold",
      amount: "8,294",
      growth: "+180.1% from last month",
      icon: FaCartPlus,
      borderColor: "border-orange-400",
    },
    {
      title: "Products In Stock",
      amount: "234",
      growth: "+19% from last month",
      icon: FaWarehouse,
      borderColor: "border-blue-400",
    },
    {
      title: "New Orders",
      amount: "16",
      growth: "10 unpaid",
      icon: FaBox,
      borderColor: "border-red-400",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap justify-between gap-3 p-4">
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

      <div className="flex flex-col lg:flex-row gap-3 p-4">
        <div className="lg:w-2/3 rounded-lg border border-[#007BFF] w-full max-w-full">
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
