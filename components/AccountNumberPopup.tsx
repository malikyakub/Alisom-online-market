import React from "react";
import { motion } from "framer-motion";
import { Banknote } from "lucide-react";

type Props = {
  accountNumber: string;
  total: number;
  onClose: () => void;
};

const AccountNumberModal: React.FC<Props> = ({
  accountNumber,
  total,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <Banknote className="text-blue-600 w-16 h-16" />
        </motion.div>

        <h2 className="text-xl font-bold mb-2">Payment Instructions</h2>
        <p className="text-gray-600 mb-4">Send the total amount to:</p>

        <div className="bg-gray-100 rounded-md p-4 text-lg font-mono text-gray-800 mb-2">
          {accountNumber}
        </div>
        <div className="mb-6 text-lg">
          <span className="font-semibold">Total:</span>{" "}
          <span className="font-mono text-blue-700">
            {total.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
};

export default AccountNumberModal;
