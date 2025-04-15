import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import CategoryCard from "components/CategoryCard";
import ProductCard from "components/ProductCard";
import { IoStorefrontSharp } from "react-icons/io5";
import { RiComputerFill } from "react-icons/ri";
import { TbDeviceAirpodsCase } from "react-icons/tb";
import { CgSmartphone } from "react-icons/cg";
import InformationCard from "components/InformationCard";
import { CiDollar } from "react-icons/ci";
import TotalCard from "components/TotalCard";
import DashboardCard from "components/DashboardCard";
import { FiBox, FiDollarSign } from "react-icons/fi";

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

export default function Home() {
  return (
    <div className="min-h-screen p-5 flex flex-col gap-10">
      <div className="flex flex-row items-center gap-4">
        <CategoryCard icon={TbDeviceAirpodsCase} text="Wearables" />
        <CategoryCard icon={CgSmartphone} text="SmartPhones" />
      </div>

      <div className="flex flex-row flex-wrap items-center  gap-4">
        <ProductCard
          image="https://i.pinimg.com/736x/ee/3e/4c/ee3e4c0c619248199d6cef77294db156.jpg"
          title="laptop"
          price="400"
          rating={6}
        />
        <ProductCard
          image="https://i.pinimg.com/474x/13/a9/9c/13a99cc7ae16f759b9a9ec6ffad1591a.jpg"
          title="iphone 16 pro"
          price="200"
          rating={4}
        />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-4">
        <InformationCard
          icon={IoStorefrontSharp}
          value="10.5k"
          label="Sellers active on our site"
          iconBgColor="#1A2238"
          textColor="#1A2238"
        />
        <InformationCard
          icon={CiDollar}
          value="33k"
          label="Monthly Produduct Sale"
          iconBgColor="#1A2238"
          textColor="#1A2238"
        />
      </div>
      <div className="flex ">
        <div className="w-full md:w-[320px]">
          <TotalCard />
        </div>
      </div>
      <div className=" flex flex-row gap-4 ">
          <DashboardCard
            title="Total Revenue"
            amount="$32,875"
            growth="+20.1% from last month"
            icon={FiDollarSign}
          /> 
          <DashboardCard
            title="Products Sold"
            amount="$8,294"
            growth="+180.1% from last month"
            icon={FiBox}
          /> 
        </div>
    </div>
  );
}