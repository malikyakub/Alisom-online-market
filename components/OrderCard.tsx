import React, { useState } from "react";
import Alert from "components/Alert";
import AccountNumberModal from "components/AccountNumberPopup";

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

const OrderCard = ({ order }: OrderCardProps) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleDeniedClick = () => {
    setShowAccountModal(true);
  };

  const handleAccountModalClose = () => {
    setShowAccountModal(false);
    setShowAlert(true);
  };

  return (
    <>
      <div className="flex hover:bg-[#F4F4F4] transition rounded shadow-md p-4 w-full items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">
            Order ID: {order.Order_id}
          </h3>
          {order.Status === "Denied" ? (
            <button onClick={handleDeniedClick}>
              <span
                className={`inline-block font-semibold text-sm rounded px-3 py-2 mb-2 ${getStatusStyles(
                  order.Status
                )}`}
              >
                {order.Status}
              </span>
            </button>
          ) : (
            <span
              className={`inline-block font-semibold text-sm rounded px-3 py-2 mb-2 ${getStatusStyles(
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
        <div className="flex-1">
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
