import React, { useEffect, useState } from "react";
import useDashboard from "hooks/useDashboard";

type Order = {
  Order_id: string;
  total_price: string | null;
  created_at: string;
  Full_name: string | null;
  Email: string | null;
  Status: string;
};

type RecentOrdersProps = {
  orders: Order[];
  isLoading: boolean;
  ordersLink?: string;
};

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  isLoading,
  ordersLink = "/orders",
}) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedOrders = isMobile ? orders : orders.slice(0, 2);

  return (
    <div className="w-full rounded-lg shadow-md p-4 flex-1 border border-blue-500 relative">
      <h2 className="font-semibold text-xl text-[#1A2238] dark:text-[#F4F4F4]">
        Recent Orders
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        {isLoading
          ? "Loading recent orders..."
          : `You have ${orders.length} orders in the last 24 hours`}
      </p>

      {displayedOrders.map((order, index) => (
        <div key={index} className="mb-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="font-medium text-[#1A2238] dark:text-white capitalize">
              {order.Full_name || "Guest User"}
            </div>
            <div className="text-sm text-gray-500">{order.Email}</div>
          </div>
          <div className="text-green-500 font-semibold">
            +$
            {Number(order.total_price ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      ))}

      <div className="mt-4 text-blue-500 absolute bottom-4">
        <a href={ordersLink} className="hover:underline">
          View more orders
        </a>
      </div>
    </div>
  );
};

export default RecentOrders;
