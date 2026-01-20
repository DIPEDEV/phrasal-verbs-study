import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Button({ className, variant = "primary", size = "md", children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-lg shadow-primary-500/30",
    secondary: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 focus:ring-slate-200 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-8 py-3.5",
    icon: "p-2",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
