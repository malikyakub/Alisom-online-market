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
    <div className="w-[300px] bg-white dark:bg-white/20 rounded overflow-hidden shadow-lg cursor-pointer">
      <div className="relative w-full h-72 bg-gray-100 flex overflow-hidden">
        <img
          src={image}
          alt={name}
          className="object-cover object-top w-full h-full rounded-t"
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1 dark:text-[#F4F4F4]">
          {name}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{title}</p>
        <div className="flex gap-4 text-gray-700">
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              aria-label={`${name} Twitter`}
            >
              <FaTwitter size={20} />
            </a>
          )}
          {socials.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
              aria-label={`${name} Instagram`}
            >
              <FaInstagram size={20} />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
              aria-label={`${name} LinkedIn`}
            >
              <FaLinkedin size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
