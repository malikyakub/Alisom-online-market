import React from 'react';

const DashboardCard = ({
  title,
  amount,
  growth,
  icon: Icon, // React icon component
  borderColor = 'border-blue-400',
}: {
  title: string;
  amount: string;
  growth: string;
  icon: React.ElementType;
  borderColor?: string;
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border ${borderColor} p-5 w-[300px] flex flex-col gap-1 relative`}>
      
      {/* Top Row */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-600 text-sm font-medium">{title}</span>
        <Icon className="text-gray-400" />
      </div>

      {/* Amount */}
      <h2 className="text-2xl font-bold text-black">{amount}</h2>

      {/* Growth Note */}
      <p className="text-sm text-gray-500">{growth}</p>
    </div>
  );
};

export default DashboardCard;
