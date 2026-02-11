import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, Clock, TrendingUp, Layers } from "lucide-react";
import FocusRing from "@/components/FocusRing";
import MetricCard from "@/components/MetricCard";
import WorkPatternTimeline from "@/components/WorkPatternTimeline";
import NudgeCard from "@/components/NudgeCard";
import TaskList from "@/components/TaskList";
import TimeBlockCalendar from "@/components/TimeBlockCalendar";
import WellnessReminder from "@/components/WellnessReminder";
import ManagerView from "@/components/ManagerView";
import DashboardNav from "@/components/DashboardNav";

const Index = () => {
  const [activeTab, setActiveTab] = useState("focus");

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
                <p className="text-[10px] text-muted-foreground -mt-0.5">Digital Wellness Monitor</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="sp-privacy-note hidden sm:flex">
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy-first · Your data stays yours</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                A
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="py-2">
            <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Focus Score Hero */}
            <div className="sp-card-glow flex flex-col md:flex-row items-center gap-8 py-8">
              <div className="flex-shrink-0">
                <FocusRing score={78} size={200} />
              </div>
              <div className="text-center md:text-left space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">Good morning, Alex</h2>
                  <p className="text-muted-foreground mt-1">Your focus score is looking strong today</p>
                </div>
                <motion.p
                  className="text-sm bg-sp-green-soft text-sp-green rounded-full px-4 py-2 inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  ✨ You were most focused between 10:30 – 12:00
                </motion.p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="Deep Work"
                value="3h 45m"
                subtitle="65% of active time"
                variant="green"
                delay={0.1}
              />
              <MetricCard
                icon={<Layers className="w-3.5 h-3.5" />}
                label="Fragmented"
                value="1h 20m"
                subtitle="23% · 42 switches"
                variant="amber"
                delay={0.2}
              />
              <MetricCard
                icon={<Clock className="w-3.5 h-3.5" />}
                label="Idle Time"
                value="0h 55m"
                subtitle="12% of day"
                variant="blue"
                delay={0.3}
              />
            </div>

            {/* Timeline */}
            <WorkPatternTimeline />
          </motion.div>
        )}

        {activeTab === "patterns" && (
          <motion.div key="patterns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <WorkPatternTimeline />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard icon={<TrendingUp className="w-3.5 h-3.5" />} label="Peak Focus" value="10:30 AM" subtitle="Consistent this week" variant="green" />
              <MetricCard icon={<Layers className="w-3.5 h-3.5" />} label="Avg Switches/hr" value="8.4" subtitle="Down 12% from last week" variant="amber" delay={0.1} />
              <MetricCard icon={<Clock className="w-3.5 h-3.5" />} label="Focus Streak" value="4 days" subtitle="Personal best!" variant="purple" delay={0.2} />
            </div>
          </motion.div>
        )}

        {activeTab === "nudges" && (
          <motion.div key="nudges" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <NudgeCard />
          </motion.div>
        )}

        {activeTab === "tasks" && (
          <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TaskList />
          </motion.div>
        )}

        {activeTab === "timeblock" && (
          <motion.div key="timeblock" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TimeBlockCalendar />
          </motion.div>
        )}

        {activeTab === "wellness" && (
          <motion.div key="wellness" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WellnessReminder />
          </motion.div>
        )}

        {activeTab === "manager" && (
          <motion.div key="manager" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ManagerView />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
