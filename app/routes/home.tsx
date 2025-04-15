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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
    <div className="bg-[#17C3B2] flex-row items-center justify-center min-h-screen p-5 gap-8">
      <CategoryCard icon={RiComputerFill} text="Computers" />
      <CategoryCard icon={CgSmartphone} text="SmartPhones" />
      <div className="flex flex-row  items-center flex-wrap">
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
      <div className="flex flex-row  items-center gap-3">
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
        />{" "}
      </div>
      <div className="flex flex-col gap-2 my-4">
        {products.map((prod) => (
          <ProductDetailsCard key={prod.name} product={prod} />
        ))}
      </div>
    </div>
  );
}
