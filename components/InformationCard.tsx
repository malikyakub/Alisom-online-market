import React from "react";

interface InformationCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value?: string;
  title?: string;
  iconBgColor?: string;
  textColor?: string;
  isGreenFull?: boolean;
}

const InformationCard: React.FC<InformationCardProps> = ({
  icon: Icon,
  value = "0",
  title = "Label goes here",
  iconBgColor = "#1A2238",
  textColor = "#1A2238",
  isGreenFull = false,
}) => {
  const cardClasses = isGreenFull
    ? "bg-teal-500/20 text-teal-900 dark:text-teal-100"
    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:text-white";

  const iconWrapperBg = isGreenFull ? "bg-white" : iconBgColor;
  const iconColor = isGreenFull ? "#17C3B2" : "white";

  return (
    <div
      className={`w-[270px] h-[230px] rounded-lg shadow-md flex flex-col justify-center items-center p-4 gap-4 transition-all duration-300 relative group ${cardClasses}`}
    >
      <div className="relative w-20 h-20 flex justify-center items-center">
        <div
          className="absolute w-28 h-28 rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:opacity-20 group-hover:scale-100"
          style={{
            backgroundColor: isGreenFull
              ? "rgba(23, 195, 178, 0.2)"
              : iconBgColor,
          }}
        />
        <div
          className="w-20 h-20 rounded-full flex justify-center items-center z-10 transition-colors duration-300"
          style={{ backgroundColor: iconWrapperBg }}
        >
          <Icon
            className="text-3xl transition-colors duration-300"
            style={{ color: iconColor }}
          />
        </div>
      </div>

      <div className="text-center z-10">
        <h2 className="text-2xl font-bold transition-colors duration-300 group-hover:text-white">
          {title}
        </h2>
        <p className="text-sm mt-1 font-bold transition-colors duration-300 group-hover:text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

export default InformationCard;
