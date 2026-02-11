import { motion } from "framer-motion";
import { Heart, Droplets, Wind, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const reminders = [
  { icon: <Wind className="w-5 h-5" />, title: "Breathing Break", message: "Take 3 deep breaths", color: "sp-green" },
  { icon: <Droplets className="w-5 h-5" />, title: "Hydration Check", message: "Time for some water 💧", color: "sp-blue" },
  { icon: <Eye className="w-5 h-5" />, title: "Eye Rest", message: "Look 20ft away for 20 sec", color: "sp-purple" },
  { icon: <Heart className="w-5 h-5" />, title: "Posture Check", message: "Straighten up & relax shoulders", color: "sp-amber" },
];

const WellnessReminder = () => {
  return (
    <motion.div
      className="sp-card-glow"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-1">Wellness Corner</h3>
      <p className="sp-stat-label mb-4">90 minutes of focus — you've earned a break</p>

      {/* Breathing Ring */}
      <div className="flex justify-center mb-5">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-sp-green/40 animate-breathe"
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-sp-green/25 animate-breathe"
            style={{ animationDelay: "0.5s" }}
          />
          <span className="text-xs font-medium text-sp-green">Breathe</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {reminders.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <Button
              variant="outline"
              className="w-full h-auto flex-col gap-1.5 py-3 rounded-xl border-border/50 hover:bg-muted/50"
            >
              {r.icon}
              <span className="text-xs font-medium">{r.title}</span>
              <span className="text-[10px] text-muted-foreground">{r.message}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WellnessReminder;
