import React, { useEffect, useState, useRef } from "react";
import { BiHeart, BiSearch } from "react-icons/bi";
import { LuShoppingCart } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import ProfilePopup from "./ProfilePopup";
import Alert from "./Alert";
import useAuth from "hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "danger" | "warning"
  >("info");

  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setAlertTitle("Signed out");
      setAlertMessage("You have been signed out successfully.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage(error.message || "Failed to sign out.");
      setAlertType("danger");
      setAlertOpen(true);
    }
  };

  const navItems = [
    { tab: "Home", link: "/" },
    { tab: "Contact", link: "/contact" },
    { tab: "About", link: "/about" },
    { tab: "Shop", link: "/user/products" },
    user
      ? { tab: "Signout", link: "#", action: handleSignOut }
      : { tab: "Signup", link: "/signup" },
  ];

  return (
    <header className="w-full relative">
      <Alert
        title={alertTitle}
        description={alertMessage}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <div className="max-w-[1170px] mx-auto py-4 px-6 flex items-center justify-between gap-6">
        <a href="/">
          <img
            src="/assets/images/logo.svg"
            alt="Company Logo"
            className="w-10 h-10 object-contain"
          />
        </a>

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-6 text-sm sm:text-base font-medium">
            {navItems.map((item) => (
              <li key={item.tab}>
                <a
                  href={item.link}
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault();
                      item.action();
                    }
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer hover:text-[#007BFF] transition-colors ${
                    currentPath === item.link
                      ? "text-[#007BFF] underline underline-offset-4"
                      : "text-gray-700"
                  }`}
                >
                  {item.tab}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden sm:flex items-center gap-6 relative">
          <div className="bg-white/20 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded-lg flex items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search product"
              className="flex-1 bg-transparent focus:outline-none text-sm"
              aria-label="Search products"
            />
            <button
              onClick={handleSearch}
              className="text-gray-600 hover:text-[#007BFF] transition-colors"
              aria-label="Search"
            >
              <BiSearch size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/user/wishlist"
              className="text-gray-600 hover:text-[#007BFF]"
              aria-label="Wishlist"
            >
              <BiHeart size={24} />
            </a>

            <a
              href="/user/cart"
              className="text-gray-600 hover:text-[#007BFF] relative"
              aria-label="Cart"
            >
              <LuShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>

            <div className="relative" ref={profileRef}>
              <button
                className="text-gray-600 hover:text-[#007BFF]"
                aria-label="Profile"
                onClick={() => setShowProfilePopup(!showProfilePopup)}
              >
                <CgProfile size={24} />
              </button>
              {showProfilePopup && (
                <div className="absolute top-10 right-0 z-50">
                  <ProfilePopup />
                </div>
              )}
            </div>
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
        <>
          <div className="md:hidden px-6 pb-4">
            <ul className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.tab}>
                  <a
                    href={item.link}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`cursor-pointer hover:text-[#007BFF] transition-colors ${
                      currentPath === item.link
                        ? "text-[#007BFF] underline underline-offset-4"
                        : ""
                    }`}
                  >
                    {item.tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:hidden px-6 my-4 flex flex-col gap-4">
            <div className="bg-white/20 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded flex border items-center gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search product"
                className="flex-1 bg-transparent focus:outline-none text-sm"
                aria-label="Search products"
              />
              <button
                onClick={handleSearch}
                className="text-gray-600 hover:text-[#007BFF] transition-colors"
                aria-label="Search"
              >
                <BiSearch size={25} />
              </button>
            </div>

            <div className="flex items-center justify-around text-gray-600">
              <a href="/user/wishlist" aria-label="Wishlist">
                <BiHeart size={24} />
              </a>
              <a href="/user/cart" className="relative" aria-label="Cart">
                <LuShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
              <button
                onClick={() => setShowProfilePopup(!showProfilePopup)}
                aria-label="Profile"
              >
                <CgProfile size={24} />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
