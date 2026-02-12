import { motion } from "framer-motion";
import { Activity, BarChart3, Bell, ListTodo, Calendar, Heart, Users, Brain } from "lucide-react";

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isManager?: boolean;
}

const employeeTabs = [
  { id: "focus", label: "Focus", icon: Activity },
  { id: "patterns", label: "Patterns", icon: BarChart3 },
  { id: "nudges", label: "Nudges", icon: Bell },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "timeblock", label: "Time Blocks", icon: Calendar },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "insights", label: "AI Insights", icon: Brain },
];

const managerTabs = [
  { id: "manager", label: "Team Dashboard", icon: Users },
];

const DashboardNav = ({ activeTab, onTabChange, isManager = false }: DashboardNavProps) => {
  const tabs = isManager ? managerTabs : employeeTabs;

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
