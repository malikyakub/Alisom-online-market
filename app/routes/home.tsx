import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import useProducts from "hooks/useProducts";
import Heading from "components/Heading";
import CategoryCard from "components/CategoryCard";
import HerCard from "components/HerCard";
import ProductCard from "components/ProductCard";
import ProductCardSkeleton from "components/skeletons/ProductCardSkeleton";

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
  FaCheckCircle,
  FaHeadset,
  FaTruck,
} from "react-icons/fa";
import { MdHome, MdWork, MdWifi, MdSecurity } from "react-icons/md";
import { GiCookingPot, GiWashingMachine } from "react-icons/gi";
import FeatureCard from "components/FeatureCard";

const CARD_WIDTH = 180;
const GAP = 16;
const PRODUCT_CARD_WIDTH = 230;

export default function Home() {
  const categoryRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const [catX, setCatX] = useState(0);
  const [prodX, setProdX] = useState(0);

  const [canCatNext, setCanCatNext] = useState(true);
  const [canCatPrev, setCanCatPrev] = useState(false);
  const [catVisibleCards, setCatVisibleCards] = useState(5);

  const [canProdNext, setCanProdNext] = useState(true);
  const [canProdPrev, setCanProdPrev] = useState(false);
  const [prodVisibleCards, setProdVisibleCards] = useState(3);

  const { GetFeaturedProducts, getFirstTen, isLoading, GetAverageRating } =
    useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

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

  const handleCatNext = () => {
    setCatX((prev) => {
      const totalWidth = categories.length * (CARD_WIDTH + GAP);
      const minOffset = -(totalWidth - catVisibleCards * (CARD_WIDTH + GAP));
      const next = Math.max(prev - (CARD_WIDTH + GAP), minOffset);
      setCanCatPrev(true);
      setCanCatNext(next > minOffset);
      return next;
    });
  };

  const handleCatPrev = () => {
    setCatX((prev) => {
      const next = Math.min(prev + (CARD_WIDTH + GAP), 0);
      setCanCatNext(true);
      setCanCatPrev(next < 0);
      return next;
    });
  };

  const handleProdNext = () => {
    const totalWidth = featuredProducts.length * (PRODUCT_CARD_WIDTH + GAP);
    const minOffset = -(
      totalWidth -
      prodVisibleCards * (PRODUCT_CARD_WIDTH + GAP)
    );

    setProdX((prev) => {
      const next = Math.max(prev - (PRODUCT_CARD_WIDTH + GAP), minOffset);
      setCanProdPrev(true);
      setCanProdNext(next > minOffset);
      return next;
    });
  };

  const handleProdPrev = () => {
    setProdX((prev) => {
      const next = Math.min(prev + (PRODUCT_CARD_WIDTH + GAP), 0);
      setCanProdNext(true);
      setCanProdPrev(next < 0);
      return next;
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (categoryRef.current) {
        const width = categoryRef.current.offsetWidth;
        setCatVisibleCards(Math.floor(width / (CARD_WIDTH + GAP)));
      }
      if (productRef.current) {
        const width = productRef.current.offsetWidth;
        setProdVisibleCards(Math.floor(width / (PRODUCT_CARD_WIDTH + GAP)));
      }
    });

    if (categoryRef.current) resizeObserver.observe(categoryRef.current);
    if (productRef.current) resizeObserver.observe(productRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const now = new Date();

    const enrich = async (p: any) => {
      const createdAt = p.created_at ? new Date(p.created_at) : null;
      const isNew =
        createdAt &&
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 7;

      const { data: ratingData, err: ratingErr } = await GetAverageRating(
        p.product_id
      );
      if (ratingErr) {
        console.warn(`Failed to fetch rating for ${p.product_id}:`, ratingErr);
      }

      return {
        id: p.product_id,
        name: p.name,
        price: p.price,
        oldPrice: p.discount ? Number(p.price) + Number(p.discount) : null,
        brand: p.brand?.name,
        category: p.category?.name,
        image: p.image ?? "",
        badge: p.discount ? `%${p.discount}` : isNew ? "New" : null,
        rating: ratingData?.average ?? null,
        ratingCount: ratingData?.count ?? 0,
      };
    };

    (async () => {
      const [featuredRes, allRes] = await Promise.all([
        GetFeaturedProducts(),
        getFirstTen(),
      ]);

      if (!featuredRes.err && featuredRes.data) {
        const enrichedFeatured = await Promise.all(
          featuredRes.data.map(enrich)
        );
        setFeaturedProducts(enrichedFeatured);
      }
      if (!allRes.err && allRes.data) {
        const enrichedAll = await Promise.all(allRes.data.map(enrich));
        setAllProducts(enrichedAll);
      }
    })();
  }, []);

  return (
    <div className="p-5 flex flex-col gap-10">
      <HerCard />

      <Heading
        title="Categories"
        subtitle="Browse By Category"
        variant="arrows"
        onNext={canCatNext ? handleCatNext : undefined}
        onPrev={canCatPrev ? handleCatPrev : undefined}
      />

      <div
        className="overflow-scroll [&::-webkit-scrollbar]:hidden w-full pb-8 border-b border-[#1A2238]"
        ref={categoryRef}
      >
        <motion.div
          className="flex gap-4"
          animate={{ x: catX }}
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
        variant="arrows"
        onNext={canProdNext ? handleProdNext : undefined}
        onPrev={canProdPrev ? handleProdPrev : undefined}
      />

      <div
        className="overflow-scroll [&::-webkit-scrollbar]:hidden w-full"
        ref={productRef}
      >
        {isLoading ? (
          <motion.div className="flex gap-4">
            {Array(prodVisibleCards)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="min-w-[230px]">
                  <ProductCardSkeleton />
                </div>
              ))}
          </motion.div>
        ) : featuredProducts.length ? (
          <motion.div
            className="flex gap-4"
            animate={{ x: prodX }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {featuredProducts.map((p) => (
              <div key={p.id} className="min-w-[230px]">
                <ProductCard
                  productId={p.id}
                  image={p.image}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  badge={p.badge}
                  featured
                  rating={p.rating}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-white text-center">
            No featured products found.
          </div>
        )}
      </div>

      <Heading
        title="Our Products"
        subtitle="Explore Our Products"
        variant="button"
      />

      <div className="flex flex-wrap gap-4">
        {isLoading
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                >
                  <ProductCardSkeleton />
                </div>
              ))
          : allProducts.map((product) => (
              <div
                key={product.id}
                className="w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              >
                <ProductCard
                  featured={false}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  badge={product.badge}
                  productId={product.id}
                  rating={product.rating}
                />
              </div>
            ))}
      </div>
      <div className="flex justify-center my-6">
        <a
          href="/user/products"
          className="bg-[#007BFF] text-white w-52 text-center py-3 font-bold rounded hover:bg-blue-700 transition"
        >
          View all
        </a>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-8 my-5 justify-center">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
