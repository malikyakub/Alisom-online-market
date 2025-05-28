import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, X } from "lucide-react";

type Props = {
  orderId: string;
  onClose: () => void;
  onSave?: (trackingNumber: string, orderId: string) => void;
};

const ShippingInfoModel: React.FC<Props> = ({ orderId, onClose, onSave }) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl text-center max-w-md w-full text-gray-900 dark:text-gray-100"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <Truck className="text-blue-600 dark:text-blue-400 w-16 h-16" />
        </motion.div>

        <h2 className="text-xl font-bold mb-2">Shipping Details</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Rakaab - Delivery Company
        </p>

        <input
          type="text"
          placeholder="Enter Tracking Number"
          className="w-full p-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-blue-900 dark:text-blue-100 font-mono mb-4"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />

        <button
          onClick={() => {
            if (onSave) {
              onSave(trackingNumber, orderId);
            } else {
              console.log(
                `Tracking #${trackingNumber} saved for Order ${orderId}`
              );
            }
            onClose();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Save
        </button>
      </motion.div>
    </div>
  );
};

export default ShippingInfoModel;
