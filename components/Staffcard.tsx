import React from "react";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

interface StaffCardProps {
  image: string;
  name: string;
  title: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const StaffCard: React.FC<StaffCardProps> = ({
  image,
  name,
  title,
  socials,
}) => {
  return (
    <div className="w-[370px] h-[564px] bg-white rounded-lg overflow-hidden shadow-md shadow-black/30">
      <div className="w-full h-[430px] bg-[#f5f5f5] flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-center" />
      </div>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-xl font-bold text-black mb-1">{name}</h2>
        <p className="text-sm font-semibold text-gray-800 mb-4">{title}</p>
        <div className="flex gap-4 text-black text-[18px]">
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#007BFF]"
            >
              <FaTwitter />
            </a>
          )}
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#007BFF]"
            >
              <FaInstagram />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl hover:text-[#007BFF]"
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
