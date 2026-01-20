import { motion } from "framer-motion";

export function ProgressBar({ current, total, label = "Progress" }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="text-primary-600 font-bold">{current} / {total}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
