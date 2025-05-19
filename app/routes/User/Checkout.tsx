import React, { useEffect, useState, useRef } from "react";
import PlaceOrderSummary from "components/PlaceOrderSummary";
import OrderPlacedModal from "components/OrderPlacedModal";
import AccountNumberModal from "components/AccountNumberPopup";
import useAuth from "hooks/useAuth";
import useUsers from "hooks/useUsers";
import useProducts from "hooks/useProducts";
import useCart from "hooks/useCart";
import supabase from "utils/supabase";
import useOrders from "hooks/useOrders";

type Product = {
  title: string;
  price: number;
  image?: string;
  quantity?: number;
};

const Checkout: React.FC = () => {
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("EVC Plus");
  const { createOrder, isLoading } = useOrders();
  const { user } = useAuth();
  const { GetUserById } = useUsers();
  const { GetProductById } = useProducts();
  const { getCart } = useCart();

  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const tempQuantitiesRef = useRef<number[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const { data, err } = await GetUserById(user.id);
      if (data && !err) {
        setFullname(data.fullname || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
      }
    };
    fetchUserData();
  }, [user]);

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
          if (err || !productDetails) return null;
          return { ...productDetails, quantity: item.quantity };
        })
      );

      setPurchasedProducts(detailedProducts.filter(Boolean) as Product[]);
    };

    let subscription: ReturnType<typeof supabase.channel> | null = null;

    if (user?.id) {
      fetchCart(user.id);
      subscription = supabase
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
        if (subscription) {
          supabase.removeChannel(subscription);
        }
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
          if (err || !productDetails) return null;
          return { ...productDetails, quantity: item.quantity };
        })
      ).then((results) => {
        setPurchasedProducts(results.filter(Boolean) as Product[]);
      });
    }
  }, [user]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAccountPopup(true);
  };

  const handleAfterAccountModal = () => {
    setShowAccountPopup(false);
    setTimeout(() => {
      setShowOrderPlaced(true);
    }, 100);
  };
  const totalAmount = purchasedProducts.reduce((acc, product) => {
    return acc + product.price * (product.quantity || 1);
  }, 0);

  return (
    <div className="relative px-4 sm:px-8 py-10">
      {showAccountPopup && (
        <AccountNumberModal
          total={totalAmount}
          accountNumber="252612345678"
          onClose={handleAfterAccountModal}
        />
      )}
      {showOrderPlaced && (
        <OrderPlacedModal onClose={() => setShowOrderPlaced(false)} />
      )}

      <div className="text-sm text-gray-500 mb-6">
        Home / Shop /{" "}
        <span className="text-gray-800 font-semibold">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-[#1F2937]">
            Billing Details
          </h2>
          <form className="space-y-5" onSubmit={handleFormSubmit}>
            {[
              {
                label: "Full Name",
                value: fullname,
                setValue: setFullname,
                type: "text",
              },
              {
                label: "Street Address",
                value: address,
                setValue: setAddress,
                type: "text",
              },
              {
                label: "Town/City",
                value: city,
                setValue: setCity,
                type: "text",
              },
              {
                label: "Phone Number",
                value: phone,
                setValue: setPhone,
                type: "tel",
              },
              {
                label: "Email Address",
                value: email,
                setValue: setEmail,
                type: "email",
              },
            ].map(({ label, value, setValue, type }, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ))}

            <label className="inline-flex items-center mt-2 text-sm text-gray-600">
              <input type="checkbox" className="mr-2 accent-green-500" />
              Save this information for faster check-out next time
            </label>

            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-semibold text-sm hover:bg-blue-700 transition"
            >
              Confirm and Continue
            </button>
          </form>
        </div>

        <div className="w-full flex justify-center lg:justify-end">
          <PlaceOrderSummary
            products={purchasedProducts}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onPlaceOrder={() => setShowAccountPopup(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
