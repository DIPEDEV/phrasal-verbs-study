import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, ...props }) {
  return (
    <motion.div
      className={twMerge("bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
