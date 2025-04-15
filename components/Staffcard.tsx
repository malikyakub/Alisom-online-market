import React from 'react';
import {
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

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

const StaffCard: React.FC<StaffCardProps> = ({ image, name, title, socials }) => {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg overflow-hidden shadow-md shadow-black/30">
      <img src={image} alt={name} className="w-full h-80 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
        <p className="text-gray-600 text-sm mb-4">{title}</p>
        <div className="flex space-x-4 text-gray-600">
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
              <FaTwitter size={20} />
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={20} />
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


export default StaffCard;
