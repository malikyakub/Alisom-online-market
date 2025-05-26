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
import ClipLoader from "react-spinners/ClipLoader";
import useEmails from "hooks/useEmails";

type Product = {
  name: string;
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
  const { getCart, clearCart } = useCart();
  const { ApprovePayment } = useEmails();
  const [selectedShippingType, setSelectedShippingType] = useState<
    "Delivery" | "Pickup"
  >("Delivery");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "danger">("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDesc, setAlertDesc] = useState("");
  const tempQuantitiesRef = useRef<number[]>([]);

  // Fetch full user data on mount or user change
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

    if (user) {
      fetchUserData();
    } else {
      const storedData = localStorage.getItem("checkout_form_data");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setFullname(parsed.fullname || "");
        setAddress(parsed.address || "");
        setCity(parsed.city || "");
        setPhone(parsed.phone || "");
        setEmail(parsed.email || "");
      }
    }
  }, [user]);

  // Fetch cart and detailed products
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

  // Save form data locally if user chooses to save info
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && saveInfo) {
      const formData = { fullname, address, city, phone, email };
      localStorage.setItem("checkout_form_data", JSON.stringify(formData));
    }
    setShowAccountPopup(true);
  };

  // Helper to fetch full order including items & product info
  async function getOrder(order_id: string) {
    const { data: order, error: orderError } = await supabase
      .from("Orders")
      .select("*")
      .eq("Order_id", order_id)
      .single();

    if (orderError) throw new Error(orderError.message);

    const { data: items, error: itemsError } = await supabase
      .from("Order_items")
      .select("*, products(name, price)")
      .eq("order_id", order_id);

    if (itemsError) throw new Error(itemsError.message);

    return { ...order, items };
  }

  // After user confirms account/payment, create order and send approval email
  const handleAfterAccountModal = async () => {
    const orderItems = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const { data, err } = await createOrder({
      user_id: user?.id,
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
      setAlertType("danger");
      setAlertTitle("Order Failed");
      setAlertDesc("There was an issue placing your order. Please try again.");
      setAlertOpen(true);
    } else {
      try {
        const orderId = data.Order_id;
        if (orderId) {
          // Fetch full order with items & product details
          const fullOrder = await getOrder(orderId);
          // Pass full order object to ApprovePayment
          const { data: emailHtml, err: emailErr } = await ApprovePayment(
            fullOrder
          );
          if (!emailErr && emailHtml) {
            console.log("Payment Approval Email HTML:\n", emailHtml);
          }
        }
      } catch (e) {
        console.log("Error in sending email: ", e);
      }

      setShowOrderPlaced(true);

      if (!user) {
        const guestOrderData = {
          fullname,
          address,
          city,
          phone,
          email,
          total_price: totalAmount,
          shipping: selectedShippingType,
          items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(
          "guest_order_data",
          JSON.stringify(guestOrderData)
        );
      }

      await clearCart(user?.id);
    }

    setShowAccountPopup(false);
    setTimeout(() => {
      // window.history.back();
    }, 3000);
  };

  const totalAmount = purchasedProducts.reduce((acc, product) => {
    return acc + product.price * (product.quantity || 1);
  }, 0);

  return (
    <div className="relative py-10 px-4 text-gray-800 dark:text-gray-100 min-h-screen">
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
            selectedPayment === "EVC Plus" ? "613673734" : "622675734"
          }
          onClose={handleAfterAccountModal}
        />
      )}

      {showOrderPlaced && (
        <OrderPlacedModal onClose={() => setShowOrderPlaced(false)} />
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Home / Shop /{" "}
        <span className="text-[#1A2238] dark:text-white font-semibold">
          Checkout
        </span>
      </div>

      {!isLoading && purchasedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-gray-300 dark:text-gray-600 mb-4"
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
          <p className="text-gray-500 dark:text-gray-400 text-center text-lg">
            Your cart is empty. Add some products to continue.
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#1F2937] dark:text-white">
            Billing Details
          </h2>

          <div className="flex flex-col-reverse lg:flex-row gap-10">
            <div className="w-full">
              <form className="space-y-3" onSubmit={handleFormSubmit}>
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
                ].map(({ label, value, setValue, type }) => (
                  <div key={label} className="flex flex-col">
                    <label
                      htmlFor={label}
                      className="font-medium text-gray-900 dark:text-gray-200"
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      id={label}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>
                ))}

                {!user && (
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      id="save-info"
                    />
                    <label
                      htmlFor="save-info"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Save my information for next time
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-3 px-6 rounded mt-4 hover:bg-indigo-700 focus:outline-none"
                >
                  Place Order
                </button>
              </form>
            </div>

            <PlaceOrderSummary
              loading={isLoading}
              products={purchasedProducts}
              selectedShippingType={selectedShippingType}
              setSelectedShippingType={setSelectedShippingType}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ClipLoader color="#fff" size={50} />
        </div>
      )}
    </div>
  );
};

export default Checkout;
