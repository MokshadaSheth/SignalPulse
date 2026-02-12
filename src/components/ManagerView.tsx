import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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

const roleInsights = [
  { role: "Developers", fragmentation: "42%", completion: "94%", insight: "High switching but strong delivery" },
  { role: "Designers", fragmentation: "28%", completion: "88%", insight: "Deep focus, fewer context switches" },
  { role: "Marketing", fragmentation: "61%", completion: "91%", insight: "Role naturally involves high switching" },
];

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
          <p className="text-sm font-medium">Privacy by Architecture</p>
          <p className="text-xs text-muted-foreground">All data is anonymized and aggregated. You cannot see individual behavior, app names, or timelines. This is by design.</p>
        </div>
      </motion.div>

      {/* Team Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-4 h-4" />, label: "Team Size", value: "12", badge: "sp-badge-blue" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Avg Focus", value: "68", badge: "sp-badge-green" },
          { icon: <AlertTriangle className="w-4 h-4" />, label: "Fragmentation", value: "34%", badge: "sp-badge-amber" },
          { icon: <CheckCircle2 className="w-4 h-4" />, label: "Task Completion", value: "91%", badge: "sp-badge-green" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="sp-card text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <span className={`${m.badge} mx-auto mb-2`}>{m.icon}</span>
            <p className="sp-stat-value text-2xl">{m.value}</p>
            <p className="sp-stat-label">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Correlation Card - KEY differentiator */}
      <motion.div
        className="sp-card-glow border-primary/20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold">Outcome vs Activity — The Real Story</h3>
        </div>
        <div className="rounded-xl bg-sp-green-soft border border-sp-green/20 p-4">
          <p className="text-sm font-medium text-sp-green">
            ✅ High fragmentation detected, but delivery remains strong.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Task completion rate is 91% despite 34% average fragmentation. Context-switching is role-appropriate and doesn't indicate inefficiency.
          </p>
        </div>
      </motion.div>

      {/* Focus Heatmap */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base font-semibold mb-1">Team Focus Heatmap</h3>
        <p className="sp-stat-label mb-4">Aggregated focus intensity — no individual data</p>

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

      {/* Role-Wise Insights */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-base font-semibold mb-1">Role-Based Team Insights</h3>
        <p className="sp-stat-label mb-4">Compare roles, not people</p>
        <div className="space-y-2">
          {roleInsights.map((r, i) => (
            <motion.div
              key={r.role}
              className="flex items-center gap-4 rounded-xl border border-border/50 p-3"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
            >
              <span className="text-sm font-semibold w-24">{r.role}</span>
              <div className="flex-1 flex items-center gap-3">
                <span className="sp-badge-amber text-xs">Frag: {r.fragmentation}</span>
                <span className="sp-badge-green text-xs">Done: {r.completion}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{r.insight}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        className="sp-card border-sp-blue/20 bg-sp-blue-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-semibold mb-3">Suggested Structural Changes</h3>
        <div className="space-y-2">
          {[
            "Introduce a no-meeting hour 10:00–11:00 when team focus naturally peaks",
            "Consider async standup for Marketing — their fragmentation is role-appropriate",
            "Schedule a team wellness check-in — it improves both morale and focus",
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-sp-blue mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground italic mt-3">
          You are a support system, not an evaluator. These suggestions help your team thrive.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ManagerView;
