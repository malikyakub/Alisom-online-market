import React, { useEffect, useState, useRef } from "react";
import PlaceOrderSummary from "components/PlaceOrderSummary";
import OrderPlacedModal from "components/OrderPlacedModal";
import AccountNumberModal from "components/AccountNumberPopup";
import Alert from "components/Alert";
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
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { GetUserById } = useUsers();
  const { GetProductById } = useProducts();
  const { getCart, isLoading, clearCart } = useCart();
  const [selectedShippingType, setSelectedShippingType] = useState<
    "Delivery" | "Pickup"
  >("Delivery");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDesc, setAlertDesc] = useState("");
  const tempQuantitiesRef = useRef<number[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const { data, err } = await GetUserById(user.id);
      if (data && !err) {
        setFullname(data.fullname || "");
        setAddress(data.address || "");
        setCity(data.City || "");
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

  const handleAfterAccountModal = async () => {
    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const { data, err } = await createOrder({
      fullname: fullname ?? "",
      address: address ?? "",
      city: city ?? "",
      phone: phone ?? "",
      email: email ?? "",
      total_price: totalAmount,
      shipping: selectedShippingType ?? "",
      items: orderItems,
      is_Guest: !user,
    });

    if (err || !data) {
      console.error("Error creating order:", err);
      setAlertType("danger");
      setAlertTitle("Order Failed");
      setAlertDesc("There was an issue placing your order. Please try again.");
    } else {
      setShowOrderPlaced(true);
      await clearCart(user?.id);
    }

    setShowAccountPopup(false);
  };

  const totalAmount = purchasedProducts.reduce((acc, product) => {
    return acc + product.price * (product.quantity || 1);
  }, 0);

  return (
    <div className="relative py-10">
      <Alert
        title={alertTitle}
        description={alertDesc}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      {showAccountPopup && (
        <AccountNumberModal
          total={totalAmount}
          accountNumber={
            selectedPayment == "EVC Plus" ? "613673734" : "622675734"
          }
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

      {!isLoading && purchasedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-1.5 7.5M17 13l1.5 7.5M9 21h6"
            />
          </svg>
          <p className="text-gray-500 text-center text-lg">
            Your cart is empty. Add some products to continue.
          </p>
        </div>
      ) : (
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
              selectedShippingType={selectedShippingType}
              setSelectedShippingType={setSelectedShippingType}
              onPlaceOrder={() => setShowAccountPopup(true)}
              loading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
