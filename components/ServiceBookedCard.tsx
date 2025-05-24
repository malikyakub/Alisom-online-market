import React, { useState, useEffect } from "react";

const ServiceBookCard = () => {
  const bookings = [
    { name: "Ashton Johns", email: "ashton@gmail.com" },
    { name: "Marley Hawk", email: "marley@gmail.com" },
    { name: "Juliet Dove", email: "dove@gmail.com" },
    { name: "Juliet Dove", email: "dove@gmail.com" },
  ];

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedBookings = isMobile ? bookings : bookings.slice(0, 2);

  return (
    <div className="w-full rounded-lg shadow-md p-4 flex-1 border border-blue-500 relative">
      <h2 className="text-xl font-semibold text-[#1A2238] dark:text-[#F4F4F4]">
        Services Booked
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        You have {bookings.length} bookings today.
      </p>
      <ul>
        {displayedBookings.map((booking, index) => (
          <li key={index} className="flex justify-between items-center py-2">
            <div>
              <div className="font-medium text-[#1A2238] dark:text-[#F4F4F4]">
                {booking.name}
              </div>
              <div className="text-sm text-gray-500">{booking.email}</div>
            </div>
            <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              View
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 text-blue-500 absolute bottom-4">
        <a href="/bookings" className="hover:underline">
          View more bookings
        </a>
      </div>
    </div>
  );
};

export default ServiceBookCard;
