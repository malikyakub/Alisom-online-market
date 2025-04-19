import React from "react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white py-10 px-6 md:px-20 flex flex-col md:flex-row justify-between gap-10">
      {/* Billing Details */}
      <div className="w-full md:w-1/2">
        <nav className="text-sm text-gray-500 mb-4">
          Account / My Account / Product / View Cart / <span className="font-semibold text-black">CheckOut</span>
        </nav>

        <h2 className="text-2xl font-bold mb-6">Billing Details</h2>

        <form className="space-y-4">
          <input type="text" placeholder="First Name*" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Company Name" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Street Address*" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Apartment, floor, etc. (optional)" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Town/City*" className="w-full border p-2 rounded" />
          <input type="text" placeholder="Phone Number*" className="w-full border p-2 rounded" />
          <input type="email" placeholder="Email Address*" className="w-full border p-2 rounded" />

          <label className="inline-flex items-center mt-2">
            <input type="checkbox" className="form-checkbox mr-2" defaultChecked />
            <span className="text-sm text-gray-700">Save this information for faster check-out next time</span>
          </label>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/2 flex flex-col items-start border p-6 rounded shadow-sm">
        <div className="flex justify-between w-full mb-4">
          <span>LCD Monitor</span>
          <span>$650</span>
        </div>
        <div className="flex justify-between w-full mb-4">
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/60"
              alt="H1 Gamepad"
              className="w-14 h-14 object-cover"
            />
            <span>H1 Gamepad</span>
          </div>
          <span>$1100</span>
        </div>

        <div className="border-t border-b py-2 w-full mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>$1750</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>Total:</span>
            <span>$1750</span>
          </div>
        </div>

        <div className="space-y-2 w-full">
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="form-radio text-blue-600" />
            <span>EVC plus</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="form-radio text-blue-600" />
            <span>E-dahab</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              className="form-radio text-blue-600"
              defaultChecked
            />
            <span>Cash on delivery</span>
          </label>
        </div>

        <div className="flex mt-4 w-full gap-2">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-grow border p-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Apply Coupon</button>
        </div>

        <button className="mt-6 bg-blue-600 text-white w-full py-3 rounded text-lg font-medium">
          Place Order
        </button>
      </div>
    </div>
  );
}  


