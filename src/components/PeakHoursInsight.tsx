import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Brain, Users, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { usePeakHours } from "@/hooks/usePeakHours";

const formatHour = (h: number) => {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
};

const generateInsightText = (
  peakHours: number[],
  view: "team" | string,
  employeeId?: string
) => {
  const peakLabels = peakHours.map(formatHour).join(" and ");
  if (view === "team") {
    return `The team demonstrates peak cognitive focus around ${peakLabels}. This window shows the lowest context-switching and highest sustained work patterns. Scheduling deep work, critical reviews, or design sessions during this time may improve outcomes.`;
  }
  return `Employee ${employeeId} shows strongest focus around ${peakLabels}. Aligning their critical tasks with this natural rhythm could enhance productivity without adding pressure.`;
};

const PeakHoursInsight = () => {
  const { data, loading } = usePeakHours();
  const [view, setView] = useState<"team" | string>("team");

  if (loading) {
    return (
      <div className="sp-card animate-pulse h-64 flex items-center justify-center">
        <BarChart3 className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const isTeamView = view === "team";
  const hourlyScores = isTeamView
    ? data.teamHourlyScores
    : data.employees[view]?.hourlyScores ?? {};
  const peakHours = isTeamView
    ? data.teamPeakHours
    : data.employees[view]?.hours ?? [];

  const chartData = Object.entries(hourlyScores)
    .map(([h, score]) => ({
      hour: Number(h),
      label: formatHour(Number(h)),
      score: Math.round(score * 100),
      isPeak: peakHours.includes(Number(h)),
    }))
    .sort((a, b) => a.hour - b.hour);

  const insightText = generateInsightText(peakHours, view, view !== "team" ? view : undefined);

  return (
    <motion.div
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="sp-card-glow"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sp-purple-soft flex items-center justify-center">
              <Brain className="w-5 h-5 text-sp-purple" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Peak Working Hours</h2>
              <p className="text-xs text-muted-foreground">AI-derived focus intensity by hour</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1">
            <button
              onClick={() => setView("team")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isTeamView ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Team
            </button>
            <button
              onClick={() => setView(data.employeeIds[0] || "team")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !isTeamView ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Employee
            </button>
          </div>
        </div>

        {/* Employee selector */}
        {!isTeamView && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {data.employeeIds.map((id) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  view === id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Chart */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-base font-semibold mb-1">Focus Intensity by Hour</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {isTeamView ? "Averaged across all employees" : `Showing data for ${view}`}
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[60, 80]}
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => `${v}%`}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Focus Score"]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isPeak ? "hsl(var(--sp-green))" : "hsl(var(--sp-blue) / 0.5)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-sp-green" />
            <span className="text-xs text-muted-foreground">Peak Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-sp-blue/50" />
            <span className="text-xs text-muted-foreground">Other Hours</span>
          </div>
        </div>
      </motion.div>

      {/* AI Insight Text */}
      <motion.div
        className="sp-card border-sp-purple/20 bg-sp-purple-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-sp-purple" />
          <h3 className="text-sm font-semibold">AI Insight</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{insightText}</p>
        <p className="text-[10px] text-muted-foreground italic mt-3">
          This insight is derived from aggregated analytics — no individual browsing data is used.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PeakHoursInsight;
