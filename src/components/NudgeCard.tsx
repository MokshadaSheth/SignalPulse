import { motion } from "framer-motion";
import { Zap, Timer, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Nudge {
  id: string;
  message: string;
  type: "warning" | "suggestion" | "wellness";
}

const nudges: Nudge[] = [
  { id: "1", message: "You've switched apps 20 times in 10 minutes. Time for a focus sprint?", type: "warning" },
  { id: "2", message: "Your focus peaks between 10:30–12:00. Try scheduling deep work then.", type: "suggestion" },
  { id: "3", message: "You've been focused for 90 minutes — time to stretch? 🧘", type: "wellness" },
];

const NudgeCard = () => {
  return (
    <motion.div
      className="sp-card-glow"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-4">Smart Nudges</h3>

      <div className="space-y-3">
        {nudges.map((nudge, i) => (
          <motion.div
            key={nudge.id}
            className="rounded-xl border border-border/50 bg-muted/30 p-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
          >
            <p className="text-sm leading-relaxed mb-3">{nudge.message}</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="default" className="h-8 text-xs gap-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5" />
                Start Focus Mode
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 rounded-full">
                <Timer className="w-3.5 h-3.5" />
                Time-Block Task
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 rounded-full">
                <ListTodo className="w-3.5 h-3.5" />
                Add to To-Do
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NudgeCard;
