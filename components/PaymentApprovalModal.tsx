import React from "react";

function PaymentApprovalModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <button
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
          Approve payment for Malik's order
        </h2>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">Did you receive $13 at</p>
          <p className="text-xl font-bold text-green-500">+252 610000000</p>
        </div>

        <div className="flex space-x-2">
          <button
            type="button"
            className="flex-grow min-w-[140px] bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
          >
            Approve payment
          </button>
          <button
            type="button"
            className="flex-grow min-w-[140px] bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:bg-red-700 hover:shadow-md active:bg-red-800"
          >
            Deny payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentApprovalModal;
