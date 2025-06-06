import ContactInfo from "components/ContactInfo";
import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Home /{" "}
          <span className="text-black dark:text-white font-semibold">
            Contact
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <ContactInfo />
        </div>

        <div className="bg-white dark:bg-white/10 shadow-md rounded p-4 sm:p-6 w-full lg:w-2/3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border p-3 rounded bg-gray-200 dark:bg-white/5 dark:text-white dark:border-gray-600 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border p-3 rounded bg-gray-200 dark:bg-white/5 dark:text-white dark:border-gray-600 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none w-full"
            />
            <input
              type="text"
              placeholder="Your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 border p-3 rounded bg-gray-200 dark:bg-white/5 dark:text-white dark:border-gray-600 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none w-full"
            />
          </div>

          <textarea
            className="w-full h-3/5 max-h-4/5 min-h-[60px] border p-3 rounded bg-gray-200 dark:bg-white/5 dark:text-white dark:border-gray-600 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none mt-4"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <div className="flex justify-end mt-4">
            <button className="bg-[#007BFF] dark:bg-[#339CFF] px-6 py-3 rounded text-white font-semibold hover:bg-[#0056b3] dark:hover:bg-[#1A75D1] transition">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
