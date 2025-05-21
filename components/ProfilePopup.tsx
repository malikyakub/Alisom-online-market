import React, { useEffect, useState } from "react";
import { FaUser, FaRegStar } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router";
import useAuth from "hooks/useAuth";
import useUsers from "hooks/useUsers";

interface ProfilePopupProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ProfilePopup = ({ isOpen = false, onClose }: ProfilePopupProps) => {
  if (!isOpen) return null;

  const { user, logout } = useAuth();
  const { GetUserById } = useUsers();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        const res = await GetUserById(user.id);
        setFullname(res.data.fullname);
        setIsAdmin(res.data?.role === "Admin");
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      onClose?.();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    {
      label: !user ? "My account" : isAdmin ? "Dashboard" : fullname,
      icon: <FaUser className="text-xl" />,
      onClick: () =>
        handleNavigate(
          !user ? "/login" : isAdmin ? "/admin/dashboard" : "/user/account"
        ),
    },
    {
      label: "My orders",
      icon: <RiShoppingBagLine className="text-xl" />,
      onClick: () => handleNavigate("/user/orders"),
    },
    {
      label: "My reviews",
      icon: <FaRegStar className="text-xl" />,
      onClick: () => handleNavigate("/user/reviews"),
    },
    {
      label: user ? "Logout" : "Login",
      icon: <LuLogOut className="text-xl" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div
      className="w-56 rounded-md bg-[#1a2238be] backdrop-blur-2xl p-3 flex flex-col gap-2 shadow-lg"
      role="menu"
      aria-label="Profile menu"
    >
      {menuItems.map((item, idx) => (
        <button
          key={idx}
          onClick={item.onClick}
          className="flex items-center gap-3 px-2 py-2 text-sm text-white hover:bg-white/10 rounded transition-colors duration-150 group"
        >
          <span className="group-hover:text-[#007BFF]">{item.icon}</span>
          <span className="group-hover:text-[#007BFF]">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ProfilePopup;
