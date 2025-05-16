import React, { useState } from "react";

interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (newValue: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  description,
  enabled,
  onToggle,
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-2 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
      <button
        className={`relative inline-flex items-center h-6 w-11 transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${
          enabled ? "bg-blue-500" : "bg-gray-300"
        }`}
        onClick={() => onToggle(!enabled)}
      >
        <span className="sr-only">
          {enabled ? "Enable" : "Disable"} {label}
        </span>
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const [generalNotificationsEnabled, setGeneralNotificationsEnabled] =
    useState(true);
  const [weeklyPerformanceSummaryEnabled, setWeeklyPerformanceSummaryEnabled] =
    useState(true);
  const [lowStockNotificationsEnabled, setLowStockNotificationsEnabled] =
    useState(false);

  return (
    <div className="">
      <div className="">
        <div className="border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your store setup and account settings.
            </p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
            Save Changes
          </button>
        </div>

        <div className="">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">General</h2>
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Store Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Alison online market"
              />
            </div>
            <span className="text-xs text-gray-500">
              This is a public name of your store.
            </span>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Data Backup
            </h2>
            <div className="bg-white rounded-md shadow-sm p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <select
                  className="border border-gray-300 py-2 rounded w-full"
                  defaultValue="Monthly"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <button className="bg-gray-200 hover:bg-blue-700 hover:text-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Export Data
              </button>
            </div>
            <span className="text-xs text-gray-500">
              Your last backup has been on 02/24/2025, you can export your data.
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Notifications
            </h2>
            <NotificationToggle
              label="General Notifications"
              description="Receive emails about new orders, customer inquiries, and reviews."
              enabled={generalNotificationsEnabled}
              onToggle={setGeneralNotificationsEnabled}
            />
            <NotificationToggle
              label="Weekly Performance Summary"
              description="Receive emails about your store's performance and analytics."
              enabled={weeklyPerformanceSummaryEnabled}
              onToggle={setWeeklyPerformanceSummaryEnabled}
            />
            <NotificationToggle
              label="Low Stock Notifications"
              description="Receive emails about products running low in stock."
              enabled={lowStockNotificationsEnabled}
              onToggle={setLowStockNotificationsEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
