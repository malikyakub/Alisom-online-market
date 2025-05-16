import React from "react";
import { FaStore, FaShoppingBag, FaUsers, FaDollarSign, FaTruck, FaHeadset, FaCheckCircle } from "react-icons/fa";

import InformationCard from "components/InformationCard";
import StaffCard from "components/Staffcard";

const About: React.FC = () => {
  const stats = [
    {
      icon: FaStore,
      title: "10.5k",
      value: "Sellers active on our site",
    },
    {
      icon: FaDollarSign,
      title: "33k",
      value: "Monthly Product Sale",
      isGreenFull: true,
    },
    {
      icon: FaShoppingBag,
      title: "45.5k",
      value: "Customer active on our site",
    },
    {
      icon: FaDollarSign,
      title: "25k",
      value: "Annual gross sale on our site",
    },
  ];

  const staff = [
    {
      image: "https://i.pinimg.com/736x/f8/63/01/f86301f9f148f8b0692468e6a8f4bd2c.jpg",
      name: "Tom Cruise",
      title: "Founder & Chairman",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image: "https://i.pinimg.com/736x/bb/85/f6/bb85f6ba54308604b6a2f6ca89f0ebee.jpg",
      name: "Emma Watson",
      title: "Managing Director",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image: "https://i.pinimg.com/736x/cf/59/12/cf59123d6980a5d64db47bfbec349648.jpg",
      name: "Will Smith",
      title: "Product Designer",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
  ];

  const features = [
    {
      icon: FaTruck,
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140",
    },
    {
      icon: FaHeadset,
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support",
    },
    {
      icon: FaCheckCircle,
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days",
    },
  ];

  return (
    <div className="w-full px-4 md:px-16 py-10 space-y-16">
      {/* Section: Our Story */}
      <div className="flex flex-col lg:flex-row gap-10 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-[#1A2238]">Our Story</h2>
          <p className="text-gray-700 text-sm leading-7">
            Launched in 2015, Exclusive is South Asia’s premier online shopping marketplace
            with an active presence in Bangladesh. Supported by a wide range of tailored
            marketing, data, and service solutions, Exclusive has over 10.5k sellers and
            45.5k active customers. Our mission is to empower sellers and delight customers.
            <br /><br />
            Exclusive is a part of the Ecom Group, one of the leading global e-commerce
            platforms known for innovation and strategic digital market dominance.
          </p>
        </div>
        <div className="flex-1">
          <img src="https://i.pinimg.com/736x/09/8c/68/098c68ef387f3f3950f5b40183468656.jpg" alt="Our Story" className="w-full rounded-lg" />
        </div>
      </div>

      {/* Section: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
        {stats.map((item, index) => (
          <InformationCard key={index} {...item} />
        ))}
      </div>

      {/* Section: Staff Cards */}
      <div className="flex flex-col items-center gap-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-center w-full px-4">
    {staff.map((person, index) => (
      <div key={index} className="flex justify-center">
        <StaffCard {...person} />
      </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 w-full">
          {features.map((feature, index) => (
            <div key={index} className="text-center px-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-md">
                <feature.icon className="text-black text-xl" />
              </div>
              <h3 className="text-sm font-bold mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
