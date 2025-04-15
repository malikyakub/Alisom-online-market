import React from "react";
import { FaUser } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

const ProfilePopup = () => {
  return (
    <div className="bg-[#1a2238be] flex flex-col gap-3 p-3 backdrop-blur-2xl w-[225px] rounded">
      <div className="group flex flex-row text-white items-center gap-2 cursor-pointer">
        <FaUser className="text-2xl group-hover:text-[#007BFF]" />
        <h1>Manage my account</h1>
      </div>
      <div className="group flex flex-row text-white items-center gap-2 cursor-pointer">
        <RiShoppingBagLine className="text-2xl group-hover:text-[#007BFF]" />
        <h1>My order</h1>
      </div>
      <div className="group flex flex-row text-white items-center gap-2 cursor-pointer">
        <MdOutlineCancel className="text-2xl group-hover:text-[#007BFF]" />
        <h1>My cancellations</h1>
      </div>
      <div className="group flex flex-row text-white items-center gap-2 cursor-pointer">
        <FaRegStar className="text-2xl group-hover:text-[#007BFF]" />
        <h1>My reviews</h1>
      </div>
      <div className="group flex flex-row text-white items-center gap-2 cursor-pointer">
        <LuLogOut className="text-2xl group-hover:text-[#007BFF]" />
        <h1>Logout</h1>
      </div>
    </div>
  );
};

export default ProfilePopup;
