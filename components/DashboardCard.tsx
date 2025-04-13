import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const DashboardCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-400 p-5 w-[300px] flex flex-col gap-1 relative">
      
      {/* Top Row */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-600 text-sm font-medium">Total Revenue</span>
        <FiDollarSign className="text-gray-400" />
      </div>
      
      {/* Amount */}
      <h2 className="text-2xl font-bold text-black">$32,875</h2>
      
      {/* Growth Note */}
      <p className="text-sm text-gray-500">+20.1% from last month</p>
    </div>
  );
};

export default DashboardCard;
