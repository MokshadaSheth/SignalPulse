import { motion, AnimatePresence } from "framer-motion";
import { MonitorX, Clock } from "lucide-react";
import { useLiveMetrics } from "@/hooks/useLiveMetrics";

const formatDuration = (ms: number) => {
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

const getWindowColor = (hash: string) => {
  // Generate consistent color from hash
  const hue = (parseInt(hash.slice(0, 8), 16) % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

const LiveWindowActivity = () => {
  const { metrics, backendConnected } = useLiveMetrics("EMP001");

  if (!backendConnected || !metrics?.recentSwitches || metrics.recentSwitches.length === 0) {
    return null;
  }

  const recentSwitches = metrics.recentSwitches.slice(-15).reverse(); // Last 15, newest first

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sp-card border-sp-blue/20 bg-gradient-to-br from-sp-blue-soft to-background"
    >
      <div className="flex items-center gap-2 mb-4">
        <MonitorX className="w-5 h-5 text-sp-blue" />
        <h3 className="text-sm font-semibold">Window Activity (Anonymous)</h3>
        <div className="ml-auto text-xs text-muted-foreground font-medium">
          {metrics.windowSwitchCount} switches, {metrics.uniqueWindowsCount} unique
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {recentSwitches.map((switchEvent, idx) => {
            const bgColor = getWindowColor(switchEvent.windowHash);
            const isCurrentWindow = idx === 0; // Most recent is current

            return (
              <motion.div
                key={`${switchEvent.windowHash}-${switchEvent.switchTime}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: idx * 0.04 }}
                className="p-3 rounded-lg border border-border/50 bg-muted/30 relative overflow-hidden"
              >
                {/* Current window indicator */}
                {isCurrentWindow && (
                  <motion.div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ background: bgColor }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}

                <div className="flex items-start justify-between gap-3 pl-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        #{switchEvent.windowHash}
                      </span>
                      {isCurrentWindow && (
                        <motion.span
                          className="text-xs bg-sp-green/20 text-sp-green px-2 py-0.5 rounded-full font-medium"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          Now
                        </motion.span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(switchEvent.activeDuration)}</span>
                      {isCurrentWindow && (
                        <span>• {formatDuration(metrics.currentSessionDuration)} current</span>
                      )}
                    </div>
                  </div>

                  {/* Window color badge */}
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ backgroundColor: bgColor }}
                  >
                    W
                  </div>
                </div>

                {/* Duration visualization */}
                <motion.div
                  className="mt-2 h-1 bg-black/5 rounded-full overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.04 + 0.1, duration: 0.3 }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${bgColor}, ${bgColor}80)`,
                      width: `${Math.min(100, (switchEvent.activeDuration / 300000) * 100)}%`,
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Activity summary */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">Active</div>
          <div className="font-medium text-foreground">{formatDuration(metrics.activeTimeToday)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Idle</div>
          <div className="font-medium text-foreground">{formatDuration(metrics.idleTimeToday)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Focus</div>
          <div className="font-medium text-foreground">{metrics.focusScore}%</div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 italic">
        🔒 Anonymous tracking: No app or site names stored. Window hashes + activity duration for ML model training only.
      </p>
    </motion.div>
  );
};

export default LiveWindowActivity;
