import React, { useEffect, useState, useRef, use } from "react";
import { BiHeart, BiSearch } from "react-icons/bi";
import { LuShoppingCart } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import ProfilePopup from "./ProfilePopup";
import Alert from "./Alert";
import useAuth from "hooks/useAuth";
import useCart from "hooks/useCart";
import supabase from "utils/supabase";
import useWishlist from "hooks/useWishlist";
import { useNavigate } from "react-router";

const Header = () => {
  const { user, logout } = useAuth();
  const { getCart } = useCart();
  const { getWishlist } = useWishlist();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "info" | "danger" | "warning"
  >("info");

  const navigate = useNavigate();

  const [showProfilePopupDesktop, setShowProfilePopupDesktop] = useState(false);
  const [showProfilePopupMobile, setShowProfilePopupMobile] = useState(false);
  const profileRefDesktop = useRef<HTMLDivElement | null>(null);
  const profileRefMobile = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCartAndWishlist = async () => {
      if (user?.id) {
        const [cartRes, wishlistRes] = await Promise.all([
          getCart(user.id),
          getWishlist(user.id),
        ]);
        if (!cartRes.err && cartRes.data) setCartCount(cartRes.data.length);
        if (!wishlistRes.err && wishlistRes.data)
          setWishlistCount(wishlistRes.data.length);
      } else {
        const guestCart = localStorage.getItem("guest_cart");
        const guestWishlist = localStorage.getItem("guest_wishlist");
        setCartCount(guestCart ? JSON.parse(guestCart).length : 0);
        setWishlistCount(guestWishlist ? JSON.parse(guestWishlist).length : 0);
      }
    };

    loadCartAndWishlist();

    if (!user?.id) return;

    const cartSub = supabase
      .channel("public:cart")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const { data, err } = await getCart(user.id);
          if (!err && data) setCartCount(data.length);
        }
      )
      .subscribe();

    const wishlistSub = supabase
      .channel("public:wishlist")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist",
          filter: `user_id=eq.${user.id}`,
        },
        async () => {
          const { data, err } = await getWishlist(user.id);
          if (!err && data) setWishlistCount(data.length);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cartSub);
      supabase.removeChannel(wishlistSub);
    };
  }, [user]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    if (user?.user_metadata) {
      setUserProfile(user.user_metadata.avatar_url);
    } else {
      setUserProfile("");
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        profileRefDesktop.current &&
        !profileRefDesktop.current.contains(event.target)
      ) {
        setShowProfilePopupDesktop(false);
      }
      if (
        profileRefMobile.current &&
        !profileRefMobile.current.contains(event.target)
      ) {
        setShowProfilePopupMobile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length > 3) {
      localStorage.setItem("productToSearch", trimmedQuery);
      navigate(`/user/products?query=${encodeURIComponent(trimmedQuery)}`);
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
            alt="Logo"
            className="w-10 h-10 object-contain dark:hidden"
          />
          <img
            src="/assets/images/logo.svg"
            alt="Logo"
            className="w-10 h-10 object-contain hidden dark:block"
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
                      : "text-gray-700 dark:text-white"
                  }`}
                >
                  {item.tab}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden sm:flex items-center gap-6 relative">
          <div className="bg-white/20 dark:bg-gray-700 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded-lg flex items-center gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search product"
              className="flex-1 bg-transparent focus:outline-none text-sm text-black dark:text-white"
              aria-label="Search products"
            />
            <button
              onClick={handleSearch}
              className="text-gray-600 dark:text-white hover:text-[#007BFF] transition-colors"
              aria-label="Search"
            >
              <BiSearch size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/user/wishlist"
              className="relative text-gray-600 dark:text-white hover:text-[#007BFF]"
            >
              <BiHeart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>
            <a
              href="/user/cart"
              className="relative text-gray-600 dark:text-white hover:text-[#007BFF]"
            >
              <LuShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </a>
            <div className="relative" ref={profileRefDesktop}>
              <button
                className="text-gray-600 dark:text-white hover:text-[#007BFF]"
                aria-label="Profile"
                onClick={() =>
                  setShowProfilePopupDesktop(!showProfilePopupDesktop)
                }
              >
                {userProfile ? (
                  <img
                    src={userProfile}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <CgProfile size={24} />
                )}
              </button>
              {showProfilePopupDesktop && (
                <div className="absolute top-10 right-0 z-50">
                  <ProfilePopup
                    isOpen={showProfilePopupDesktop}
                    onClose={() => setShowProfilePopupDesktop(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 dark:text-white"
          >
            {mobileMenuOpen ? (
              <HiOutlineX size={28} />
            ) : (
              <HiOutlineMenuAlt3 size={28} />
            )}
          </button>
          <div className="relative" ref={profileRefMobile}>
            <button
              onClick={() => setShowProfilePopupMobile(!showProfilePopupMobile)}
              className="text-gray-700 dark:text-white"
              aria-label="Profile"
            >
              {userProfile ? (
                <img
                  src={userProfile}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <CgProfile size={24} />
              )}
            </button>
            {showProfilePopupMobile && (
              <div className="absolute top-10 right-0 z-50">
                <ProfilePopup
                  isOpen={showProfilePopupMobile}
                  onClose={() => setShowProfilePopupMobile(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div className="md:hidden px-0 pb-4">
            <ul className="flex flex-col gap-4 text-gray-700 dark:text-white text-sm font-medium">
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
            <div className="bg-white/20 dark:bg-gray-700 hover:shadow-md transition-shadow duration-200 p-2 px-4 rounded flex border dark:border-white/20 items-center gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search product"
                className="flex-1 bg-transparent focus:outline-none text-sm text-black dark:text-white"
                aria-label="Search products"
              />
              <button
                onClick={handleSearch}
                className="text-gray-600 dark:text-white hover:text-[#007BFF] transition-colors"
                aria-label="Search"
              >
                <BiSearch size={25} />
              </button>
            </div>
            <div className="flex items-center justify-around text-gray-600 dark:text-white relative">
              <a
                href="/user/wishlist"
                className="relative"
                aria-label="Wishlist"
              >
                <BiHeart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </a>
              <a href="/user/cart" className="relative" aria-label="Cart">
                <LuShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DC3545] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
