import React from "react";

interface FeatureCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="relative group flex flex-col items-center justify-center w-[300px] h-40 rounded bg-white hover:bg-[#17C3B2] transition-colors duration-300 overflow-hidden shadow-md">
      <div className="relative z-10 w-16 h-16 rounded-full bg-[#1A2238]/20 flex items-center justify-center shadow-md">
        <Icon className="text-[#1A2238] text-2xl" />
      </div>

      <div className="relative z-10 mt-4 text-center px-2">
        <h3 className="text-sm font-semibold text-[#1A2238] group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs text-gray-600 group-hover:text-gray-100 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
