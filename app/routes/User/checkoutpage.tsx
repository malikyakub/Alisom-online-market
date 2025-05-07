import React from "react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Billing Details */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
          <form className="space-y-4">
            {[
              { label: "First Name", required: true },
              { label: "Company Name" },
              { label: "Street Address", required: true },
              {
                label: "Apartment, floor, etc.",
                optional: true,
                optionalText: "(optional)",
              },
              { label: "Town/City", required: true },
              { label: "Phone Number", required: true },
              { label: "Email Address", required: true },
            ].map((field, index) => (
              <div className="flex flex-col space-y-1" key={index}>
                <label className="font-medium text-sm">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500">*</span>
                  )}
                  {field.optional && (
                    <span className="text-gray-400 ml-1">
                      {field.optionalText}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 p-2 rounded text-sm focus:outline-none"
                />
              </div>
            ))}

            <label className="accent-green-300 inline-flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Save this information for faster check-out next time
            </label>
          </form>
        </div>
           
            {/* Order Summary */}
<div className="w-full self-start mt-16 md:mt-25 flex justify-end font-bold">
  <div className="w-full max-w-sm space-y-5 p-0">
    {/* Product 1: LCD Monitor */}
    <div className="flex items-start justify-between">
      <h3 className="text-sm text-gray-800 font-semibold">LCD Monitor</h3>
      <p className="text-sm text-gray-800 font-semibold">$650</p>
    </div>

    {/* Product 2: H1 Gamepad */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src="https://i.pinimg.com/736x/7a/b5/0b/7ab50bee9fb17378f428d8dc5c9bb530.jpg"
          alt=""
          className="w-14 h-14 object-cover rounded"
        />
        <div>
          <h3 className="text-sm text-gray-800 font-semibold">H1 Gamepad</h3>
        </div>
      </div>
      <p className="text-sm text-gray-800 font-semibold">$1100</p>
    </div>

    <hr className="border-gray-300" />

    {/* Totals */}
    <div className="text-sm space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span className="text-gray-900 font-semibold">$1750</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping:</span>
        <span className="text-green-500 font-medium">Free</span>
      </div>
      <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
        <span>Total:</span>
        <span>$1750</span>
      </div>
    </div>

    {/* Payment Options */}
    <div className="accent-green-300 space-y-3 text-sm pt-2">
      {["EVC Plus", "E-dahab", "Cash on Delivery"].map((method, idx) => (
        <label key={idx} className="accent-green-300 flex items-center space-x-2">
          <input
            type="radio"
            name="payment"
            defaultChecked={method === "Cash on Delivery"}
            className="scale-125 accent-green-300 "
           />

          <span className="text-gray-700">{method}</span>
        </label>
      ))}
    </div>

    {/* Coupon Input */}
    <div className="flex items-center space-x-2 pt-2">
      <input
        type="text"
        placeholder="Coupon Code"
        className="flex-1 border border-gray-300 p-2 rounded text-sm"
      />
      <button className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
        Apply Coupon
      </button>
    </div>

    {/* Place Order Button */}
    <button className="w-45 bg-blue-600 text-white py-2 text-sm font-semibold rounded hover:bg-blue-700 mt-2">
      Place Order
    </button>
  </div>
</div>



     
        </div>
      </div>
  
  );
}
