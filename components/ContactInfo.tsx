import React from "react";
import { FiPhoneCall, FiMail } from "react-icons/fi";

const ContactInfo = () => {
  return (
    <div className="mx-auto p-6 bg-white dark:bg-white/10 shadow-md space-y-6 h-full">
      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 bg-[#17C3B2] dark:bg-[#007BFF] rounded-full text-white text-2xl">
            <FiPhoneCall />
          </div>
          <h2 className="text-lg font-semibold text-[#1A2238] dark:text-white">
            Call To Us
          </h2>
        </div>
        <div>
          <p className="text-sm text-[#333333] dark:text-gray-300">
            We are available 24/7, 7 days a week.
          </p>
          <p className="font-semibold text-[#1A2238] dark:text-white">
            +252 610 000 000
          </p>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-500" />

      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 bg-[#17C3B2] dark:bg-[#007BFF] rounded-full text-white text-2xl">
            <FiMail />
          </div>
          <h2 className="text-lg font-semibold text-[#1A2238] dark:text-white">
            Write To Us
          </h2>
        </div>
        <div>
          <p className="text-sm text-[#333333] dark:text-gray-300">
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p className="font-semibold text-[#1A2238] dark:text-white">
            support@alisom.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
