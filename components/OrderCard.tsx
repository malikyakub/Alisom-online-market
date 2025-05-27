import React, { useState } from "react";
import AccountNumberModal from "components/AccountNumberPopup";
import Alert from "components/Alert";
import useOrders from "hooks/useOrders";

type OrderCardProps = {
  order: {
    Order_id: string;
    Status: "Pending" | "Approved" | "Denied";
    shipping_status?: "Delivered" | "Canceled" | "Pickup" | "Shipped" | null;
    Shipping?: string | null;
    total_price?: string | null;
    created_at?: string | null;
    Full_name?: string | null;
    Email?: string | null;
    Address?: string | null;
    City?: string | null;
    tracking_number?: string | null;
  };
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Approved":
    case "Delivered":
      return "bg-[#28A745]/40 text-[#28A745]";
    case "Pending":
    case "Pickup":
      return "bg-[#FFC107]/40 text-[#FFC107]";
    case "Denied":
    case "Canceled":
      return "bg-[#DC3545]/40 text-[#DC3545]";
    case "Shipped":
      return "bg-[#007BFF]/40 text-[#007BFF]";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const formatDateDDMMYYYY = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const OrderCard = ({ order }: OrderCardProps) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { updateOrderStatusAndAdjustStock } = useOrders();

  const displayStatus = order.shipping_status ?? order.Status;
  const statusClass = getStatusStyles(displayStatus);
  const isPickup = order.Shipping === "Pickup";

  const handleDeniedClick = async () => {
    const { data, err } = await updateOrderStatusAndAdjustStock(
      order.Order_id,
      "Pending"
    );
    if (err) {
      setShowAlert(true);
      return;
    }
    if (data) {
      setShowAlert(true);
    }
    setShowAlert(false);
    setShowAccountModal(true);
  };

  const handleAccountModalClose = () => {
    setShowAccountModal(false);
    setShowAlert(true);
  };

  return (
    <>
      <div className="flex flex-col hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded shadow-md p-4 w-full bg-white dark:bg-gray-900 text-black dark:text-white space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {order.created_at
              ? formatDateDDMMYYYY(order.created_at)
              : "Date N/A"}
          </h3>
          <div className="flex items-center space-x-2">
            {displayStatus === "Denied" ? (
              <button onClick={handleDeniedClick}>
                <span
                  className={`inline-block font-semibold text-sm rounded px-3 py-2 ${statusClass}`}
                >
                  {displayStatus}
                </span>
              </button>
            ) : (
              <span
                className={`inline-block font-semibold text-sm rounded px-3 py-2 ${statusClass}`}
              >
                {displayStatus}
              </span>
            )}
            {isPickup && (
              <span className="inline-block font-semibold text-sm rounded px-3 py-2 bg-[#FFC107]/40 text-[#FFC107]">
                Pickup
              </span>
            )}
          </div>
        </div>

        {order.Full_name && (
          <p>
            <strong>Name:</strong> {order.Full_name}
          </p>
        )}
        {order.Email && (
          <p>
            <strong>Email:</strong> {order.Email}
          </p>
        )}
        {(order.Address || order.City) && (
          <p>
            <strong>Address:</strong> {order.Address}, {order.City}
          </p>
        )}
        {order.total_price && (
          <p>
            <strong>Total:</strong>{" "}
            <span className="text-[#17C3B2]">
              ${parseFloat(order.total_price).toFixed(2)}
            </span>
          </p>
        )}

        {order.tracking_number && (
          <div className="pt-2 mt-2 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
            For delivery info contact: <strong>{order.tracking_number}</strong>
          </div>
        )}
      </div>

      {showAccountModal && (
        <AccountNumberModal
          total={order.total_price ? parseFloat(order.total_price) : 0}
          accountNumber="613673734"
          onClose={handleAccountModalClose}
        />
      )}

      <Alert
        title="Notice"
        description="Trying to reconfirm the Payment"
        type="info"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
      />
    </>
  );
};

export default OrderCard;
