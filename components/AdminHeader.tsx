import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";
import { BsMoon } from "react-icons/bs";

type AdminHeaderProps = {
  onToggleTheme?: () => void;
};

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  const navLinks = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Categories", link: "/admin/categories" },
    { name: "Products", link: "/admin/products" },
    { name: "Orders", link: "/admin/orders" },
    { name: "Customers", link: "/admin/customers" },
  ];

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <header className="w-full backdrop-blur-md max-w-[1170px] mx-auto text-[#1A2238] dark:text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10">
            <a href="/">
              <img
                src="/assets/images/logo.svg"
                alt="logo"
                className="object-contain"
              />
            </a>
          </div>

          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  className={`hover:text-[#007BFF] dark:hover:text-blue-400 transition-colors duration-150 ${
                    currentPath === item.link
                      ? "text-[#007BFF] dark:text-blue-400 underline underline-offset-4"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded-lg items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search product"
              className="bg-transparent focus:outline-none border-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Search products"
            />
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-blue-400 transition-colors"
              aria-label="Search"
            >
              <BiSearch size={20} />
            </button>
          </div>


          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-2 text-sm font-medium">
            {navLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                    currentPath === item.link
                      ? "text-[#007BFF] dark:text-blue-400 underline underline-offset-4"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 px-4 rounded-lg flex items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search product"
              className="bg-transparent flex-1 focus:outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Search products"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
