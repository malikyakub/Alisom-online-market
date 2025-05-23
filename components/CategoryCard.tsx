import React from "react";
import type { IconType } from "react-icons";

interface CategoryCardProps {
  icon: IconType;
  text: string;
  onSelect?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon: Icon,
  text,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-[#1A2238]/10 dark:bg-white/10 w-[130px] h-[120px] sm:w-[170px] sm:h-[145px] rounded flex-shrink-0 flex flex-col items-center justify-center gap-2 m-2 transition-colors duration-300 hover:bg-[#17C3B2] hover:text-white group"
    >
      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-inherit transition-colors duration-300 group-hover:text-white dark:text-[#007BFF]" />
      <h1 className="text-base sm:text-xl font-thin transition-colors duration-300 group-hover:text-white text-center dark:text-white">
        {text}
      </h1>
    </div>
  );
};

export default CategoryCard;
