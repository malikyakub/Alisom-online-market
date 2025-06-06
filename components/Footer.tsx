import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Alert from "./Alert";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "success" | "warning" | "danger" | "info";
  }>({ isOpen: false, title: "", description: "", type: "info" });

  const handleSubscribe = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertInfo({
        isOpen: true,
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        type: "danger",
      });
      return;
    }

    console.log("Subscribed email:", email);

    setAlertInfo({
      isOpen: true,
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
      type: "success",
    });
    setEmail("");
  };

  return (
    <div className="bg-[#1A2238] dark:bg-black/50 text-white p-8">
      <Alert
        isOpen={alertInfo.isOpen}
        type={alertInfo.type}
        title={alertInfo.title}
        description={alertInfo.description}
        onClose={() =>
          setAlertInfo((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />

      <div className="max-w-[1170px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Exclusive</h2>
          <p className="font-semibold mb-2">Subscribe</p>
          <p className="text-sm mb-4">Get 10% off your first order</p>
          <div className="flex items-center border border-white rounded px-2 py-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-white placeholder-white flex-grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubscribe();
                }
              }}
            />
            <button onClick={handleSubscribe} aria-label="Subscribe">
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

        <div>
          <h2 className="text-xl font-bold mb-4">Support</h2>
          <p className="text-sm">
            123 Sample Street, Dharkeynley District, Mogadishu, Somalia
          </p>
          <p className="mt-2">alisommarket@gmail.com</p>
          <p className="mt-1">+252-610-000000</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/User/Account" className="hover:underline">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>{" "}
              /{" "}
              <Link to="/signup" className="hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link to="/User/Cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/User/Wishlist" className="hover:underline">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/User/Products" className="hover:underline">
                Shop
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Quick Link</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-services" className="hover:underline">
                Terms Of Use
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
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
        <p>&copy; Copyright Alisom online market 2025. All rights reserved</p>
      </div>
    </div>
  );
};

export default Footer;
