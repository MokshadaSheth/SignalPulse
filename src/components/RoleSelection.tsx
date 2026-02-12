import { motion } from "framer-motion";
import { User, Users, Shield, Lock, Eye, EyeOff } from "lucide-react";

interface RoleSelectionProps {
  onSelect: (role: "employee" | "manager") => void;
}

const RoleSelection = ({ onSelect }: RoleSelectionProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo & Tagline */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Signal Pulse</h1>
          <p className="text-lg text-muted-foreground font-medium">Measure outcomes. Respect humans.</p>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          An ethical, privacy-first workplace wellness platform that cares about your wellbeing — not your keystrokes.
        </motion.p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <motion.button
            onClick={() => onSelect("employee")}
            className="group relative sp-card text-left p-7 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-sp-green-soft flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-sp-green" />
            </div>
            <h2 className="text-xl font-semibold mb-2">I'm an Employee</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              See your personal focus patterns, get wellness nudges, and manage tasks — all privately.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="w-3.5 h-3.5 text-sp-green" />
                <span>Your focus patterns & insights</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-sp-green" />
                <span>100% private — only you see your data</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <EyeOff className="w-3.5 h-3.5 text-sp-green" />
                <span>No app names or keystrokes tracked</span>
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => onSelect("manager")}
            className="group relative sp-card text-left p-7 hover:border-accent/40 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-sp-blue-soft flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-sp-blue" />
            </div>
            <h2 className="text-xl font-semibold mb-2">I'm a Manager</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              View anonymized team trends and completion rates. Support your team, not surveil them.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-sp-blue" />
                <span>Aggregated team-level insights only</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <EyeOff className="w-3.5 h-3.5 text-sp-blue" />
                <span>No individual tracking — ever</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-sp-blue" />
                <span>Privacy by architecture, not policy</span>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          className="text-xs text-muted-foreground mt-8 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          "This app cares about me, not watches me."
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
