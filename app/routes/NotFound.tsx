import React from "react";

const NotFound = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="text-sm text-gray-500">
          Home / <span className="text-black font-semibold">404 Error</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-black mb-4">404 Not Found</h1>
        <p className="text-base text-gray-700 mb-6">
          Your visited page not found. You may go home page.
        </p>
        <button
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => (window.location.href = "/")}
        >
          Back to home page
        </button>
      </div>
    </div>
  );
};

export default NotFound;
