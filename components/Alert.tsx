import React, { useEffect, useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import successIcon from "/assets/icons/success.png";
import warningIcon from "/assets/icons/warning.png";
import dangerIcon from "/assets/icons/danger.png";
import infoIcon from "/assets/icons/info.png";

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
    <img
      src={successIcon}
      alt="success"
      className="w-8 h-8 drop-shadow-[0_0_2px_white]"
    />
  ),
  warning: (
    <img
      src={warningIcon}
      alt="warning"
      className="w-8 h-8 drop-shadow-[0_0_2px_white]"
    />
  ),
  danger: (
    <img
      src={dangerIcon}
      alt="danger"
      className="w-8 h-8 drop-shadow-[0_0_2px_white]"
    />
  ),
  info: (
    <img
      src={infoIcon}
      alt="info"
      className="w-8 h-8 drop-shadow-[0_0_2px_white]"
    />
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
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-4 rounded-lg shadow-lg w-[20rem] max-w-full flex items-center gap-4 text-white ${alertColors[type]}`}
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
