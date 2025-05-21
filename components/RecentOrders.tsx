import useDashboard from "hooks/useDashboard";
import React, { useState, useEffect } from "react";

const RecentOrders = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const { getRecentOrders, isLoading } = useDashboard();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getRecentOrders(10).then((res) => {
      if (res.data) setOrders(res.data);
    });
  }, []);

  const displayedOrders = isMobile ? orders : orders.slice(0, 2);

  return (
    <div className="w-full rounded-lg shadow-md p-4 flex-1 border border-blue-500">
      <h2 className="font-semibold text-xl text-gray-800">Recent Orders</h2>
      <p className="text-gray-500 text-sm mb-4">
        {isLoading
          ? "Loading recent orders..."
          : `You have ${orders.length} recent orders`}
      </p>

      {displayedOrders.map((order, index) => (
        <div key={index} className="mb-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">
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

      <div className="mt-4 text-blue-500">
        <a href="/orders" className="hover:underline">
          View more orders
        </a>
      </div>
    </div>
  );
};

export default RecentOrders;
