import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({
  title,
  amount,
  growth,
  icon: Icon,
  borderColor = "border-blue-400",
}: {
  title: string;
  amount: string;
  growth: string;
  icon: React.ElementType;
  borderColor?: string;
}) => {
  const navigate = useNavigate();

  const isNewOrders = title === "New Orders" && parseFloat(amount) > 0;
  const iconColor = isNewOrders ? "#17C3B2" : "text-gray-400";

  const handleIconClick = () => {
    if (isNewOrders) {
      navigate("/admin/orders");
    } else {
      alert("Icon clicked!");
    }
  };

  return (
    <div
      className={`bg-white/10 rounded-lg shadow-md border ${borderColor} p-5 w-full flex flex-col gap-1 relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-blue-600 text-sm font-medium">{title}</span>
        <button onClick={handleIconClick}>
          <Icon
            className={isNewOrders ? "" : "text-gray-400"}
            style={{ color: iconColor }}
          />
        </button>
      </div>
      <h2 className="text-2xl font-bold text-black dark:text-[#F4F4F4]">
        {amount}
      </h2>
      <p className="text-sm text-gray-500">{growth}</p>
    </div>
  );
};

export default DashboardCard;
