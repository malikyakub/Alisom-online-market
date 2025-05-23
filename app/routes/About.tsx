import React from "react";
import { motion } from "framer-motion";
import {
  FaStore,
  FaShoppingBag,
  FaDollarSign,
  FaTruck,
  FaHeadset,
  FaCheckCircle,
} from "react-icons/fa";

import InformationCard from "components/InformationCard";
import StaffCard from "components/Staffcard";
import FeatureCard from "components/FeatureCard";

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
      isGreenFull: true,
    },
  ];

  const staff = [
    {
      image:
        "https://i.pinimg.com/736x/f8/63/01/f86301f9f148f8b0692468e6a8f4bd2c.jpg",
      name: "Tom Cruise",
      title: "Founder & Chairman",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image:
        "https://i.pinimg.com/736x/bb/85/f6/bb85f6ba54308604b6a2f6ca89f0ebee.jpg",
      name: "Emma Watson",
      title: "Managing Director",
      socials: {
        twitter: "#",
        instagram: "#",
        linkedin: "#",
      },
    },
    {
      image:
        "https://i.pinimg.com/736x/cf/59/12/cf59123d6980a5d64db47bfbec349648.jpg",
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
    <main className="w-full px-4 md:px-16 py-10 space-y-20">
      <section
        aria-labelledby="our-story-title"
        className="flex flex-col lg:flex-row gap-10 items-center"
      >
        <div className="flex-1 lg:w-1/2 space-y-6">
          <h2
            id="our-story-title"
            className="text-3xl font-bold text-[#1A2238]"
          >
            Our Story
          </h2>
          <p className="text-gray-700 text-sm leading-7">
            Launched in 2015, Exclusive is South Asia’s premier online shopping
            marketplace with an active presence in Bangladesh. Supported by a
            wide range of tailored marketing, data, and service solutions,
            Exclusive has over 10.5k sellers and 45.5k active customers. Our
            mission is to empower sellers and delight customers.
            <br />
            <br />
            Exclusive is a part of the Ecom Group, one of the leading global
            e-commerce platforms known for innovation and strategic digital
            market dominance.
          </p>
        </div>
        <div className="flex-1 lg:w-1/2 flex justify-center">
          <div className="w-[350px] h-[350px] relative rounded-lg overflow-hidden">
            <img
              src="/assets/images/store.png"
              alt="Illustration representing Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="statistics-title" className="overflow-hidden">
        <h3 id="statistics-title" className="sr-only">
          Statistics
        </h3>

        <motion.div
          className="flex space-x-6 min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
        >
          {stats.map((item, index) => (
            <InformationCard key={`first-${index}`} {...item} />
          ))}

          {stats.map((item, index) => (
            <InformationCard key={`second-${index}`} {...item} />
          ))}
        </motion.div>
      </section>

      <section aria-labelledby="staff-title">
        <h2
          id="staff-title"
          className="text-3xl font-bold text-[#1A2238] mb-8 text-center"
        >
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {staff.map((person, index) => (
            <StaffCard key={index} {...person} />
          ))}
        </div>
      </section>

      <section aria-labelledby="features-title">
        <h2
          id="features-title"
          className="text-3xl font-bold text-[#1A2238] mb-8 text-center"
        >
          Why Choose Us
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 my-5 justify-center items-center">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default About;
