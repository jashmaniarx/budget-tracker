import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6,
        delay: 2,
        type: "spring",
        stiffness: 100
      }}
      className="fixed bottom-6 right-6 z-50 pointer-events-none"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-brand backdrop-blur border border-white/20"
      >
        <span className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span>Budget Tracker by Jash Maniar</span>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default FloatingBadge;