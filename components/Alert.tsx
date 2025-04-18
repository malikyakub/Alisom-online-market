import React, { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertProps {
  title: string;
  description: string;
  type?: "success" | "warning" | "danger" | "info";
  isOpen: boolean;
  onClose?: () => void;
}

const alertColors: Record<string, string> = {
  success: "bg-[#28A745]",
  warning: "bg-[#FFC107]",
  danger: "bg-[#DC3545]",
  info: "bg-[#007BFF]",
};

const alertIcons: Record<string, JSX.Element> = {
  success: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08-.02L11.03 8l-1.06-1.06-2.47 2.47L6.97 7.97 5.91 9.03l1.06 1.06z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1-2.002 0 1 1 0 0 1 2.002 0z" />
    </svg>
  ),
  danger: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.707c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1-2.002 0 1 1 0 0 1 2.002 0z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM8.93 4.588a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM8 6a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4A.5.5 0 0 1 8 6z" />
    </svg>
  ),
};

const Alert: React.FC<AlertProps> = ({
  title,
  description,
  type = "info",
  isOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-4 rounded-lg shadow-lg min-w-[300px] flex items-center gap-4 text-white ${alertColors[type]}`}
        >
          <div>{alertIcons[type]}</div>
          <div className="flex-1">
            <strong className="block text-white font-semibold">{title}</strong>
            <p className="text-white text-sm">{description}</p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-white text-xl leading-none focus:outline-none"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
