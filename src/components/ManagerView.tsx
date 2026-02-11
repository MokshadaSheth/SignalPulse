import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const teamHeatmap = [
  { period: "9–10", focus: 45, label: "Low" },
  { period: "10–11", focus: 82, label: "High" },
  { period: "11–12", focus: 78, label: "High" },
  { period: "12–1", focus: 30, label: "Break" },
  { period: "1–2", focus: 60, label: "Medium" },
  { period: "2–3", focus: 75, label: "High" },
  { period: "3–4", focus: 55, label: "Medium" },
  { period: "4–5", focus: 40, label: "Low" },
];

const getHeatColor = (focus: number) => {
  if (focus >= 70) return "bg-sp-green";
  if (focus >= 50) return "bg-sp-amber";
  return "bg-sp-blue";
};

const ManagerView = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Privacy Banner */}
      <motion.div
        className="flex items-center gap-3 rounded-2xl bg-sp-green-soft border border-sp-green/20 p-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Shield className="w-5 h-5 text-sp-green flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Privacy-First Team View</p>
          <p className="text-xs text-muted-foreground">All data is anonymized and aggregated. No individual tracking.</p>
        </div>
      </motion.div>

      {/* Team Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users className="w-4 h-4" />, label: "Team Size", value: "12", badge: "sp-badge-blue" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Avg Focus Score", value: "68", badge: "sp-badge-green" },
          { icon: <AlertTriangle className="w-4 h-4" />, label: "Fragmentation", value: "34%", badge: "sp-badge-amber" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="sp-card text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <span className={`${m.badge} mx-auto mb-2`}>{m.icon}</span>
            <p className="sp-stat-value text-2xl">{m.value}</p>
            <p className="sp-stat-label">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Focus Heatmap */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-1">Team Focus Heatmap</h3>
        <p className="sp-stat-label mb-4">Aggregated focus intensity throughout the day</p>

        <div className="grid grid-cols-8 gap-2">
          {teamHeatmap.map((slot, i) => (
            <Tooltip key={slot.period}>
              <TooltipTrigger asChild>
                <motion.div
                  className="flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <div
                    className={`w-full rounded-lg ${getHeatColor(slot.focus)} transition-all cursor-pointer hover:opacity-80`}
                    style={{ height: `${Math.max(slot.focus * 0.8, 20)}px`, opacity: 0.7 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{slot.period}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                <p className="font-medium">{slot.label} Focus</p>
                <p>Team Score: {slot.focus}%</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </motion.div>

      {/* Insight */}
      <motion.div
        className="sp-card border-sp-amber/30 bg-sp-amber-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-sp-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">High fragmentation detected across team</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider introducing a no-meeting hour between 10:00–11:00 when team focus naturally peaks.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManagerView;
