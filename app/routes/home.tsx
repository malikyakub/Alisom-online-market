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
import ServiceBookCard from "components/ServiceBookedCard";
import ProductFullDetails from "components/Productfulldetails";
import RecentOrders from "components/RecentOrders";

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

const HeroProducts = [
  {
    title: "Apple iPhone 14",
    offer: "Up to $120 off on iPhone 14",
    image: iPhoneImage,
    logo: "/assets/images/apple-logo.png",
    link: "/user/products",
  },
  {
    title: "AirPods Pro (2nd Gen)",
    offer: "Now starting at $199 — limited time!",
    image: Airpods,
    logo: "/assets/images/apple-logo.png",
    link: "/user/products",
  },
  {
    title: "Apple Watch Series 9",
    offer: "Up to 15% off Apple Watch Series 9",
    image: appleWatch,
    logo: "/assets/images/apple-logo.png",
    link: "/user/products",
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-5 flex flex-col gap-10">
      <HerCard products={HeroProducts} />
    </div>
  );
}
