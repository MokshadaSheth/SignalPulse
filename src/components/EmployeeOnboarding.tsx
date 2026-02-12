import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Code, TestTube, Megaphone, Palette, Briefcase, Focus, LayoutGrid, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeOnboardingProps {
  onComplete: (profile: { role: string; workStyle: string }) => void;
}

const roles = [
  { id: "developer", label: "Developer", icon: Code },
  { id: "tester", label: "Tester", icon: TestTube },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "other", label: "Other", icon: Briefcase },
];

const workStyles = [
  { id: "focus-heavy", label: "Focus-Heavy", desc: "I do my best work in long, uninterrupted blocks", icon: Focus },
  { id: "balanced", label: "Balanced", desc: "I mix focused work with collaboration throughout the day", icon: LayoutGrid },
  { id: "flexible", label: "Flexible", desc: "My day varies — I context-switch often and that's okay", icon: Shuffle },
];

const EmployeeOnboarding = ({ onComplete }: EmployeeOnboardingProps) => {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-sp-green/5 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8 justify-center">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? "w-12 bg-primary" : "w-6 bg-border"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <motion.div key="role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
            <h2 className="text-2xl font-bold mb-2">What's your role?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This helps us set context-aware thresholds. A developer's "fragmentation" looks different from a marketer's.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {roles.map((r) => (
                <motion.button
                  key={r.id}
                  onClick={() => { setSelectedRole(r.id); setStep(1); }}
                  className={`sp-card flex flex-col items-center gap-2 py-5 hover:border-primary/40 transition-all ${
                    selectedRole === r.id ? "border-primary bg-primary/5" : ""
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <r.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">{r.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="style" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center">
            <h2 className="text-2xl font-bold mb-2">How do you prefer to work?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              There's no wrong answer. Signal Pulse adapts to your natural rhythm.
            </p>
            <div className="space-y-3">
              {workStyles.map((ws) => (
                <motion.button
                  key={ws.id}
                  onClick={() => setSelectedStyle(ws.id)}
                  className={`sp-card w-full flex items-center gap-4 text-left hover:border-primary/40 transition-all ${
                    selectedStyle === ws.id ? "border-primary bg-primary/5" : ""
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-sp-green-soft flex items-center justify-center flex-shrink-0">
                    <ws.icon className="w-5 h-5 text-sp-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{ws.label}</p>
                    <p className="text-xs text-muted-foreground">{ws.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Trust message */}
            <motion.div
              className="mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Your work patterns will be analyzed only to help you — never to evaluate you.</span>
            </motion.div>

            <Button
              onClick={() => onComplete({ role: selectedRole, workStyle: selectedStyle })}
              disabled={!selectedStyle}
              className="mt-6 rounded-full gap-2 px-8"
              size="lg"
            >
              Start My Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeOnboarding;
