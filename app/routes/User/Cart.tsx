import React, { useEffect, useRef, useState } from "react";
import ProductDetailsCard from "components/ProductDetailsCard";
import TotalCard from "components/TotalCard";
import useAuth from "hooks/useAuth";
import useCart from "hooks/useCart";
import useProducts from "hooks/useProducts";
import Alert from "components/Alert";
import ClipLoader from "react-spinners/ClipLoader";
import supabase from "utils/supabase";

export default function Cart() {
  const { user } = useAuth();
  const { getCart, isLoading, updateCartItem } = useCart();
  const { GetProductById } = useProducts();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [updating, setUpdating] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertContent, setAlertContent] = useState<{
    type: "info" | "success" | "warning" | "danger";
    title: string;
    description: string;
  }>({
    type: "info",
    title: "Cart Loaded",
    description: "Product details have been successfully loaded.",
  });

  const tempQuantitiesRef = useRef<number[]>([]);

  useEffect(() => {
    const fetchCart = async (userId: string) => {
      const { data, err } = await getCart(userId);
      if (err) return;

      setCartItems(data || []);
      tempQuantitiesRef.current = (data || []).map(
        (item: any) => item.quantity
      );

      const detailedProducts = await Promise.all(
        (data || []).map(async (item: any) => {
          const { data: productDetails, err } = await GetProductById(
            item.product_id
          );
          if (err) return null;
          return { ...productDetails, quantity: item.quantity };
        })
      );

      setCartProducts(detailedProducts.filter(Boolean));
    };

    if (user?.id) {
      fetchCart(user.id);

      const subscription = supabase
        .channel("public:cart")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "cart",
            filter: `user_id=eq.${user.id}`,
          },
          async () => {
            await fetchCart(user.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      const guestCart = localStorage.getItem("guest_cart");
      const items = guestCart ? JSON.parse(guestCart) : [];
      setCartItems(items);
      tempQuantitiesRef.current = items.map((item: any) => item.quantity);

      Promise.all(
        items.map(async (item: any) => {
          const { data: productDetails, err } = await GetProductById(
            item.product_id
          );
          if (err) return null;
          return { ...productDetails, quantity: item.quantity };
        })
      ).then((results) => {
        setCartProducts(results.filter(Boolean));
      });
    }
  }, [user]);

  const handleQuantityTempChange = (index: number, newQty: number) => {
    tempQuantitiesRef.current[index] = newQty;
  };

  const handleUpdateCart = async () => {
    setUpdating(true);

    const updated = cartProducts.map((item, i) => ({
      ...item,
      quantity: tempQuantitiesRef.current[i],
    }));

    setCartProducts(updated);

    for (let i = 0; i < updated.length; i++) {
      const product = updated[i];
      const { err } = await updateCartItem(
        product.product_id,
        product.quantity,
        user?.id
      );
      if (err) {
        setAlertContent({
          type: "danger",
          title: "Update Failed",
          description: `Could not update product ${product.name}`,
        });
        setAlertVisible(true);
        setUpdating(false);
        return;
      }
    }

    setAlertContent({
      type: "success",
      title: "Cart Updated",
      description: "Your cart has been successfully updated.",
    });
    setAlertVisible(true);
    setUpdating(false);
  };

  const subtotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative py-10 px-4 text-gray-900 dark:text-gray-100">
      <Alert
        isOpen={alertVisible}
        onClose={() => setAlertVisible(false)}
        type={alertContent.type}
        title={alertContent.title}
        description={alertContent.description}
      />

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Home / Shop /{" "}
        <span className="text-black dark:text-white font-semibold">Cart</span>
      </div>

      {isLoading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading cart...</p>
      ) : cartProducts.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto mb-4 w-24 h-24 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h12l-2-9m-6 0V6a2 2 0 114 0v7"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Your cart is empty
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Browse products and add them to your cart.
          </p>
          <a
            href="/user/products"
            className="px-6 py-2 border border-[#1A2238] font-bold rounded text-sm text-[#666666] dark:text-gray-300 hover:bg-[#1A2238] dark:hover:bg-[#17C3B2] transition hover:text-white"
          >
            Return to Shop
          </a>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {cartProducts.map((item, index) => (
              <ProductDetailsCard
                key={item.product_id}
                product={item}
                quantity={tempQuantitiesRef.current[index]}
                onQuantityChange={(qty) => handleQuantityTempChange(index, qty)}
              />
            ))}
          </div>

          <div className="flex justify-between my-4">
            <a
              href="/user/products"
              className="px-6 py-2 border border-[#1A2238] font-bold rounded text-sm text-[#666666] dark:text-gray-300 hover:bg-[#1A2238] dark:hover:bg-[#17C3B2] transition hover:text-white"
            >
              Return to Shop
            </a>
            <button
              onClick={handleUpdateCart}
              disabled={updating}
              className="bg-[#007BFF] hover:bg-blue-700 font-bold transition text-white px-6 py-2 rounded text-sm flex items-center gap-2"
            >
              {updating ? <ClipLoader size={16} color="#ffffff" /> : null}
              {updating ? "Updating..." : "Update Cart"}
            </button>
          </div>

          <div className="w-full md:w-1/3">
            <TotalCard subtotal={subtotal} shipping="Free" total={subtotal} />
          </div>
        </>
      )}
    </div>
  );
}
