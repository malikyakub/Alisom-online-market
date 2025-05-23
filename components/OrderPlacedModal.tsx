import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Props = {
  onClose: () => void;
};

const OrderPlacedModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900 p-8 rounded-xl shadow-xl text-center max-w-md w-full text-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle2 className="text-green-500 w-16 h-16" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2 text-white">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-400 mb-6">
          Thank you for your purchase. You will receive a confirmation email
          shortly.
        </p>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default OrderPlacedModal;
