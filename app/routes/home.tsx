import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import useProducts from "hooks/useProducts";
import useAuth from "hooks/useAuth";
import useUsers from "hooks/useUsers";
import supabase from "utils/supabase";

import Heading from "components/Heading";
import HerCard from "components/HerCard";
import CategoryCard from "components/CategoryCard";
import ProductCard from "components/ProductCard";
import ProductCardSkeleton from "components/skeletons/ProductCardSkeleton";
import FeatureCard from "components/FeatureCard";

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

const CARD_WIDTH = 180;
const GAP = 16;
const PRODUCT_CARD_WIDTH = 230;

export default function Home() {
  const categoryRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { NewUser } = useUsers();
  const { GetFeaturedProducts, getFirstEight, GetAverageRating } =
    useProducts();

  const [catX, setCatX] = useState(0);
  const [prodX, setProdX] = useState(0);

  const [canCatNext, setCanCatNext] = useState(true);
  const [canCatPrev, setCanCatPrev] = useState(false);
  const [catVisibleCards, setCatVisibleCards] = useState(5);
  const [canProdNext, setCanProdNext] = useState(true);
  const [canProdPrev, setCanProdPrev] = useState(false);
  const [prodVisibleCards, setProdVisibleCards] = useState(3);

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

  const enrichProduct = async (p: any) => {
    const now = new Date();
    const createdAt = p.created_at ? new Date(p.created_at) : null;
    const isNew =
      createdAt &&
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 7;

    const { data: ratingData, err: ratingErr } = await GetAverageRating(
      p.product_id
    );
    if (ratingErr)
      console.warn(`Failed to fetch rating for ${p.product_id}:`, ratingErr);

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

  const { data: featuredProducts = [], isLoading: loadingFeatured } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const res = await GetFeaturedProducts();
      if (res.err) throw new Error("Failed to fetch featured products");
      return Promise.all((res.data ?? []).map(enrichProduct));
    },
  });

  const { data: allProducts = [], isLoading: loadingAll } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await getFirstEight();
      if (res.err) throw new Error("Failed to fetch all products");
      return Promise.all((res.data ?? []).map(enrichProduct));
    },
  });

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
    const checkAndRegisterUser = async () => {
      if (!user?.user_metadata?.name) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Failed to fetch user data:", error);
          return;
        }

        if (!data) {
          const newUserData = {
            user_id: user.id,
            fullname: user.user_metadata.name,
            email: user.email,
            phone: user.user_metadata.phone || "",
            address: user.user_metadata.address || "",
            avatar_url: user.user_metadata.avatar_url || "",
          };

          const { err } = await NewUser(newUserData);
          if (err) console.error("Failed to register user:", err);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    checkAndRegisterUser();
  }, [user]);

  const handleCatNext = () => {
    const totalWidth = categories.length * (CARD_WIDTH + GAP);
    const minOffset = -(totalWidth - catVisibleCards * (CARD_WIDTH + GAP));
    setCatX((prev) => {
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
        {loadingFeatured ? (
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
                  badge={p.badge ?? undefined}
                  featured
                  rating={p.rating != null ? Number(p.rating) : undefined}
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
        {loadingAll
          ? Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-full xs:w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                >
                  <ProductCardSkeleton />
                </div>
              ))
          : allProducts.map((product) => (
              <div
                key={product.id}
                className="w-full xs:w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              >
                <ProductCard
                  featured={false}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  badge={product.badge ?? undefined}
                  productId={product.id}
                  rating={
                    product.rating != null ? Number(product.rating) : undefined
                  }
                />
              </div>
            ))}
      </div>

      <div className="flex justify-center my-6">
        <a
          href="/user/products"
          className="w-full sm:w-52 bg-[#007BFF] text-white text-center py-3 font-bold rounded hover:bg-blue-700 transition"
        >
          View all
        </a>
      </div>

      <hr className="dark:text-white" />

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 my-5 justify-center items-center">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
