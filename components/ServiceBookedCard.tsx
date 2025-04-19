import React from 'react';

const ServiceBookCard = () => {
  const bookings = [
    { name: 'Ashton Johns', email: 'ashton@gmail.com' },
    { name: 'Marley Hawk', email: 'marley@gmail.com' },
    { name: 'Juliet Dove', email: 'dove@gmail.com' },
    { name: 'Juliet Dove', email: 'dove@gmail.com' },
  ];

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Services booked</h2>
      <p className="mb-4">You have {bookings.length}  you have 2 service bookings today.</p>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index} className="flex justify-between items-center py-2 border-b border-gray-600">
            <div>
              <div>{booking.name}</div>
              <div className="text-sm text-gray-400">{booking.email}</div>
            </div>
            <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              View
            </button>
          </li>
        ))}
      </ul>
     
    </div>
  );
};

export default ServiceBookCard;