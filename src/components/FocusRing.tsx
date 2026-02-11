import { motion } from "framer-motion";

interface FocusRingProps {
  score: number; // 0-100
  size?: number;
}

const FocusRing = ({ score, size = 200 }: FocusRingProps) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const getScoreColor = () => {
    if (score >= 75) return "hsl(var(--sp-green))";
    if (score >= 50) return "hsl(var(--sp-amber))";
    return "hsl(var(--sp-red))";
  };

  const getScoreLabel = () => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs attention";
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full animate-pulse-ring"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          background: `radial-gradient(circle, ${getScoreColor()}20, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.5}
        />
        {/* Score ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>

      {/* Center content */}
      <motion.div
        className="absolute flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <span className="sp-stat-value" style={{ color: getScoreColor() }}>
          {score}
        </span>
        <span className="sp-stat-label mt-0.5">{getScoreLabel()}</span>
      </motion.div>
    </div>
  );
};

export default FocusRing;
