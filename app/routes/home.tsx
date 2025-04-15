import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import CategoryCard from "components/CategoryCard";
import ProductCard from "components/ProductCard";
import { IoStorefrontSharp } from "react-icons/io5";
import { RiComputerFill } from "react-icons/ri";
import { CgSmartphone } from "react-icons/cg";
import InformationCard from "components/InformationCard";
import { CiDollar } from "react-icons/ci";
import ProductDetailsCard from "components/ProductDetailsCard";
import TotalCard from "components/TotalCard";
import ProductCard2 from "components/ProductCard2";
import ProfilePopup from "components/ProfilePopup";
import DashboardCard from "components/DashboardCard";
import { FiBox, FiDollarSign } from "react-icons/fi";
import StaffCard from "components/Staffcard";

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

const products = [
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

export default function Home() {
  return (
    <div className="min-h-screen p-5 flex flex-col gap-10">
      {/* Categories */}
      <div className="flex flex-row items-center gap-4 flex-wrap">
        <CategoryCard icon={RiComputerFill} text="Computers" />
        <CategoryCard icon={CgSmartphone} text="SmartPhones" />
      </div>

      {/* Product Cards */}
      <div className="flex flex-row items-center gap-4 flex-wrap">
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

      {/* Information Cards */}
      <div className="flex flex-row items-center gap-4 flex-wrap">
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
          label="Monthly Product Sale"
          iconBgColor="#1A2238"
          textColor="#1A2238"
        />
      </div>

      {/* TotalCard */}
      <div className="flex flex-row items-center gap-4 flex-wrap">
        <div className="w-full md:w-[320px]">
          <TotalCard />
        </div>
      </div>
      {/* ProductCard2 */}

      <div className="flex flex-row items-center gap-4 flex-wrap">
        <div className="mt-6">
          <ProductCard2
            image="https://i.pinimg.com/474x/69/95/67/699567b89b880a8ea5cfd3ccb9ee8071.jpg"
            name="CANON EOS DSLR Camera"
            price={360}
            rating={4}
            reviews={95}
          />
        </div>
        <div className="mt-6">
          <ProductCard2
            image="https://i.pinimg.com/736x/36/70/5e/36705ec9917ce4b400898fd8bd53eeda.jpg"
            name="ASUS FHD Gaming Laptop"
            price={700}
            rating={5}
            reviews={325}
          />
        </div>
        <div>
          <div className="mt-6">
            <ProductCard2
              image="https://i.pinimg.com/736x/a2/46/89/a24689a207646ccfb0b878a007f115d8.jpg"
              name="Curology Product Set"
              price={500}
              rating={5}
              reviews={145}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 flex-wrap">
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
      <div className="flex flex-row gap-4">
        <StaffCard
          image="https://i.pinimg.com/736x/0d/91/d7/0d91d7b01edad7276029d89550d14942.jpg"
          name="huwei"
          title="wireless earbuds"
          socials={{
            twitter: "#",
            instagram: "#",
            linkedin: "#",
          }}
        />
      </div>
      <ProfilePopup />
    </div>
  );
}
