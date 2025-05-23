import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type PaymentApprovalModalProps = {
  onApprove: () => void;
  onDeny: () => void;
  onCancel: () => void;
  customerName: string;
  amount: string;
  phone: string;
  isLoading?: boolean;
};

const PaymentApprovalModal: React.FC<PaymentApprovalModalProps> = ({
  onApprove,
  onCancel,
  onDeny,
  customerName,
  amount,
  phone,
  isLoading = false,
}) => {
  const [clickedButton, setClickedButton] = useState<"approve" | "deny" | null>(
    null
  );

  const handleApprove = () => {
    setClickedButton("approve");
    onApprove();
  };

  const handleDeny = () => {
    setClickedButton("deny");
    onDeny();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="relative bg-white dark:not-visited:bg-[#1A2238] rounded-lg shadow-xl p-6 w-full max-w-md">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
          disabled={isLoading}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-[#1A2238] dark:text-[#F4F4F4] my-6 text-center">
          Approve payment for {customerName}'s order
        </h2>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Did you receive {amount} at
          </p>
          <p className="text-xl font-bold text-green-500">{phone}</p>
        </div>

        <div className="flex flex-row justify-between gap-2">
          <button
            type="button"
            onClick={handleApprove}
            className="flex-1/2 bg-[#007BFF] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading && clickedButton === "approve" ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Approve payment"
            )}
          </button>

          <button
            type="button"
            onClick={handleDeny}
            className="flex-1/2 bg-[#DC3545] text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading && clickedButton === "deny" ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Deny payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentApprovalModal;
