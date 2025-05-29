import React from "react";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

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

      <hr className="border-gray-300 dark:border-gray-500" />

      <div className="flex items-start gap-4 flex-col">
        <div className="flex flex-row items-center gap-2">
          <div className="p-2 bg-[#17C3B2] dark:bg-[#007BFF] rounded-full text-white text-2xl">
            <FiMapPin />
          </div>
          <h2 className="text-lg font-semibold text-[#1A2238] dark:text-white">
            Visit Us
          </h2>
        </div>
        <div>
          <p className="text-sm text-[#333333] dark:text-gray-300">
            Come visit our office at:
          </p>
          <p className="font-semibold text-[#1A2238] dark:text-white">
            Mogadishu, Somalia
          </p>
        </div>
        <div className="w-full h-64 rounded-lg overflow-hidden shadow">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4817.975493841025!2d45.28469117575606!3d2.039832797941831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3d5869f1a28fa34f%3A0x537672eb16b71c57!2sSomali%20National%20University!5e1!3m2!1sen!2sso!4v1748488225950!5m2!1sen!2sso"
            width="100%"
            height="100%"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
