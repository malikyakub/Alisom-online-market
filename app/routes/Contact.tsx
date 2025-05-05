import ContactInfo from "components/ContactInfo";
import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-500">
          Home / <span className="text-black font-semibold">Contact</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4">
          <ContactInfo />
        </div>
        <div className="bg-white shadow-md rounded p-4 sm:p-6 w-full lg:w-3/4">
          <div className="flex flex-row justify-between items-center gap-2">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border p-2 rounded bg-gray-200 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border p-2 rounded bg-gray-200 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
            />
            <input
              type="text"
              placeholder="Your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 border p-2 rounded bg-gray-200 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
            />
          </div>
          <textarea
            className="w-full h-52 border p-2 rounded bg-gray-200 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none mt-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-4">
            <button className="bg-[#007BFF] px-4 py-2 rounded text-white font-semibold">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
