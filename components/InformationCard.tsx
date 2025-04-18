import React from "react";

interface InformationCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value?: string;
  title?: string;
  iconBgColor?: string;
  textColor?: string;
}

const InformationCard: React.FC<InformationCardProps> = ({
  icon: Icon,
  value = "0",
  title = "Label goes here",
  iconBgColor = "#1A2238",
  textColor = "#1A2238",
}) => {
  return (
    <div className="bg-white w-[270px] h-[230px] rounded-lg shadow-md flex flex-col justify-center items-center p-4 gap-4 transition-colors duration-300 hover:bg-[#17C3B2] hover:text-white group">
      <div className="relative w-20 h-20 flex justify-center items-center">
        <div
          className="absolute w-28 h-28 rounded-full opacity-0 scale-75 transition-all duration-300 group-hover:opacity-20 group-hover:scale-100"
          style={{ backgroundColor: iconBgColor }}
        />
        <div
          className="w-20 h-20 rounded-full flex justify-center items-center z-10 transition-colors duration-300 group-hover:bg-white"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="text-white text-3xl group-hover:text-[#17C3B2] transition-colors duration-300" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold transition-colors duration-300 group-hover:text-white">
          {title}
        </h2>
        <p
          className="text-sm mt-1 font-bold transition-colors duration-300 group-hover:text-white"
          style={{ color: textColor }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default InformationCard;
