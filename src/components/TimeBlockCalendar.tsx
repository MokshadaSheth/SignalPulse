import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

interface TimeSlot {
  id: string;
  hour: string;
  task?: string;
  type: "deep" | "meeting" | "break" | "free";
}

const timeSlots: TimeSlot[] = [
  { id: "1", hour: "9:00", task: "Email & Slack triage", type: "meeting" },
  { id: "2", hour: "10:00", task: "Deep Work: Strategy Deck", type: "deep" },
  { id: "3", hour: "11:00", task: "Deep Work: Strategy Deck", type: "deep" },
  { id: "4", hour: "12:00", task: "Lunch & Recharge", type: "break" },
  { id: "5", hour: "13:00", task: "Team Sync", type: "meeting" },
  { id: "6", hour: "14:00", task: "Deep Work: Feature Brief", type: "deep" },
  { id: "7", hour: "15:00", type: "free" },
  { id: "8", hour: "16:00", task: "Code Review", type: "meeting" },
];

const typeConfig = {
  deep: { bg: "bg-sp-green/15 border-sp-green/30", label: "🛡️ Protected", text: "text-foreground" },
  meeting: { bg: "bg-sp-blue-soft border-sp-blue/20", label: "", text: "text-foreground" },
  break: { bg: "bg-sp-amber-soft border-sp-amber/20", label: "☕", text: "text-foreground" },
  free: { bg: "bg-muted/30 border-border/30", label: "Available", text: "text-muted-foreground" },
};

const TimeBlockCalendar = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* AI Suggestion */}
      <motion.div
        className="sp-card border-sp-purple/20 bg-sp-purple-soft"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sp-purple flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">AI-Suggested Deep Work Blocks</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your patterns, 10:00–12:00 is your natural peak. We've protected these blocks from interruptions.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Time Blocks</h3>
            <p className="text-xs text-muted-foreground">Signal Pulse adapts to your natural rhythm</p>
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sp-green" /> Deep Work</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sp-blue" /> Meeting</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sp-amber" /> Break</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {timeSlots.map((slot, i) => {
            const config = typeConfig[slot.type];
            return (
              <motion.div
                key={slot.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${config.bg} transition-all hover:scale-[1.01] cursor-pointer`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
              >
                <span className="text-xs font-mono text-muted-foreground w-12">{slot.hour}</span>
                <span className={`flex-1 text-sm font-medium ${config.text}`}>
                  {slot.task || "Free slot — drag a task here"}
                </span>
                {slot.type === "deep" && (
                  <span className="flex items-center gap-1 text-xs text-sp-green">
                    <Shield className="w-3 h-3" />
                    No interruptions
                  </span>
                )}
                {config.label && slot.type !== "deep" && (
                  <span className="text-xs">{config.label}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimeBlockCalendar;
