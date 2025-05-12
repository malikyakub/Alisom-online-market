import React, { useState, useEffect } from "react";

const orders = [
  { name: "Ashton Johns", email: "ashton@gmail.com", amount: 2425.0 },
  { name: "Marley Hawk", email: "marley@gmail.com", amount: 675.0 },
  { name: "Juliet Dove", email: "dove@gmail.com", amount: 1240.0 },
  { name: "Juliet Dove", email: "dove@gmail.com", amount: 575.0 },
  { name: "Juliet Dove", email: "dove@gmail.com", amount: 2950.0 },
];

const RecentOrders = () => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedOrders = isMobile ? orders : orders.slice(0, 3);

  return (
    <div className="w-full rounded-lg shadow-md p-4 border border-blue-500">
      <h2 className="font-semibold text-xl text-gray-800">Recent Orders</h2>
      <p className="text-gray-500 text-sm mb-4">
        You have {orders.length} orders today
      </p>
      {displayedOrders.map((order, index) => (
        <div key={index} className="mb-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">{order.name}</div>
            <div className="text-sm text-gray-500">{order.email}</div>
          </div>
          <div className="text-green-500 font-semibold">
            +$
            {order.amount.toLocaleString(undefined, {
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
