import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type Props = {
  onClose: () => void;
};

const UnderDevelopmentModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl text-center max-w-md w-full text-gray-900 dark:text-gray-100"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex justify-center mb-4"
        >
          <AlertTriangle className="text-yellow-500 w-16 h-16" />
        </motion.div>

        <h2 className="text-xl font-bold mb-2">Section Under Development</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This section is still under development.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 text-lg font-mono text-yellow-700 dark:text-yellow-200 mb-2 border border-gray-300 dark:border-gray-700">
          613673734
        </div>

        <div className="mb-6 text-lg">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Please reach out to the developer.
          </span>
        </div>

        <button
          onClick={onClose}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded transition"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
};

export default UnderDevelopmentModal;
