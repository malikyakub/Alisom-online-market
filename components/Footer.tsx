import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#1A2238] text-white p-8">
      <div className="max-w-[1170px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Exclusive */}
        <div>
          <h2 className="text-xl font-bold mb-4">Exclusive</h2>
          <p className="font-semibold mb-2">Subscribe</p>
          <p className="text-sm mb-4">Get 10% off your first order</p>
          <div className="flex items-center border border-white rounded px-2 py-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-white placeholder-white flex-grow"
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-xl font-bold mb-4">Support</h2>
          <p className="text-sm">
            123 Sample Street, Dharkeynley District, Mogadishu, Somalia
          </p>
          <p className="mt-2">alisommarket@gmail.com</p>
          <p className="mt-1">+252-610-000000</p>
        </div>

        {/* Account */}
        <div>
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <ul className="space-y-2 text-sm">
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        {/* Quick Link */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Link</h2>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <FaFacebookF className="cursor-pointer" />
            <FaTwitter className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-8 border-t border-white pt-4">
        <p>&copy; Copyright Alisom online market 2025. All right reserved</p>
      </div>
    </div>
  );
};

export default Footer;
