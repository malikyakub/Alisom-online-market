import React from "react";

export default function DropdownMenu() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-2 w-40 gap-y-1 z-10">
        <button className="text-black font-semibold hover:bg-gray-100 w-full text-left px-2 py-1 rounded">
          Edit
        </button>
        <button className="text-black font-semibold hover:bg-gray-100 w-full text-left px-2 py-1 rounded">
          Copy ID
        </button>
        <button className="flex items-center justify-between bg-red-500 text-white font-bold px-2 py-1 rounded w-full">
          <span>Delete</span>
          <kbd className="text-sm bg-red-400 px-1 py-0.5 rounded ml-2 opacity-70">
            ⌘⌫
          </kbd>
        </button>
      </div>
    </div>
  );
}
