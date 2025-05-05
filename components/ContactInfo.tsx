import React from "react";
import { FiPhoneCall, FiMail } from "react-icons/fi";

const ContactInfo = () => {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-md space-y-6 h-full">
      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 bg-[#17C3B2] rounded-full text-white text-2xl">
            <FiPhoneCall />
          </div>
          <h2 className="text-lg font-semibold">Call To Us</h2>
        </div>
        <div>
          <p className="text-sm text-[#333333]">
            We are available 24/7, 7 days a week.
          </p>
          <p className="font-semibold text-[#1A2238]">+252 610 000 000</p>
        </div>
      </div>

      <hr />

      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 bg-teal-500 rounded-full text-white text-2xl">
            <FiMail />
          </div>
          <h2 className="text-lg font-semibold">Write To US</h2>
        </div>
        <div>
          <p className="text-sm text-[#333333]">
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p className="font-semibold text-[#1A2238]">support@alisom.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
