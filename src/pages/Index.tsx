import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PeakHoursInsight from "@/components/PeakHoursInsight";
import { Shield, Sparkles, Clock, TrendingUp, Layers } from "lucide-react";
import LandingPage from "@/components/LandingPage";
import RoleSelection from "@/components/RoleSelection";
import EmployeeOnboarding from "@/components/EmployeeOnboarding";
import FocusRing from "@/components/FocusRing";
import MetricCard from "@/components/MetricCard";
import WorkPatternTimeline from "@/components/WorkPatternTimeline";
import NudgeCard from "@/components/NudgeCard";
import TaskList from "@/components/TaskList";
import TimeBlockCalendar from "@/components/TimeBlockCalendar";
import WellnessReminder from "@/components/WellnessReminder";
import ManagerView from "@/components/ManagerView";
import AIInsights from "@/components/AIInsights";
import LiveTracker from "@/components/LiveTracker";
import RoleContext from "@/components/RoleContext";
import DashboardNav from "@/components/DashboardNav";
import ThemeToggle from "@/components/ThemeToggle";

type AppState = "landing" | "role-select" | "onboarding" | "dashboard";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [userRole, setUserRole] = useState<"employee" | "manager">("employee");
  const [profile, setProfile] = useState({ role: "developer", workStyle: "balanced" });
  const [activeTab, setActiveTab] = useState("focus");

  const handleRoleSelect = (role: "employee" | "manager") => {
    setUserRole(role);
    if (role === "manager") {
      setAppState("dashboard");
      setActiveTab("manager");
    } else {
      setAppState("onboarding");
    }
  };

  const handleOnboardingComplete = (p: { role: string; workStyle: string }) => {
    setProfile(p);
    setAppState("dashboard");
    setActiveTab("focus");
  };

  if (appState === "landing") {
    return <LandingPage onGetStarted={() => setAppState("role-select")} />;
  }

  if (appState === "role-select") {
    return <RoleSelection onSelect={handleRoleSelect} />;
  }

  if (appState === "onboarding") {
    return <EmployeeOnboarding onComplete={handleOnboardingComplete} />;
  }

  const isManagerOnly = userRole === "manager";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Signal Pulse</h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Measure outcomes. Respect humans.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="sp-privacy-note hidden sm:flex">
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy by architecture</span>
              </div>
              <ThemeToggle />
              <button
                onClick={() => setAppState("role-select")}
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                title="Switch role"
              >
                {userRole === "manager" ? "M" : "A"}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="py-2">
            <DashboardNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isManager={isManagerOnly}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "focus" && (
            <motion.div key="focus" {...pageTransition} className="space-y-6">
              {/* Focus Score Hero */}
              <div className="sp-card-glow flex flex-col md:flex-row items-center gap-8 py-8">
                <div className="flex-shrink-0">
                  <FocusRing score={78} size={200} />
                </div>
                <div className="text-center md:text-left space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold">Good morning, Alex</h2>
                    <p className="text-muted-foreground mt-1">Your focus pulse is looking strong today</p>
                  </div>
                  <motion.p
                    className="text-sm bg-sp-green-soft text-sp-green rounded-full px-4 py-2 inline-block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    ✨ You were most focused between 10:30 – 12:00
                  </motion.p>
                  <motion.p
                    className="text-xs text-muted-foreground italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    Fragmentation is contextual. Task completion matters most.
                  </motion.p>
                </div>
              </div>

              <RoleContext role={profile.role} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="Deep Work" value="3h 45m" subtitle="65% of active time" variant="green" delay={0.1} />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />} label="Fragmented" value="1h 20m" subtitle="Context-appropriate for your role" variant="amber" delay={0.2} />
                <MetricCard icon={<Clock className="w-3.5 h-3.5" />} label="Idle Time" value="0h 55m" subtitle="Breaks are healthy" variant="blue" delay={0.3} />
              </div>

              <WorkPatternTimeline />
            </motion.div>
          )}

          {activeTab === "tracker" && (
            <motion.div key="tracker" {...pageTransition}>
              <LiveTracker />
            </motion.div>
          )}

          {activeTab === "patterns" && (
            <motion.div key="patterns" {...pageTransition} className="space-y-6">
              <RoleContext role={profile.role} />
              <WorkPatternTimeline />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="Peak Focus" value="10:30 AM" subtitle="Consistent this week" variant="green" />
                <MetricCard icon={<Layers className="w-3.5 h-3.5" />} label="Avg Switches/hr" value="8.4" subtitle="Within your role baseline" variant="amber" delay={0.1} />
                <MetricCard icon={<Clock className="w-3.5 h-3.5" />} label="Focus Streak" value="4 days" subtitle="Personal best!" variant="purple" delay={0.2} />
              </div>
            </motion.div>
          )}

          {activeTab === "nudges" && (
            <motion.div key="nudges" {...pageTransition}>
              <NudgeCard />
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div key="tasks" {...pageTransition}>
              <TaskList />
            </motion.div>
          )}

          {activeTab === "timeblock" && (
            <motion.div key="timeblock" {...pageTransition}>
              <TimeBlockCalendar />
            </motion.div>
          )}

          {activeTab === "wellness" && (
            <motion.div key="wellness" {...pageTransition}>
              <WellnessReminder />
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div key="insights" {...pageTransition}>
              <AIInsights />
            </motion.div>
          )}

          {activeTab === "manager" && (
            <motion.div key="manager" {...pageTransition}>
              <ManagerView />
            </motion.div>
          )}

          {activeTab === "ai-insights-mgr" && (
            <motion.div key="ai-insights-mgr" {...pageTransition}>
              <PeakHoursInsight />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
