import React from "react";

type PaymentApprovalModalProps = {
  onApprove: () => void;
  onCancel: () => void;
  customerName: string;
  amount: string;
  phone: string;
};

const PaymentApprovalModal: React.FC<PaymentApprovalModalProps> = ({
  onApprove,
  onCancel,
  customerName,
  amount,
  phone,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
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

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Approve payment for {customerName}'s order
        </h2>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Did you receive {amount} at
          </p>
          <p className="text-xl font-bold text-green-500">{phone}</p>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onApprove}
            className="flex-grow min-w-[140px] bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Approve payment
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-grow min-w-[140px] bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
          >
            Deny payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentApprovalModal;
