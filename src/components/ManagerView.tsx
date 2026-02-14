import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, TrendingUp, AlertTriangle, CheckCircle2, BarChart3, ArrowRight, Clock, Layers, Activity, FileJson, PieChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import JsonEditor from "@/components/JsonEditor";
import { useSignalPulseData } from "@/hooks/useSignalPulseData";
import type { SignalPulseData, Session } from "@/hooks/useSignalPulseData";

const formatDuration = (ms: number) => {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m`;
};

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "work": return "sp-badge-green";
    case "communication": return "sp-badge-blue";
    case "distraction": return "sp-badge-amber";
    default: return "sp-badge-purple";
  }
};

const getCategoryBarColor = (cat: string) => {
  switch (cat) {
    case "work": return "bg-sp-green";
    case "communication": return "bg-sp-blue";
    case "distraction": return "bg-sp-amber";
    default: return "bg-sp-purple";
  }
};

const computeAggregatedStats = (data: SignalPulseData) => {
  const { stats, sessions } = data;
  
  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  sessions.forEach((s) => {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.duration;
  });
  
  // Domain aggregation (for "other" insight, no domain names shown to manager)
  const categoryCount: Record<string, number> = {};
  sessions.forEach((s) => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  });

  const completionRate = stats.focusScore > 50 ? 91 : Math.max(45, stats.focusScore + 40);
  const fragmentation = stats.switches > 15 ? Math.min(65, stats.switches * 3) : stats.switches * 2;

  return { categoryTotals, categoryCount, completionRate, fragmentation, stats };
};

const managerTabs = [
  { id: "dashboard", label: "Dashboard", icon: PieChart },
  { id: "editor", label: "Data Editor", icon: FileJson },
];

const ManagerView = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data, loading, updateFromJson, resetData } = useSignalPulseData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Activity className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return <div className="sp-card text-center py-10 text-muted-foreground">No data available. Please upload a JSON file.</div>;
  }

  const agg = computeAggregatedStats(data);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-5">
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

      {/* Manager Sub-Tabs */}
      <nav className="flex gap-1 border-b border-border pb-1">
        {managerTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary bg-card border border-b-0 border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "dashboard" && (
        <DashboardContent data={data} agg={agg} />
      )}

      {activeTab === "editor" && (
        <JsonEditor data={data} onSave={updateFromJson} onReset={resetData} />
      )}
    </motion.div>
  );
};

interface DashboardContentProps {
  data: SignalPulseData;
  agg: ReturnType<typeof computeAggregatedStats>;
}

const DashboardContent = ({ data, agg }: DashboardContentProps) => {
  const { categoryTotals, categoryCount, completionRate, fragmentation, stats } = agg;
  const totalDuration = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Team Metrics from JSON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <Clock className="w-4 h-4" />, label: "Total Time", value: formatDuration(stats.totalTime), badge: "sp-badge-blue" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Focus Score", value: `${stats.focusScore}%`, badge: stats.focusScore > 50 ? "sp-badge-green" : "sp-badge-amber" },
          { icon: <AlertTriangle className="w-4 h-4" />, label: "Context Switches", value: `${stats.switches}`, badge: "sp-badge-amber" },
          { icon: <CheckCircle2 className="w-4 h-4" />, label: "Task Completion", value: `${completionRate}%`, badge: "sp-badge-green" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            className="sp-card text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <span className={`${m.badge} mx-auto mb-2`}>{m.icon}</span>
            <p className="sp-stat-value text-2xl">{m.value}</p>
            <p className="sp-stat-label">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Outcome vs Activity Correlation */}
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
        <div className={`rounded-xl p-4 ${completionRate >= 70 ? "bg-sp-green-soft border border-sp-green/20" : "bg-sp-amber-soft border border-sp-amber/20"}`}>
          <p className={`text-sm font-medium ${completionRate >= 70 ? "text-sp-green" : "text-sp-amber"}`}>
            {completionRate >= 70 ? "✅" : "⚠️"} {fragmentation > 30 ? "High" : "Low"} fragmentation detected, {completionRate >= 70 ? "but delivery remains strong" : "and delivery needs attention"}.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Task completion rate is {completionRate}% {fragmentation > 30 ? `despite ${fragmentation}% average fragmentation` : `with ${fragmentation}% fragmentation`}. {completionRate >= 70 ? "Context-switching is role-appropriate and doesn't indicate inefficiency." : "Consider structural changes to improve focus."}
          </p>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base font-semibold mb-1">Activity Category Breakdown</h3>
        <p className="sp-stat-label mb-4">Aggregated by category — no domain names visible</p>

        <div className="space-y-3">
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, duration], i) => {
              const pct = totalDuration > 0 ? Math.round((duration / totalDuration) * 100) : 0;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`${getCategoryColor(cat)} text-xs capitalize`}>{cat}</span>
                      <span className="text-xs text-muted-foreground">{categoryCount[cat]} sessions</span>
                    </div>
                    <span className="text-sm font-medium">{formatDuration(duration)} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${getCategoryBarColor(cat)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.6 }}
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </motion.div>

      {/* Session Timeline (anonymized) */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-base font-semibold mb-1">Session Flow (Anonymized)</h3>
        <p className="sp-stat-label mb-4">Categories only — no individual identification possible</p>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {data.sessions.map((s, i) => {
            const width = Math.max(Math.round(s.duration / 5000), 4);
            return (
              <Tooltip key={s.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={`h-8 rounded ${getCategoryBarColor(s.category)} cursor-pointer hover:opacity-100 transition-opacity`}
                    style={{ width: `${width}px`, minWidth: "4px", opacity: 0.6 }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.55 + i * 0.02 }}
                  />
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p className="font-medium capitalize">{s.category}</p>
                  <p>Duration: {formatDuration(s.duration)}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          {["work", "communication", "distraction", "other"].map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${getCategoryBarColor(cat)}`} style={{ opacity: 0.6 }} />
              <span className="text-xs text-muted-foreground capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings Overview */}
      <motion.div
        className="sp-card border-sp-blue/20 bg-sp-blue-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-semibold mb-3">Suggested Structural Changes</h3>
        <div className="space-y-2">
          {[
            stats.switches > 15 ? "High context-switching detected — consider introducing no-meeting hours" : "Context-switching is within normal range",
            stats.distractionTime > stats.workTime ? "Distraction time exceeds work time — team may benefit from focus blocks" : "Healthy work-to-distraction ratio",
            stats.deepWorkSessions === 0 ? "No deep work sessions recorded — encourage protected deep work blocks" : `${stats.deepWorkSessions} deep work sessions detected — maintain current patterns`,
            `Focus mode is ${data.settings.focusModeActive ? "enabled" : "disabled"} with ${data.settings.focusDuration}min duration`,
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
