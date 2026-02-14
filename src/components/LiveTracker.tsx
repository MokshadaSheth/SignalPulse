import { motion } from "framer-motion";
import { useState } from "react";
import { Globe, ArrowLeftRight, Clock, Wifi, WifiOff, Activity } from "lucide-react";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";
import { useSignalPulseData } from "@/hooks/useSignalPulseData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const formatDuration = (ms: number) => {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ${secs % 60}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "work": return "text-sp-green bg-sp-green-soft";
    case "communication": return "text-sp-blue bg-sp-blue-soft";
    case "distraction": return "text-sp-amber bg-sp-amber-soft";
    default: return "text-sp-purple bg-sp-purple-soft";
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

const LiveTracker = () => {
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const { metrics, backendConnected } = useLiveMetrics("EMP001");
  const { data } = useSignalPulseData();

  // Real-time metrics from backend - always initialized to 0 values on load
  const switchCount = metrics.windowSwitchCount;
  const activeTime = metrics.activeTimeToday;
  const focusScore = metrics.focusScore;
  const uniqueWindows = metrics.uniqueWindowsCount;
  
  // Legacy session data from JSON (fallback only)
  const sessions = data?.sessions ?? [];

  // Show nudge when switches exceed 15 (unless dismissed)
  const showFragmentationNudge = switchCount > 15 && !dismissedNudge;

  const handleDismissNudge = () => {
    setDismissedNudge(true);
    // Reset nudge if switches go down below 15
    if (switchCount <= 15) {
      setDismissedNudge(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Connection Status */}
      <motion.div
        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
          backendConnected 
            ? "bg-sp-green-soft border border-sp-green/20 text-sp-green" 
            : "bg-muted border border-border text-muted-foreground"
        }`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {backendConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="font-medium">Live Window Tracking Active</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-sp-green ml-auto"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Backend offline — showing data from JSON file</span>
          </>
        )}
      </motion.div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: <ArrowLeftRight className="w-4 h-4" />,
            label: "Window Switches",
            value: String(switchCount),
            badge: "sp-badge-amber",
          },
          {
            icon: <Clock className="w-4 h-4" />,
            label: "Active Time",
            value: formatDuration(activeTime),
            badge: "sp-badge-blue",
          },
          {
            icon: <Activity className="w-4 h-4" />,
            label: "Focus Score",
            value: `${focusScore}%`,
            badge: "sp-badge-green",
          },
          {
            icon: <Globe className="w-4 h-4" />,
            label: "Unique Windows",
            value: String(uniqueWindows),
            badge: "sp-badge-purple",
          },
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

      {/* Fragmentation Nudge - triggers when switches > 15 */}
      {showFragmentationNudge && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          className="sp-card border-sp-amber/30 bg-gradient-to-r from-sp-amber-soft to-sp-amber-soft/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sp-amber/5 rounded-full -mr-16 -mt-16" />
          <div className="relative flex items-start gap-4">
            <div className="text-sp-amber text-2xl">⚡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">High Context-Switching Detected</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You've switched windows {switchCount} times. Consider taking a break or grouping similar tasks together to maintain focus.
              </p>
              <button 
                onClick={handleDismissNudge}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Session Timeline */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h3 className="text-base font-semibold mb-1">Session Timeline</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Your browsing sessions — only visible to you
        </p>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No sessions recorded yet</p>
          ) : (
            [...sessions].reverse().map((s, i) => (
              <motion.div
                key={s.id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(0.4 + i * 0.03, 1) }}
              >
                <div className={`w-2 h-8 rounded-full ${getCategoryBarColor(s.category)}`} style={{ opacity: 0.7 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{s.domain}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${getCategoryColor(s.category)}`}>
                      {s.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.startTime).toLocaleTimeString()} — {formatDuration(s.duration)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 pt-3 border-t border-border flex-wrap">
          {["work", "communication", "distraction", "other"].map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${getCategoryBarColor(cat)}`} style={{ opacity: 0.7 }} />
              <span className="text-xs text-muted-foreground capitalize">{cat}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Note */}
      <motion.p
        className="text-xs text-muted-foreground text-center italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        This data is private to you. Your manager can only see anonymized trends.
      </motion.p>
    </motion.div>
  );
};

export default LiveTracker;
