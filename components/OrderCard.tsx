import React, { useState } from "react";
import Alert from "components/Alert";
import AccountNumberModal from "components/AccountNumberPopup";
import useOrders from "hooks/useOrders";

type OrderCardProps = {
  order: {
    Order_id: string;
    Status: string;
    total_price?: string | null;
    created_at?: string | null;
    Shipping?: string | null;
    Full_name?: string | null;
    Address?: string | null;
    City?: string | null;
    Phone?: string | null;
    Email?: string | null;
  };
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-[#28A745]/40 text-[#28A745]";
    case "Pending":
      return "bg-[#FFC107]/40 text-[#FFC107]";
    case "Denied":
      return "bg-[#DC3545]/40 text-[#DC3545]";
    default:
      return "bg-gray-400/40 text-gray-400";
  }
};

const formatOrderDateTitle = (createdAt: string | null | undefined) => {
  if (!createdAt) return "Order";
  const date = new Date(createdAt);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const formatted = date.toLocaleDateString(undefined, options); // e.g., May 2
  return `Order-${formatted.replace(" ", "-")}`; // e.g., Order-May-2
};

const OrderCard = ({ order }: OrderCardProps) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { updateOrderStatusAndAdjustStock, isLoading } = useOrders();

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
      <div className="flex flex-col sm:flex-row hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded shadow-md p-3 sm:p-4 w-full items-start sm:items-center bg-white dark:bg-gray-900 text-black dark:text-white space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 text-sm sm:text-base">
          <h3 className="text-base sm:text-lg font-semibold mb-1">
            {formatOrderDateTitle(order.created_at)}
          </h3>
          {order.Status === "Denied" ? (
            <button
              onClick={handleDeniedClick}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <span
                className={`inline-block font-semibold text-xs sm:text-sm rounded px-2 sm:px-3 py-1 sm:py-2 mb-2 ${getStatusStyles(
                  order.Status
                )}`}
              >
                {order.Status}
              </span>
            </button>
          ) : (
            <span
              className={`inline-block font-semibold text-xs sm:text-sm rounded px-2 sm:px-3 py-1 sm:py-2 mb-2 ${getStatusStyles(
                order.Status
              )}`}
            >
              {order.Status}
            </span>
          )}
          <p>
            <strong>Total:</strong> ${order.total_price ?? "N/A"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "N/A"}
          </p>
          {order.Shipping && (
            <p>
              <strong>Shipping:</strong> {order.Shipping}
            </p>
          )}
        </div>
        <div className="flex-1 text-sm sm:text-base">
          {order.Full_name && (
            <p>
              <strong>Name:</strong> {order.Full_name}
            </p>
          )}
          {order.Address && (
            <p>
              <strong>Address:</strong> {order.Address}
            </p>
          )}
          {order.City && (
            <p>
              <strong>City:</strong> {order.City}
            </p>
          )}
          {order.Phone && (
            <p>
              <strong>Phone:</strong> {order.Phone}
            </p>
          )}
          {order.Email && (
            <p>
              <strong>Email:</strong> {order.Email}
            </p>
          )}
        </div>
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
