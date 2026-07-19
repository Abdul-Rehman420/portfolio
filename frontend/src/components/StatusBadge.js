'use client';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';

const StatusBadge = () => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-r-full py-2 pl-3 pr-4 cursor-default"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
      </span>
      <IoCheckmarkCircle className="text-[#22c55e]" size={14} />
      <span className="text-xs font-medium text-[#22c55e] whitespace-nowrap">Available for projects</span>
    </motion.div>
  );
};

export default StatusBadge;
