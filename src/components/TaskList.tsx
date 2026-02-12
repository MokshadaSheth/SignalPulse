import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Zap, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  focusLevel: "high" | "medium" | "quick";
  isOptimalNow: boolean;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: "1", title: "Finalize Q2 strategy deck", focusLevel: "high", isOptimalNow: true, completed: false },
  { id: "2", title: "Review pull requests", focusLevel: "medium", isOptimalNow: false, completed: false },
  { id: "3", title: "Reply to Slack threads", focusLevel: "quick", isOptimalNow: false, completed: true },
  { id: "4", title: "Write feature brief", focusLevel: "high", isOptimalNow: true, completed: false },
  { id: "5", title: "Update team standup notes", focusLevel: "quick", isOptimalNow: false, completed: true },
  { id: "6", title: "Debug login page issue", focusLevel: "high", isOptimalNow: false, completed: true },
];

const focusBadges = {
  high: { label: "High Focus", icon: <Zap className="w-3 h-3" />, class: "sp-badge-purple" },
  medium: { label: "Medium Focus", icon: <Clock className="w-3 h-3" />, class: "sp-badge-blue" },
  quick: { label: "Quick Task", icon: <Sparkles className="w-3 h-3" />, class: "sp-badge-green" },
};

const TaskList = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Outcome Message - THE KEY DIFFERENTIATOR */}
      {completedCount >= 3 && (
        <motion.div
          className="sp-card border-sp-green/30 bg-sp-green-soft"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sp-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-sp-green">You completed your goals even during high context switching.</p>
              <p className="text-xs text-muted-foreground mt-1">
                {completedCount} of {totalCount} tasks done today. Fragmentation doesn't define your productivity — outcomes do.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Task List */}
      <motion.div
        className="sp-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Prioritized Tasks</h3>
            <p className="text-xs text-muted-foreground">Smart ranking based on your focus patterns</p>
          </div>
          <span className="sp-badge-green">
            <CheckCircle2 className="w-3 h-3" />
            {completedCount}/{totalCount} done
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task, i) => {
            const badge = focusBadges[task.focusLevel];
            return (
              <motion.div
                key={task.id}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
                  task.isOptimalNow && !task.completed
                    ? "bg-sp-green-soft border border-sp-green/20 animate-gentle-float"
                    : "hover:bg-muted/40"
                } ${task.completed ? "opacity-50" : ""}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="rounded-full"
                />
                <span className={`flex-1 text-sm ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                </span>
                <span className={badge.class}>
                  {badge.icon}
                  {badge.label}
                </span>
                {task.isOptimalNow && !task.completed && (
                  <span className="text-xs text-sp-green font-medium">🌟 Optimal now</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground italic mt-4 text-center">
          Task completion matters more than how fragmented your work looks.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TaskList;
