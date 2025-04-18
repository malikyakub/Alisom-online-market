import type { Route } from "./+types/home";
import CategoryCard from "components/CategoryCard";
import FeaturedProductCard from "components/FeaturedProductCard";
import { DiResponsive } from "react-icons/di";
import { IoStorefrontSharp } from "react-icons/io5";
import { RiComputerFill } from "react-icons/ri";
import { CgSmartphone } from "react-icons/cg";
import InformationCard from "components/InformationCard";
import { CiDollar } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";
import ProductDetailsCard from "components/ProductDetailsCard";
import TotalCard from "components/TotalCard";
import ProductCard from "components/ProductCard";
import ProfilePopup from "components/ProfilePopup";
import DashboardCard from "components/DashboardCard";
import { FiBox, FiDollarSign } from "react-icons/fi";
import ProductDropdown from "components/productDropdown";
import StaffCard from "components/Staffcard";
import HerCard from "components/HerCard";
import iPhoneImage from "/assets/images/iphone.png";
import Airpods from "/assets/images/airpods.png";
import appleWatch from "/assets/images/apple-watch.png";
import { useState } from "react";
import { MdPayment } from "react-icons/md";
import AddCategoryModal from "components/AddCategoryModal";
import { PiResizeFill } from "react-icons/pi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Alisom Online market - Online Market for Gadgets and Devices" },
    {
      name: "description",
      content:
        "Explore the latest electronics, gadgets, and devices at unbeatable prices. Shop now at Alisom Electronics!",
    },
    {
      name: "keywords",
      content:
        "electronics, gadgets, smartphones, laptops, computers, online market, Alisom",
    },
    { name: "robots", content: "index, follow" },
  ];
}

const categories = [
  {
    icon: RiComputerFill,
    text: "Computers",
  },
  {
    icon: CgSmartphone,
    text: "Smart phones",
  },
];

const productsInCart = [
  {
    name: "Laoptop",
    price: 200,
    image:
      "https://i.pinimg.com/236x/98/6f/00/986f0030e53505927d45fde3c2115af3.jpg",
  },
  {
    name: "gaming console",
    price: 1200,
    image:
      "https://i.pinimg.com/236x/dd/17/5a/dd175a0d5c42312003026b4e4cad2a44.jpg",
  },
];

const HeroProducts = [
  {
    title: "Apple iPhone 14",
    offer: "Up to $120 off on iPhone 14",
    image: iPhoneImage,
    logo: "/assets/images/apple-logo.png",
    link: "/products/iphone-14",
  },
  {
    title: "AirPods Pro (2nd Gen)",
    offer: "Now starting at $199 — limited time!",
    image: Airpods,
    logo: "/assets/images/apple-logo.png",
    link: "/products/airpods-pro-2",
  },
  {
    title: "Apple Watch Series 9",
    offer: "Up to 15% off Apple Watch Series 9",
    image: appleWatch,
    logo: "/assets/images/apple-logo.png",
    link: "/products/apple-watch-series-9",
  },
];

const featuredProducts = [
  {
    image:
      "https://i.pinimg.com/736x/8c/db/e1/8cdbe123010c380e20f264a8fdd57938.jpg",
    title: "JBL Headphones",
    price: 200,
    rating: 5,
  },
  {
    image:
      "https://i.pinimg.com/736x/62/46/c7/6246c74e3d7d9f2a4d298f911aad9dcf.jpg",
    title: "Oculus",
    price: 20,
    rating: 4,
  },
];

const Products = [
  {
    image:
      "https://i.pinimg.com/736x/8c/db/e1/8cdbe123010c380e20f264a8fdd57938.jpg",
    name: "JBL Headphones",
    price: 200,
    rating: 5,
    reviews: 100,
  },
  {
    image:
      "https://i.pinimg.com/736x/62/46/c7/6246c74e3d7d9f2a4d298f911aad9dcf.jpg",
    name: "Oculus",
    price: 20,
    rating: 4,
    reviews: 56,
  },
];

const informations = [
  {
    icon: TbTruckDelivery,
    title: "Fast Delivery",
    value: "Real-time tracking updates",
  },
  {
    icon: PiResizeFill,
    title: "Mobile Optimization",
    value: "Responsive design for all devices",
  },
  {
    icon: MdPayment,
    title: "Secure Payments",
    value: "Multiple trusted payment methods",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-5 flex flex-col gap-10">
      <HerCard products={HeroProducts} />

      <div className="flex flex-row flex-wrap gap-4 items-center">
        {categories.map((cat, index) => (
          <CategoryCard key={index} icon={cat.icon} text={cat.text} />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-4 items-center">
        {featuredProducts.map((prod, index) => (
          <FeaturedProductCard
            key={index}
            image={prod.image}
            price={prod.price}
            rating={prod.rating}
            title={prod.title}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-4 items-center">
        {Products.map((prod, index) => (
          <ProductCard
            key={index}
            image={prod.image}
            price={prod.price}
            rating={prod.rating}
            name={prod.name}
            reviews={prod.reviews}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-4 items-center">
        {informations.map((info, index) => (
          <InformationCard
            key={index}
            icon={info.icon}
            title={info.title}
            value={info.value}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap gap-4 items-center"></div>
    </div>
  );
}
