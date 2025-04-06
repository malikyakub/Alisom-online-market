import React from "react";
import type { IconType } from "react-icons";

interface CategoryCardProps {
  icon: IconType;
  text: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon: Icon, text }) => {
  return (
    <div className="bg-white w-40 h-40 rounded justify-center items-center flex flex-col gap-2 m-2">
      <Icon className="w-20 h-20" />
      <h1 className="text-xl font-thin">{text}</h1>
    </div>
  );
};

export default CategoryCard;
