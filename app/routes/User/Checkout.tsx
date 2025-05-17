import React, { useState } from "react";
import PlaceOrderSummary from "components/PlaceOrderSummary";
import OrderPlacedModal from "components/OrderPlacedModal";

type Product = {
  title: string;
  price: number;
  image?: string;
};

const Checkout: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const purchasedProducts: Product[] = [
    {
      title: "H1 Gamepad",
      price: 1100,
      image:
        "https://i.pinimg.com/736x/7a/b5/0b/7ab50bee9fb17378f428d8dc5c9bb530.jpg",
    },
    {
      title: "Wireless Keyboard",
      price: 200,
      image:
        "https://m.media-amazon.com/images/I/71V--WZVUIL._AC_UF1000,1000_QL80_.jpg",
    },
  ];

  return (
    <div className="relative">
      {showModal && <OrderPlacedModal onClose={() => setShowModal(false)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          Home / Shop /{" "}
          <span className="text-black font-semibold">Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                  {field.required && <span className="text-red-500">*</span>}
                  {field.optional && (
                    <span className="text-gray-400 ml-1">
                      {field.optionalText}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-100 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <label className="accent-green-300 inline-flex items-center text-sm">
              <input type="checkbox" className="mr-2 accent-green-500" />
              Save this information for faster check-out next time
            </label>
          </form>
        </div>

        <div className="w-full self-start mt-10 flex justify-center lg:justify-end font-bold">
          <PlaceOrderSummary
            products={purchasedProducts}
            onPlaceOrder={() => setShowModal(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
