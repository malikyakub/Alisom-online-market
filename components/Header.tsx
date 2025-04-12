import React, { useState } from "react";
import logo from "../public/assets/images/logo.png";
import { BiSearch } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { LuShoppingCart } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState("Home");
  const [cartCount, setCartCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ["Home", "Contact", "About", "Signup"];

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1170px] mx-auto py-4 px-6 flex items-center justify-between gap-6">
        <img
          src={logo}
          alt="Company Logo"
          className="w-10 h-10 object-contain"
        />

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-6 text-sm sm:text-base font-medium">
            {navItems.map((item) => (
              <li
                key={item}
                className={`cursor-pointer hover:text-[#007BFF] transition-colors ${
                  page === item
                    ? "text-[#007BFF] underline underline-offset-4"
                    : "text-gray-700"
                }`}
                onClick={() => setPage(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden sm:flex items-center gap-6">
          <div className="bg-gray-100 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded-lg flex items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search product"
              className="flex-1 bg-transparent focus:outline-none text-sm"
              aria-label="Search products"
            />
            <button
              className="text-gray-600 hover:text-[#007BFF] transition-colors"
              aria-label="Search"
            >
              <BiSearch size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-600 hover:text-[#007BFF] transition-colors relative"
              aria-label="Wishlist"
            >
              <CiHeart size={24} />
            </button>

            <button
              className="text-gray-600 hover:text-[#007BFF] transition-colors relative"
              aria-label="Cart"
            >
              <LuShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="text-gray-600 hover:text-[#007BFF] transition-colors"
              aria-label="Profile"
            >
              <CgProfile size={24} />
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <HiOutlineX size={28} />
            ) : (
              <HiOutlineMenuAlt3 size={28} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
            {navItems.map((item) => (
              <li
                key={item}
                className={`cursor-pointer hover:text-[#007BFF] transition-colors ${
                  page === item
                    ? "text-[#007BFF] underline underline-offset-4"
                    : ""
                }`}
                onClick={() => {
                  setPage(item);
                  setMobileMenuOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-4">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search product"
                className="flex-1 bg-transparent focus:outline-none text-sm"
                aria-label="Search products"
              />
              <button
                className="text-gray-600 hover:text-[#007BFF] transition-colors"
                aria-label="Search"
              >
                <BiSearch size={20} />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button
                className="text-gray-600 hover:text-[#007BFF]"
                aria-label="Wishlist"
              >
                <CiHeart size={24} />
              </button>

              <button
                className="text-gray-600 hover:text-[#007BFF] relative"
                aria-label="Cart"
              >
                <LuShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="text-gray-600 hover:text-[#007BFF]"
                aria-label="Profile"
              >
                <CgProfile size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
