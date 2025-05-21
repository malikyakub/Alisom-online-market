import ProductsAndOrdersHero from "components/ProductsAndOrdersHero";
import React, { useEffect, useState } from "react";
import useOrders from "hooks/useOrders";
import useAuth from "hooks/useAuth";
import OrderCard from "components/OrderCard";

const MyOrders = () => {
  const { user } = useAuth();
  const { getOrdersByUserId, isLoading } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        const { data, err } = await getOrdersByUserId(user.id);
        if (!err) {
          setOrders(data);
        }
      } else {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div>
      <ProductsAndOrdersHero
        title="My Orders"
        subtitle="Track & view all your orders in one place."
        imageSrc="/assets/images/order-carboard.png"
        gradient="from-gray-900 via-gray-800 to-gray-900"
      />
      <div className="container mx-auto mt-10 space-y-6">
        {!user ? (
          <p className="text-lg text-[#FFC107]">
            Please log in to see your Orders.
          </p>
        ) : isLoading ? (
          <p className="text-lg">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-lg text-[#DC3545]">No orders found.</p>
        ) : (
          <div className="flex flex-col gap-y-6">
            {orders.map((order) => (
              <OrderCard key={order.Order_id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
