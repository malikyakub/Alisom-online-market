import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Heading from "components/Heading";
import CategoryCard from "components/CategoryCard";
import HerCard from "components/HerCard";

import {
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaTv,
  FaCamera,
  FaGamepad,
  FaWatchmanMonitoring,
  FaPrint,
  FaHdd,
  FaPlug,
} from "react-icons/fa";
import { MdHome, MdWork, MdWifi, MdSecurity } from "react-icons/md";
import { GiCookingPot, GiWashingMachine } from "react-icons/gi";

const CARD_WIDTH = 180;
const GAP = 16;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [canNext, setCanNext] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [visibleCards, setVisibleCards] = useState(5);

  const categories = [
    { icon: FaLaptop, text: "Laptop" },
    { icon: FaMobileAlt, text: "Smartphone" },
    { icon: FaHeadphones, text: "Audio" },
    { icon: FaTv, text: "TV" },
    { icon: FaCamera, text: "Camera" },
    { icon: FaGamepad, text: "Gaming" },
    { icon: FaWatchmanMonitoring, text: "Wearable" },
    { icon: MdHome, text: "Home" },
    { icon: GiCookingPot, text: "Kitchen" },
    { icon: MdWork, text: "Office" },
    { icon: FaPrint, text: "Printer" },
    { icon: FaHdd, text: "Storage" },
    { icon: FaPlug, text: "Accessory" },
    { icon: MdWifi, text: "Network" },
    { icon: MdSecurity, text: "Security" },
    { icon: GiWashingMachine, text: "Appliance" },
  ];

  const totalWidth = categories.length * (CARD_WIDTH + GAP);
  const maxOffset = 0;
  const minOffset = -(totalWidth - visibleCards * (CARD_WIDTH + GAP));

  const handleNext = () => {
    setX((prev) => {
      const next = Math.max(prev - (CARD_WIDTH + GAP), minOffset);
      setCanPrev(true);
      setCanNext(next > minOffset);
      return next;
    });
  };

  const handlePrev = () => {
    setX((prev) => {
      const next = Math.min(prev + (CARD_WIDTH + GAP), maxOffset);
      setCanNext(true);
      setCanPrev(next < maxOffset);
      return next;
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const cards = Math.floor(width / (CARD_WIDTH + GAP));
        setVisibleCards(cards);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="p-5 flex flex-col gap-10">
      <HerCard />

      <Heading
        title="Categories"
        subtitle="Browse By Category"
        variant="arrows"
        onNext={canNext ? handleNext : undefined}
        onPrev={canPrev ? handlePrev : undefined}
      />

      <div
        className="overflow-hidden w-full pb-8 border-b border-[#1A2238]"
        ref={containerRef}
      >
        <motion.div
          className="flex gap-4"
          animate={{ x }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              text={category.text}
              onSelect={() => console.log("Selected:", category.text)}
            />
          ))}
        </motion.div>
      </div>
      <Heading
        title="This Month"
        subtitle="Best Selling Products"
        variant="button"
      />
    </div>
  );
}
