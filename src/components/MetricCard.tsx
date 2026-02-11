import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  variant?: "green" | "amber" | "blue" | "purple";
  delay?: number;
}

const variantClasses: Record<string, string> = {
  green: "sp-badge-green",
  amber: "sp-badge-amber",
  blue: "sp-badge-blue",
  purple: "sp-badge-purple",
};

const MetricCard = ({ icon, label, value, subtitle, variant = "green", delay = 0 }: MetricCardProps) => (
  <motion.div
    className="sp-card flex flex-col gap-3"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="flex items-center justify-between">
      <span className="sp-stat-label">{label}</span>
      <span className={variantClasses[variant]}>{icon}</span>
    </div>
    <div>
      <p className="sp-stat-value">{value}</p>
      {subtitle && <p className="sp-stat-label mt-1">{subtitle}</p>}
    </div>
  </motion.div>
);

export default MetricCard;
