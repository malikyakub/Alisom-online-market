import React from 'react';

const orders = [
  { name: 'Ashton Johns', email: 'ashton@gmail.com', amount: 2425.0 },
  { name: 'Marley Hawk', email: 'marley@gmail.com', amount: 675.0 },
  { name: 'Juliet Dove', email: 'dove@gmail.com', amount: 1240.0 },
  { name: 'Juliet Dove', email: 'dove@gmail.com', amount: 575.0 },
  { name: 'Juliet Dove', email: 'dove@gmail.com', amount: 2950.0 },
];

const RecentOrders = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-fit border border-blue-500">
      <h2 className="font-semibold text-lg mb-1">Recent Orders</h2>
      <p className="text-gray-500 text-sm mb-4">
        You have 16 orders today totaling <span className="font-semibold text-gray-700">$12,492.00</span>.
      </p>
      {orders.map((order, index) => (
        <div key={index} className="mb-3">
          <div className="font-medium text-gray-800">{order.name}</div>
          <div className="text-sm text-gray-500">{order.email}</div>
          <div className="text-green-500 font-semibold">+${order.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrders;