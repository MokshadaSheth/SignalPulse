import { motion } from "framer-motion";
import { Heart, Droplets, Wind, Eye, Shield } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      {/* Philosophy Card */}
      <motion.div
        className="sp-card border-sp-green/20 bg-sp-green-soft"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-sp-green flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Wellness Enables Performance</p>
            <p className="text-xs text-muted-foreground mt-1">
              These reminders are gentle suggestions, never forced. Your mental and physical health are first-class features, not add-ons.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="sp-card-glow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-1">Wellness Corner</h3>
        <p className="sp-stat-label mb-4">90 minutes of focus — you've earned a break</p>

        {/* Breathing Ring */}
        <div className="flex justify-center mb-5">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-sp-green/40 animate-breathe"
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-sp-green/25 animate-breathe"
              style={{ animationDelay: "0.5s" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-sp-green/15 animate-breathe"
              style={{ animationDelay: "1s" }}
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
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex-col gap-1.5 py-4 rounded-xl border-border/50 hover:bg-muted/50"
              >
                {r.icon}
                <span className="text-xs font-medium">{r.title}</span>
                <span className="text-[10px] text-muted-foreground">{r.message}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground italic text-center mt-4">
          Never forced. Never productivity-driven. Just care.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WellnessReminder;
