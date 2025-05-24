import ProductsAndOrdersHero from "components/ProductsAndOrdersHero";
import React, { useEffect, useState } from "react";
import useOrders from "hooks/useOrders";
import useAuth from "hooks/useAuth";
import OrderCard from "components/OrderCard";

const MyOrders = () => {
  const { user } = useAuth();
  const { getOrdersByUserOrEmail, isLoading } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        const { data, err } = await getOrdersByUserOrEmail(user.id);
        if (!err && data) {
          setOrders(data);
        }
      } else {
        const guestOrderData = localStorage.getItem("guest_order_data");

        if (guestOrderData) {
          try {
            const parsed = JSON.parse(guestOrderData);
            const email = parsed?.email;

            console.log("Extracted guest email:", email);

            if (email) {
              const { data, err } = await getOrdersByUserOrEmail(
                undefined,
                email
              );
              if (!err && data) {
                setOrders(data);
                return;
              }
            }
          } catch (err) {
            console.error("Failed to parse guest order data:", err);
          }
        }

        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  console.log("Orders fetched:", orders);

  return (
    <div className="pb-10 px-4">
      <ProductsAndOrdersHero
        title="My Orders"
        subtitle="Track & view all your orders in one place."
        imageSrc="/assets/images/order-carboard.png"
        gradient="from-gray-900 via-[#1A2238] to-gray-900"
      />

      <div>
        {isLoading ? (
          <p className="text-lg">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="w-full h-screen flex py-4">
            <p className="text-lg text-[#DC3545]">
              {user ? "No orders found." : "No guest orders found."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col my-4 gap-2">
            {orders.map((order, index) => (
              <OrderCard
                key={order.Order_id || `guest_order_${index}`}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
