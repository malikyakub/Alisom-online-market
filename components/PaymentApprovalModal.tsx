import React from 'react';

function PaymentApprovalModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur
">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Approve payment for malik's order
          </h2>
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
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
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-start mb-2">

        </div>
        <p className="text-sm text-gray-500 mb-2 text-center">
  Did you receive $13 at
</p>
<p className="text-xl font-bold text-green-500 mb-4 text-center">
  +252 610000000
</p>

        
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Approve payment
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Deny payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentApprovalModal;