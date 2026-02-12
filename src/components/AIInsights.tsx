import { motion } from "framer-motion";
import { Brain, Lock, TrendingUp, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const heatmapData = [
  [30, 45, 85, 90, 75, 60, 40, 20],
  [25, 50, 80, 88, 70, 65, 45, 25],
  [35, 55, 82, 85, 68, 72, 50, 30],
  [20, 48, 78, 92, 80, 58, 35, 15],
  [40, 60, 88, 95, 72, 55, 42, 28],
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"];

const personalities = [
  { type: "Hyper-Focus Oriented", desc: "You thrive in long, uninterrupted blocks and produce your best work during morning hours.", match: 72, active: false },
  { type: "Balanced", desc: "You naturally alternate between deep work and collaboration, maintaining steady output.", match: 85, active: true },
  { type: "Fragmented but Outcome-Driven", desc: "You context-switch frequently but consistently deliver high-quality results.", match: 45, active: false },
];

const weeklyEvolution = [
  { week: "W1", focus: 62, tasks: 8, label: "Building rhythm" },
  { week: "W2", focus: 68, tasks: 11, label: "Finding flow" },
  { week: "W3", focus: 65, tasks: 14, label: "High delivery" },
  { week: "W4", focus: 74, tasks: 12, label: "Optimized" },
];

const getHeatColor = (val: number) => {
  if (val >= 80) return "bg-sp-green";
  if (val >= 60) return "bg-sp-green/60";
  if (val >= 40) return "bg-sp-amber/50";
  return "bg-muted";
};

const AIInsights = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        className="sp-card-glow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-sp-purple-soft flex items-center justify-center">
            <Brain className="w-5 h-5 text-sp-purple" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Insights</h2>
            <p className="text-xs text-muted-foreground">Learns from you over time</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground italic">
          <Lock className="w-3 h-3" />
          <span>These insights are personal and never shared.</span>
        </div>
      </motion.div>

      {/* Productive Hours Heatmap */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-base font-semibold mb-1">Your Productive Hours</h3>
        <p className="text-xs text-muted-foreground mb-4">When you naturally do your best work this week</p>
        <div className="space-y-1.5">
          {days.map((day, di) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8 font-mono">{day}</span>
              <div className="flex gap-1 flex-1">
                {heatmapData[di].map((val, hi) => (
                  <Tooltip key={hi}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`flex-1 h-7 rounded-md ${getHeatColor(val)} cursor-pointer transition-all hover:scale-105`}
                        style={{ opacity: 0.8 }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.2 + di * 0.05 + hi * 0.02 }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      <p className="font-medium">{day} {hours[hi]}</p>
                      <p>Focus intensity: {val}%</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-1 pl-10">
            {hours.map((h) => (
              <span key={h} className="flex-1 text-[10px] text-muted-foreground text-center">{h}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Work Personality */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-sp-purple" />
          <h3 className="text-base font-semibold">Your Work Personality</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Based on 4 weeks of patterns — no judgment, just understanding</p>
        <div className="space-y-3">
          {personalities.map((p, i) => (
            <motion.div
              key={p.type}
              className={`rounded-xl p-4 border transition-all ${
                p.active
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/50 bg-muted/20"
              }`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${p.active ? "text-primary" : "text-muted-foreground"}`}>
                  {p.type}
                </span>
                <span className={`text-xs font-mono ${p.active ? "text-primary" : "text-muted-foreground"}`}>
                  {p.match}% match
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              {p.active && (
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.match}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Evolution */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-sp-green" />
          <h3 className="text-base font-semibold">Weekly Evolution</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Your growth over time — outcomes matter most</p>
        <div className="grid grid-cols-4 gap-3">
          {weeklyEvolution.map((w, i) => (
            <motion.div
              key={w.week}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="relative mx-auto w-14 h-20 rounded-lg bg-muted/30 overflow-hidden mb-2">
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-sp-green/70 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${w.focus}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{w.tasks}</span>
                </div>
              </div>
              <p className="text-xs font-semibold">{w.week}</p>
              <p className="text-[10px] text-muted-foreground">{w.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic text-center mt-3">
          Bar height = focus score · Number inside = tasks completed
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AIInsights;
