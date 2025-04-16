import React, { useState } from 'react';

const UserAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white p-10 font-sans">
      {/* Breadcrumb & Welcome (optional UI) */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Home / <span className="text-black font-semibold">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-red-600 font-medium">Mohmoud!</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/4 pr-8">
          <a href="#" className="text-blue-600 font-medium hover:underline">Manage My Account</a>
        </div>

        <div className="bg-white shadow-md rounded p-8 w-3/4">
          <h2 className="text-xl font-semibold mb-6 text-teal-600">Edit Your Profile</h2>

          <form className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">Password Changes</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border p-1 rounded bg-gray-95 focus:bg-[#007BFF33] focus:border-[#007BFF] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" className="text-black font-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
