import React from "react";
import { motion } from "framer-motion";

export const AuroraBackground = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`h-full w-full bg-white dark:bg-black relative flex flex-col items-center justify-center ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{
            scale: 1.5,
            opacity: 0.3,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -inset-[100%] opacity-50"
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
        </motion.div>
      </div>
      {children}
    </div>
  );
};

