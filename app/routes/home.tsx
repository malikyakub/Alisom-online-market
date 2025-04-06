import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import CategoryCard from "components/categoryCard";
import { RiComputerFill } from "react-icons/ri";
import { CgSmartphone } from "react-icons/cg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-black flex-col items-center justify-center min-h-screen p-4 gap-4">
      <CategoryCard icon={RiComputerFill} text="Computers" />
      <CategoryCard icon={CgSmartphone} text="SmartPhones" />
    </div>
  );
}
