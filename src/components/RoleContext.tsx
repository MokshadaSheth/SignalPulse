import { motion } from "framer-motion";
import { Info, Shield } from "lucide-react";

const RoleContext = ({ role = "developer" }: { role?: string }) => {
  const thresholds: Record<string, { fragThreshold: number; message: string }> = {
    developer: { fragThreshold: 45, message: "Developers often switch between code, docs, and reviews. This is normal." },
    tester: { fragThreshold: 55, message: "Testers naturally context-switch between test cases and tools. This is expected." },
    marketing: { fragThreshold: 60, message: "Marketing roles involve frequent tool switching across campaigns. Totally normal." },
    designer: { fragThreshold: 35, message: "Designers benefit from longer focus blocks. Your threshold reflects that." },
    other: { fragThreshold: 50, message: "Your fragmentation threshold is set to a balanced baseline." },
  };

  const ctx = thresholds[role] || thresholds.other;

  return (
    <motion.div
      className="sp-card border-sp-blue/20 bg-sp-blue-soft"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-sp-blue flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold mb-1">Role-Aware Context</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{ctx.message}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Your threshold:</span>
              <span className="sp-badge-blue text-xs">{ctx.fragThreshold}% switches/hr</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground italic">
              <Shield className="w-3 h-3" />
              <span>Compared to your own baseline, not others</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleContext;
